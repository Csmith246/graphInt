import { ElementRef } from '@angular/core';
import { CSSDialogContainer, ModalOverlay } from 'ngx-modialog';
/**
 * A component that acts as a top level container for an open modal window.
 */
export declare class VexCSSDialogContainer extends CSSDialogContainer {
    /**
     * The div that wraps the content of the modal, by default use the class `vex-content`
     */
    vexContentContainer: ElementRef;
    apply(overlay: ModalOverlay): void;
}
