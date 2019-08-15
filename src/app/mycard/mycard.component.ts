import {Component, OnInit} from '@angular/core';
import {ProductRespnseModel} from '../model/productRespnse.model';
import {ProductService} from '../service/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertModel} from '../model/alert.model';
import {AuthService} from '../service/auth.service';
import {UserDetailModels} from '../model/userDetail.models';
import {OrderDetailsService} from '../service/orderDetails.service';
import {OrderDetailModel} from '../model/orderDetail.model';
import {OrderItemModel} from '../model/orderItem.model';

@Component({
  selector: 'app-mycard',
  templateUrl: './mycard.component.html',
  styleUrls: ['./mycard.component.css']
})
export class MycardComponent implements OnInit {
  productAddedToCart: ProductRespnseModel[];
  allTotal: number;
  deliveryForm: FormGroup;
  public alerts: Array<AlertModel> = [];
  currentUser: UserDetailModels;
  orderDetails: OrderDetailModel;
  items: OrderItemModel[];
  public globalResponse: any;
  isDisabled = true;

  constructor(private productService: ProductService, private formBuilder: FormBuilder, private authService: AuthService,
              private orderDetailsService: OrderDetailsService) {
  }

  ngOnInit() {
    this.deliveryForm = this.formBuilder.group({
      name: ['', Validators.compose(
        [Validators.required, Validators.minLength(4), Validators.maxLength(20)])],
      address: ['', Validators.compose(
        [Validators.required, Validators.minLength(10), Validators.maxLength(100)])],
      email: ['', Validators.compose(
        [Validators.required, Validators.email])],
      note: ['', '']
    });
    this.productAddedToCart = this.productService.getProductFromCart();

    if (this.productAddedToCart) {
      for (const prod of this.productAddedToCart) {
        prod.quantity = 1;
      }
      this.productService.removeAllProductFromCart();
      this.productService.addProductToCart(this.productAddedToCart);
      this.calculateTotal(this.productAddedToCart);
      this.isDisabled = false;
    }
    this.currentUser = this.authService.getUserDetails();
    // console.log('Current user name ' + this.currentUser.name + ' email ' + this.currentUser.email);
    if (this.currentUser) {
      this.deliveryForm.controls['name'.toString()].setValue(this.currentUser.name);
      this.deliveryForm.controls['email'.toString()].setValue(this.currentUser.email);
    }
  }

  onAddQuantity(prod: ProductRespnseModel) {
    this.productAddedToCart = this.productService.getProductFromCart();
    this.productAddedToCart
      .find(p => p.product_id === prod.product_id)
      .quantity = prod.quantity + 1;
    this.productService.removeAllProductFromCart();
    this.productService.addProductToCart(this.productAddedToCart);
    this.calculateTotal(this.productAddedToCart);
  }

  onRemoveQuantity(prod: ProductRespnseModel) {
    this.productAddedToCart = this.productService.getProductFromCart();
    this.productAddedToCart
      .find(p => p.product_id === prod.product_id)
      .quantity = prod.quantity - 1;
    this.productService.removeAllProductFromCart();
    this.productService.addProductToCart(this.productAddedToCart);
    this.calculateTotal(this.productAddedToCart);
  }

  onConfirmOrder() {
    /*this.orderDetails = {
      order_id: 0,
      customer_id: this.currentUser.user_id,
      customer_name: this.deliveryForm.controls['name'.toString()].value,
      delivery_address: this.deliveryForm.controls['address'.toString()].value,
      email: this.deliveryForm.controls['email'.toString()].value,
      order_items: []
    };*/

    /*this.orderDetails.customer_id = this.currentUser.user_id;
    this.orderDetails.customer_name = this.deliveryForm.controls['name'.toString()].value;
    this.orderDetails.delivery_address = this.deliveryForm.controls['address'.toString()].value;
    this.orderDetails.email = this.deliveryForm.controls['email'.toString()].value;*/

    const orderDeta: any = {};
    orderDeta.customer_id = this.currentUser.user_id;
    orderDeta.customer_name = this.deliveryForm.controls['name'.toString()].value;
    orderDeta.delivery_address = this.deliveryForm.controls['address'.toString()].value;
    orderDeta.email = this.deliveryForm.controls['email'.toString()].value;

    this.items = [];
    this.productAddedToCart.forEach(pro => {
      this.items.push({
        item_id: 0,
        product_id: pro.product_id,
        product_name: pro.name,
        unit_price: pro.unit_price,
        ordered_quantity: pro.quantity,
        seller_id: pro.seller_id
      });
    });
    // this.orderDetails.order_items = this.items;
    orderDeta.order_items = this.items;
    this.orderDetailsService.saveOrderDetails(orderDeta)
      .subscribe(result => {
          this.globalResponse = result;
        },
        error => {
          this.alerts.push({
            id: 1,
            type: 'danger',
            message: 'Something went wrong while ordering the product, Please try after sometime.'
          });
        },
        () => {
          if (this.globalResponse.STATUS) {
            this.orderDetails = this.globalResponse.DATA as OrderDetailModel;
            console.log('Order id ' + this.orderDetails.order_id);
            this.alerts.push({
              id: 1,
              type: 'success',
              message: 'Order has been placed successfully.'
            });
            this.resetPageContent();
          } else {
            this.alerts.push({
              id: 1,
              type: 'danger',
              message: 'Internal server error.'
            });
          }
        }
      );
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  private calculateTotal(productAddedToCart: ProductRespnseModel[]) {
    this.allTotal = 0;
    productAddedToCart.forEach(item => {
      this.allTotal += item.unit_price * item.quantity;
    });
  }

  private resetPageContent() {
    this.productService.removeAllProductFromCart();
    this.productAddedToCart = [];
    this.allTotal = 0;
  }

  private disappearAlert() {
    setTimeout(() => {
      this.closeAlert(this.alerts);
    }, 2000);
  }
}
