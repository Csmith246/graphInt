import { ContainerContent, Overlay, DialogRef, Modal as Modal_ } from 'ngx-modialog';
import { DropInPresetBuilder } from './presets/dropin-preset';
/**
 * Execute this method to flag that you are working with VEX version 3.
 */
export declare function vexV3Mode(): void;
export declare class Modal extends Modal_ {
    constructor(overlay: Overlay);
    alert(): DropInPresetBuilder;
    prompt(): DropInPresetBuilder;
    confirm(): DropInPresetBuilder;
    protected create(dialogRef: DialogRef<any>, content: ContainerContent): DialogRef<any>;
    private createV3(dialogRef, content);
}
