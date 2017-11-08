var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CSSDialogContainer } from 'ngx-modialog';
/**
 * A component that acts as a top level container for an open modal window.
 */
var VexCSSDialogContainer = (function (_super) {
    __extends(VexCSSDialogContainer, _super);
    function VexCSSDialogContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} overlay
     * @return {?}
     */
    VexCSSDialogContainer.prototype.apply = function (overlay) {
        overlay.setClickBoundary(this.vexContentContainer.nativeElement);
        if (this.dialog.inElement) {
            this.setStyle('padding', '20px 0 0 0');
            if (this.dialog.context.className === 'bottom-right-corner') {
                this.setStyle('overflow-y', 'hidden');
                this.renderer.setElementStyle(this.vexContentContainer.nativeElement, 'position', 'absolute');
            }
        }
    };
    VexCSSDialogContainer.decorators = [
        { type: Component, args: [{
                    selector: 'css-dialog-container',
                    host: {
                        'tabindex': '-1',
                        'role': 'dialog'
                    },
                    encapsulation: ViewEncapsulation.None,
                    template: "<div #clickBoundary class=\"{{dialog.context.contentClassName}}\"><ng-content></ng-content></div>"
                },] },
    ];
    /**
     * @nocollapse
     */
    VexCSSDialogContainer.ctorParameters = function () { return []; };
    VexCSSDialogContainer.propDecorators = {
        'vexContentContainer': [{ type: ViewChild, args: ['clickBoundary', { read: ElementRef },] },],
    };
    return VexCSSDialogContainer;
}(CSSDialogContainer));
export { VexCSSDialogContainer };
function VexCSSDialogContainer_tsickle_Closure_declarations() {
    /** @type {?} */
    VexCSSDialogContainer.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VexCSSDialogContainer.ctorParameters;
    /** @type {?} */
    VexCSSDialogContainer.propDecorators;
    /**
     * The div that wraps the content of the modal, by default use the class `vex-content`
     * @type {?}
     */
    VexCSSDialogContainer.prototype.vexContentContainer;
}
//# sourceMappingURL=vex-css-dialog-container.js.map