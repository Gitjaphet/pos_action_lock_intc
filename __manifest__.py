{
    'name': 'POS Action Lock INTC',
    'version': '19.0.1.0.0',
    'category': 'Point of Sale',
    'summary': "Protection par mot de passe des actions sensibles du PdV (remise, remboursement, annulation)",
    'author': 'INTC',
    'license': 'LGPL-3',
    'depends': ['point_of_sale'],
    'data': [
        'security/ir.model.access.csv',
        'data/pos_action_lock_type_data.xml',
        'views/res_config_settings_views.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_action_lock_intc/static/src/overrides/**/*',
        ],
    },
    'installable': True,
    'auto_install': False,
}