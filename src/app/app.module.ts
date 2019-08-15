import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './service/auth.service';
import {ProfileComponent} from './profile/profile.component';
import {AdminComponent} from './admin/admin.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProductService} from './service/product.service';
import {ProductdisplayComponent} from './productdisplay/productdisplay.component';
import {SharedService} from './service/shared.service';
import { MycardComponent } from './mycard/mycard.component';
import {OrderDetailsService} from './service/orderDetails.service';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    AdminComponent,
    DashboardComponent,
    ProductdisplayComponent,
    MycardComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthService, ProductService, SharedService, OrderDetailsService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
