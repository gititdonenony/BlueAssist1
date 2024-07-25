import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadDocsPage } from './upload-docs.page';

const routes: Routes = [
  {
    path: '',
    component: UploadDocsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadDocsPageRoutingModule {}
