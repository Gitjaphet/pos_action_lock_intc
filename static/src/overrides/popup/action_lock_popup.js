import { Component, onMounted, useRef, useState } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";
import { _t } from "@web/core/l10n/translation";

export class ActionLockPopup extends Component {
    static template = "pos_action_lock_intc.ActionLockPopup";
    static components = { Dialog };
    static props = {
        title: { type: String, optional: true },
        placeholder: { type: String, optional: true },
        errorMessage: { type: String, optional: true },
        getPayload: Function,
        close: Function,
    };
    static defaultProps = {
        title: _t("Action protégée"),
        placeholder: _t("Mot de passe"),
        errorMessage: "",
    };

    setup() {
        this.state = useState({ inputValue: "" });
        this.inputRef = useRef("input");
        onMounted(() => this.inputRef.el?.focus());
    }

    confirm() {
        this.props.getPayload(this.state.inputValue);
        this.props.close();
    }

    close() {
        this.props.close();
    }

    onKeydown(ev) {
        if (ev.key.toUpperCase() === "ENTER") {
            ev.preventDefault();
            ev.stopPropagation();
            if (this.state.inputValue) {
                this.confirm();
            }
        }
    }
}