import { patch } from "@web/core/utils/patch";
import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad";

patch(ActionpadWidget.prototype, {
    get intcCanPay() {
        const blocked = this.pos.config.intc_no_payment_employee_ids || [];
        if (!blocked.length) {
            return true;
        }
        const cashier = this.pos.getCashier();
        if (!cashier) {
            return true;
        }
        return !blocked.includes(cashier.id);
    },
});
