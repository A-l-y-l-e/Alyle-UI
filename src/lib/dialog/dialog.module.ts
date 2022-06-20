import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCommonModule, LyOverlayModule } from '@alyle/ui';

import { LyDialogContainer } from './dialog-container.component';
import { LyDialog } from './dialog';
import { LyDialogTitle } from './dialog-title.directive';
import { LyDialogContent } from './dialog-content.directive';
import { LyDialogActions } from './dialog-actions.directive';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    declarations: [
        LyDialogContainer,
        LyDialogTitle,
        LyDialogContent,
        LyDialogActions
    ],
    imports: [
        CommonModule,
        LyCommonModule,
        LyOverlayModule,
        A11yModule
    ],
    exports: [
        LyCommonModule,
        LyDialogContainer,
        LyDialogTitle,
        LyDialogContent,
        LyDialogActions
    ],
    providers: [
        LyDialog
    ]
})
export class LyDialogModule { }
