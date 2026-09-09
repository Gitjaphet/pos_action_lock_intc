import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/services/pos_store";
import { checkActionAccess } from "@pos_action_lock_intc/overrides/services/action_lock_service";

patch(PosStore.prototype, {
    async setDiscountFromUI(line, val) {
        const allowed = await checkActionAccess(
            this, this.dialog, "discount", _t("Remise")
        );
        if (!allowed) {
            return;
        }
        return super.setDiscountFromUI(...arguments);
    },

    async onDeleteOrder(order) {
        const allowed = await checkActionAccess(
            this, this.dialog, "cancel", _t("Annuler la commande")
        );
        if (!allowed) {
            return false;
        }
        return super.onDeleteOrder(...arguments);
    },
});

