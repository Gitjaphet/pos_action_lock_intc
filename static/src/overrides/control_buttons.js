import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { checkActionAccess } from "@pos_action_lock_intc/overrides/services/action_lock_service";

patch(ControlButtons.prototype, {
    async clickDiscount() {
        const allowed = await checkActionAccess(
            this.pos, this.dialog, "discount", _t("Remise")
        );
        if (!allowed) {
            return;
        }
        return super.clickDiscount(...arguments);
    },

    async clickRefund() {
        const allowed = await checkActionAccess(
            this.pos, this.dialog, "refund", _t("Remboursement")
        );
        if (!allowed) {
            return;
        }
        return super.clickRefund(...arguments);
    },

    async onCancelOrder() {
        const allowed = await checkActionAccess(
            this.pos, this.dialog, "cancel", _t("Annuler la commande")
        );
        if (!allowed) {
            return;
        }
        return super.onCancelOrder(...arguments);
    },
});