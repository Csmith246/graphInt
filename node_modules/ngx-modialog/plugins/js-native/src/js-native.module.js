import { NgModule } from '@angular/core';
import { Modal as BaseModal } from 'ngx-modialog';
import { Modal } from './modal';
export var /** @type {?} */ providers = [
    { provide: BaseModal, useClass: Modal },
    { provide: Modal, useClass: Modal }
];
var JSNativeModalModule = (function () {
    function JSNativeModalModule() {
    }
    /**
     * @return {?}
     */
    JSNativeModalModule.getProviders = function () {
        return providers;
    };
    JSNativeModalModule.decorators = [
        { type: NgModule, args: [{
                    providers: providers
                },] },
    ];
    /**
     * @nocollapse
     */
    JSNativeModalModule.ctorParameters = function () { return []; };
    return JSNativeModalModule;
}());
export { JSNativeModalModule };
function JSNativeModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    JSNativeModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    JSNativeModalModule.ctorParameters;
}
//# sourceMappingURL=js-native.module.js.map