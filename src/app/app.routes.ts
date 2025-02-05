import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DataTableComponent } from './components/data-table/data-table.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
export const routes: Routes = [
  { path: '', component: DataTableComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
