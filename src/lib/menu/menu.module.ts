import { LyMenuTriggerFor, LyTemplateMenu } from './menu';
import { LyMenu } from './menu';
import { ThemeModule, LxDomModule } from 'alyle-ui/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from'@angular/core';

@NgModule({
  imports: [CommonModule, FormsModule, ThemeModule, LxDomModule],
  exports: [LyMenu, LyMenuTriggerFor],
  declarations: [LyMenu, LyMenuTriggerFor, LyTemplateMenu],
})
export class LyMenuModule { }
