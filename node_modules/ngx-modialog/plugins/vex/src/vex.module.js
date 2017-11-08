import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, Modal as BaseModal } from 'ngx-modialog';
import { Modal } from './modal';
import { DialogFormModal, FormDropIn, VEXDialogButtons } from './dialog-form-modal';
import { VexCSSDialogContainer } from './vex-css-dialog-container';
export var /** @type {?} */ providers = [
    { provide: BaseModal, useClass: Modal },
    { provide: Modal, useClass: Modal }
];
var VexModalModule = (function () {
    function VexModalModule() {
    }
    /**
     * @return {?}
     */
    VexModalModule.getProviders = function () {
        return providers;
    };
    VexModalModule.decorators = [
        { type: NgModule, args: [{
                    imports: [ModalModule, CommonModule],
                    declarations: [
                        VexCSSDialogContainer,
                        VEXDialogButtons,
                        FormDropIn,
                        DialogFormModal
                    ],
                    providers: providers,
                    entryComponents: [
                        VexCSSDialogContainer,
                        DialogFormModal,
                        FormDropIn
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    VexModalModule.ctorParameters = function () { return []; };
    return VexModalModule;
}());
export { VexModalModule };
function VexModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    VexModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VexModalModule.ctorParameters;
}
//# sourceMappingURL=vex.module.js.map