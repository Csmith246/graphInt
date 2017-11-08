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
import { combineLatest } from 'rxjs/operator/combineLatest';
import { Injectable } from '@angular/core';
import { Overlay, DROP_IN_TYPE, Modal as Modal_, CSSBackdrop, CSSDialogContainer, PromiseCompleter } from 'ngx-modialog';
import { DropInPresetBuilder } from './presets/dropin-preset';
import { VexCSSDialogContainer } from './vex-css-dialog-container';
// TODO: use DI factory for this.
// TODO: consolidate dup code
var /** @type {?} */ isDoc = !(typeof document === 'undefined' || !document);
var /** @type {?} */ vexV3 = false;
/**
 * Execute this method to flag that you are working with VEX version 3.
 * @return {?}
 */
export function vexV3Mode() {
    vexV3 = true;
}
var Modal = (function (_super) {
    __extends(Modal, _super);
    /**
     * @param {?} overlay
     */
    function Modal(overlay) {
        return _super.call(this, overlay) || this;
    }
    /**
     * @return {?}
     */
    Modal.prototype.alert = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.alert, /** @type {?} */ ({ isBlocking: false }));
    };
    /**
     * @return {?}
     */
    Modal.prototype.prompt = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.prompt, /** @type {?} */ ({
            isBlocking: true,
            keyboard: null
        }));
    };
    /**
     * @return {?}
     */
    Modal.prototype.confirm = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.confirm, /** @type {?} */ ({
            isBlocking: true,
            keyboard: null
        }));
    };
    /**
     * @param {?} dialogRef
     * @param {?} content
     * @return {?}
     */
    Modal.prototype.create = function (dialogRef, content) {
        var _this = this;
        if (vexV3 === true) {
            return this.createV3(dialogRef, content);
        }
        var /** @type {?} */ backdropRef = this.createBackdrop(dialogRef, CSSBackdrop);
        var /** @type {?} */ containerRef = this.createContainer(dialogRef, VexCSSDialogContainer, content);
        var /** @type {?} */ overlay = dialogRef.overlayRef.instance;
        var /** @type {?} */ backdrop = backdropRef.instance;
        var /** @type {?} */ container = containerRef.instance;
        if (dialogRef.inElement) {
            overlay.insideElement();
            overlay.setContainerStyle('position', 'relative')
                .setContainerStyle('height', '100%')
                .setContainerStyle('width', '100%');
            backdrop.setStyle('position', 'absolute')
                .setStyle('display', 'block')
                .setStyle('height', '100%')
                .setStyle('width', '100%');
            container.setStyle('position', 'relative')
                .setStyle('display', 'block')
                .setStyle('height', '100%')
                .setStyle('width', '100%');
        }
        else {
            overlay.fullscreen();
        }
        // add body class if this is the only dialog in the stack
        if (isDoc && !document.body.classList.contains('vex-open')) {
            document.body.classList.add('vex-open');
        }
        backdrop.addClass('vex-overlay');
        container.addClass("vex vex-theme-" + dialogRef.context.className);
        container.setStyle('display', 'block');
        if (containerRef.location.nativeElement) {
            containerRef.location.nativeElement.focus();
        }
        overlay.beforeDestroy(function () {
            backdrop.addClass('vex-closing');
            container.addClass('vex-closing');
            var /** @type {?} */ completer = new PromiseCompleter();
            var /** @type {?} */ animationEnd$ = backdrop.myAnimationEnd$();
            // TODO: the child element inside the container (vex-content) is the one with animation
            // need to also wait for it to end, but this requires a reference to to it.
            // the container itself is its parent, won't do.
            // animationEnd$ = combineLatest.call(animationEnd$, container.myAnimationEnd$(), (s1, s2) => [s1,s2] );
            animationEnd$.subscribe(function (sources) {
                isDoc && _this.overlay.groupStackLength(dialogRef) === 1 && document.body.classList.remove('vex-open');
                completer.resolve();
            });
            return completer.promise;
        });
        container.apply(overlay);
        return dialogRef;
    };
    /**
     * @param {?} dialogRef
     * @param {?} content
     * @return {?}
     */
    Modal.prototype.createV3 = function (dialogRef, content) {
        var _this = this;
        var /** @type {?} */ backdropRef = this.createBackdrop(dialogRef, CSSBackdrop);
        var /** @type {?} */ containerRef = this.createContainer(dialogRef, CSSDialogContainer, content);
        var /** @type {?} */ overlay = dialogRef.overlayRef.instance;
        var /** @type {?} */ backdrop = backdropRef.instance;
        var /** @type {?} */ container = containerRef.instance;
        dialogRef.inElement ? overlay.insideElement() : overlay.fullscreen();
        // add body class if this is the only dialog in the stack
        if (isDoc && !document.body.classList.contains('vex-open')) {
            document.body.classList.add('vex-open');
        }
        overlay.addClass("vex vex-theme-" + dialogRef.context.className);
        backdrop.addClass('vex-overlay');
        container.addClass(dialogRef.context.contentClassName);
        container.setStyle('display', 'block');
        if (dialogRef.inElement) {
            overlay.setStyle('padding', '0');
            container.setStyle('margin-top', '20px');
        }
        if (containerRef.location.nativeElement) {
            containerRef.location.nativeElement.focus();
        }
        if (dialogRef.context.className === 'bottom-right-corner') {
            overlay.setStyle('overflow-y', 'hidden');
            container.setStyle('position', 'absolute');
        }
        overlay.beforeDestroy(function () {
            overlay.addClass('vex-closing');
            var /** @type {?} */ completer = new PromiseCompleter();
            var /** @type {?} */ animationEnd$ = container.myAnimationEnd$();
            if (dialogRef.context.className !== 'bottom-right-corner') {
                animationEnd$ = combineLatest.call(animationEnd$, backdrop.myAnimationEnd$(), function (s1, s2) { return [s1, s2]; });
            }
            animationEnd$.subscribe(function (sources) {
                isDoc && _this.overlay.groupStackLength(dialogRef) === 1 && document.body.classList.remove('vex-open');
                completer.resolve();
            });
            return completer.promise;
        });
        overlay.setClickBoundary(containerRef.location.nativeElement);
        return dialogRef;
    };
    Modal.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    Modal.ctorParameters = function () { return [
        { type: Overlay, },
    ]; };
    return Modal;
}(Modal_));
export { Modal };
function Modal_tsickle_Closure_declarations() {
    /** @type {?} */
    Modal.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Modal.ctorParameters;
}
//# sourceMappingURL=modal.js.map