from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pos_intc_lock_actions = fields.Boolean(
        related='pos_config_id.intc_lock_actions', readonly=False)
    pos_intc_lock_mode = fields.Selection(
        related='pos_config_id.intc_lock_mode', readonly=False)
    pos_intc_lock_user_id = fields.Many2one(
        related='pos_config_id.intc_lock_user_id', readonly=False)
    pos_intc_lock_password = fields.Char(
        related='pos_config_id.intc_lock_password', readonly=False)
    pos_intc_lock_type_ids = fields.Many2many(
        related='pos_config_id.intc_lock_type_ids', readonly=False)
    pos_intc_no_payment_employee_ids = fields.Many2many(
        related='pos_config_id.intc_no_payment_employee_ids',
        readonly=False,
    )