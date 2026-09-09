import { _t } from "@web/core/l10n/translation";
import { makeAwaitable } from "@point_of_sale/app/utils/make_awaitable_dialog";
import { ActionLockPopup } from "@pos_action_lock_intc/overrides/popup/action_lock_popup";

/**
 * Demande le mot de passe et le fait vérifier par le serveur.
 *
 * @param {Object} pos   le store du PdV (this.pos)
 * @param {Object} dialog le service dialog (this.dialog)
 * @param {String} actionCode  "discount" | "refund" | "cancel"
 * @param {String} actionLabel libellé affiché dans la popup
 * @returns {Promise<Boolean>} true si l'action peut se poursuivre
 */
export async function checkActionAccess(pos, dialog, actionCode, actionLabel) {
    const config = pos.config;

    // Protection désactivée ou action non listée : rien à demander.
    if (!config.intc_lock_actions) {
        return true;
    }
    const lockedCodes = (config.intc_lock_type_ids || []).map((t) => t.code);
    if (!lockedCodes.includes(actionCode)) {
        return true;
    }

    let errorMessage = "";
    while (true) {
        const password = await makeAwaitable(dialog, ActionLockPopup, {
            title: actionLabel || _t("Action protégée"),
            placeholder: _t("Mot de passe"),
            errorMessage,
        });

        // Popup fermée ou annulée : on abandonne l'action.
        if (password === undefined) {
            return false;
        }

        const isValid = await pos.data.call(
            "pos.config",
            "intc_verify_action_password",
            [config.id, actionCode, password]
        );

        if (isValid) {
            return true;
        }
        errorMessage = _t("Mot de passe incorrect.");
    }
}