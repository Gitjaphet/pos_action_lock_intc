from odoo import api, fields, models, _
from odoo.exceptions import ValidationError

PARAM_PREFIX = 'pos_action_lock_intc.password'


class PosConfig(models.Model):
    _inherit = 'pos.config'

    intc_lock_actions = fields.Boolean(
        string="Protéger les actions sensibles",
        help="Demande un mot de passe avant d'exécuter les actions cochées ci-dessous.",
    )
    intc_lock_mode = fields.Selection(
        selection=[
            ('user', "Mot de passe d'un utilisateur Odoo"),
            ('password', "Mot de passe personnalisé"),
        ],
        string="Mode de déverrouillage",
        default='password',
    )
    intc_lock_user_id = fields.Many2one(
        'res.users',
        string="Utilisateur autorisé",
        help="Le mot de passe Odoo de cet utilisateur déverrouille les actions protégées.",
    )
    intc_lock_password = fields.Char(
        string="Mot de passe personnalisé",
        compute='_compute_intc_lock_password',
        inverse='_inverse_intc_lock_password',
        store=False,
        help="Laisser vide pour conserver le mot de passe déjà enregistré.",
    )
    intc_lock_type_ids = fields.Many2many(
        'pos.action.lock.type',
        string="Actions protégées",
    )

    def _intc_password_param_key(self):
        self.ensure_one()
        return '%s.%s' % (PARAM_PREFIX, self.id)

    def _compute_intc_lock_password(self):
        # Ne jamais renvoyer le hash : le champ reste vide à l'affichage.
        for config in self:
            config.intc_lock_password = ''

    def _inverse_intc_lock_password(self):
        ICP = self.env['ir.config_parameter'].sudo()
        crypt = self.env['res.users']._crypt_context()
        for config in self:
            if not config.intc_lock_password:
                continue
            ICP.set_param(
                config._intc_password_param_key(),
                crypt.hash(config.intc_lock_password),
            )

    @api.constrains('intc_lock_actions', 'intc_lock_mode', 'intc_lock_user_id')
    def _check_intc_lock_config(self):
        for config in self:
            if config.intc_lock_actions and config.intc_lock_mode == 'user' \
                    and not config.intc_lock_user_id:
                raise ValidationError(_(
                    "Sélectionnez un utilisateur autorisé, ou basculez sur "
                    "le mode « Mot de passe personnalisé »."
                ))


    @api.model
    def intc_verify_action_password(self, config_id, action_code, password):
        """Vérifie le mot de passe saisi au PdV pour une action protégée.

        Retourne True/False uniquement — aucun secret ne remonte au client.
        """
        config = self.browse(config_id).sudo()
        if not config.exists():
            return False

        # Action non protégée : pas de mot de passe requis.
        if not config.intc_lock_actions:
            return True
        if action_code not in config.intc_lock_type_ids.mapped('code'):
            return True

        if not password:
            return False

        crypt = self.env['res.users']._crypt_context()

        if config.intc_lock_mode == 'user':
            user = config.intc_lock_user_id
            if not user:
                return False
            self.env.cr.execute(
                "SELECT COALESCE(password, '') FROM res_users WHERE id = %s",
                [user.id],
            )
            row = self.env.cr.fetchone()
            hashed = row[0] if row else ''
            if not hashed:
                return False
            return bool(crypt.verify(password, hashed))

        stored = self.env['ir.config_parameter'].sudo().get_param(
            config._intc_password_param_key()
        )
        if not stored:
            return False
        return bool(crypt.verify(password, stored))