import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {AdminComponent} from './admin/admin.component';
import {AuthGuard} from './service/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProductdisplayComponent} from './productdisplay/productdisplay.component';
import {MycardComponent} from './mycard/mycard.component';

const routes: Routes = [
  {path: '', component: ProductdisplayComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'productdisplay', component: ProductdisplayComponent},
  {path: 'mycart', component: MycardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
