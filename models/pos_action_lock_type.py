from odoo import fields, models


class PosActionLockType(models.Model):
    _name = 'pos.action.lock.type'
    _description = "Action du PdV protégeable par mot de passe"
    _order = 'sequence, id'

    name = fields.Char(string="Action", required=True, translate=True)
    code = fields.Char(
        string="Code technique",
        required=True,
        help="Identifiant lu par l'interface du PdV pour savoir quelle action verrouiller.",
    )
    sequence = fields.Integer(default=10)

    _code_uniq = models.Constraint(
        'unique (code)',
        "Le code technique doit être unique.",
    )