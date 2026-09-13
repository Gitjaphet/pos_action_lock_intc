import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { checkActionAccess } from "@pos_action_lock_intc/overrides/services/action_lock_service";

patch(ProductScreen.prototype, {
    async onNumpadClick(buttonValue) {
        let actionCode = null;
        let actionLabel = "";

        if (buttonValue === "discount") {
            actionCode = "discount";
            actionLabel = _t("Remise sur la ligne");
        } else if (buttonValue === "price") {
            actionCode = "price";
            actionLabel = _t("Modifier le prix");
        } else if (
            buttonValue === "Backspace" &&
            this.pos.numpadMode === "quantity" &&
            !this.numberBuffer.get()
        ) {
            // Buffer vide en mode quantite : la touche va supprimer la ligne.
            actionCode = "line_delete";
            actionLabel = _t("Supprimer une ligne");
        }

        if (actionCode) {
            const allowed = await checkActionAccess(
                this.pos,
                this.dialog,
                actionCode,
                actionLabel
            );
            if (!allowed) {
                return;
            }
        }

        return super.onNumpadClick(buttonValue);
    },
});
