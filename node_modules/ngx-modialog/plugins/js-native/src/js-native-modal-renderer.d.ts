import { ViewContainerRef, ComponentRef } from '@angular/core';
import { DialogRef, OverlayRenderer, ModalOverlay } from 'ngx-modialog';
export declare class JSNativeModalRenderer implements OverlayRenderer {
    render(dialog: DialogRef<any>, vcRef: ViewContainerRef): ComponentRef<ModalOverlay>;
}
