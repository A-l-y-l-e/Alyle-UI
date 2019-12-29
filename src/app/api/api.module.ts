import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyFieldModule } from '@alyle/ui/field';
import { LySelectModule } from '@alyle/ui/select';

import { ApiComponent } from './api.component';
import { ApiListComponent } from './api-list.component';
import { APIService } from './api.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ApiListComponent
  },
  {
    path: '**',
    component: ApiComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LyTypographyModule,
    LyFieldModule,
    LySelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ApiComponent,
    ApiListComponent
  ],
  providers: [
    APIService
  ]
})
export class ApiModule { }
