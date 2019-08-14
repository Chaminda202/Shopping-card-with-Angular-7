import {Component, OnInit} from '@angular/core';
import {ProductService} from '../service/product.service';
import {AuthService} from '../service/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertModel} from '../model/alert.model';
import {ProductModel} from '../model/product.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  productForm: FormGroup;
  productInputs: ProductModel;
  public alerts: Array<AlertModel> = [];
  sellerName: string;
  sellerId: number;
  productImage: File = null;
  public globalResponse: any;

  constructor(private productService: ProductService, private authService: AuthService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.compose(
        [Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      description: ['', Validators.compose(
        [Validators.required, Validators.minLength(10), Validators.maxLength(100)])],
      address: ['', Validators.compose(
        [Validators.required, Validators.minLength(10), Validators.maxLength(50)])],
      unitPrice: ['', Validators.compose(
        [Validators.required, Validators.pattern('^[0-9]+([.][0-9]{124})?$')])],
      category: ['', Validators.required],
      quantity: ['', Validators.compose([Validators.required, Validators.min(1)])],
      terms: ['', Validators.required]
    });
    this.sellerDetails();
  }

  sellerDetails() {
    this.sellerName = this.authService.getUserDetails().name;
    this.sellerId = this.authService.getUserDetails().user_id;
  }

  onFileSelect(event) {
    console.log(event);
    this.productImage = event.target.files[0] as File;
  }

  onSaveProduct() {
    this.productInputs = this.productForm.value;
    this.productInputs.sellerId = this.sellerId;
    this.productInputs.sellerName = this.sellerName;
    this.productInputs.productImage = this.productImage;
    console.log(this.productInputs);
    this.productService.saveProduct(this.productInputs)
      .subscribe(result => {
          this.globalResponse = result;
        },
        error => {
          this.alerts.push({
            id: 1,
            type: 'danger',
            message: 'Something went wrong while saving the product, Please try after sometime.'
          });
        },
        () => {
          if (this.globalResponse.STATUS) {
            this.productForm.reset();
            this.alerts.push({
              id: 1,
              type: 'success',
              message: 'Product has been saved successfully.'
            });
            setTimeout(() => {
              this.closeAlert(this.alerts);
            }, 2000);
          } else {
            if (this.globalResponse.DATA.MESSAGE === 'Invalid user name and password') {
              this.alerts.push({
                id: 1,
                type: 'danger',
                message: 'Invalid image type.'
              });
            } else {
              this.alerts.push({
                id: 1,
                type: 'danger',
                message: 'Internal server error.'
              });
            }
          }
        });
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
