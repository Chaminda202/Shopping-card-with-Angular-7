import {Component, OnInit} from '@angular/core';
import {ProductRespnseModel} from '../model/productRespnse.model';
import {ProductService} from '../service/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertModel} from '../model/alert.model';

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

  constructor(private productService: ProductService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.deliveryForm = this.formBuilder.group({
      name: ['', Validators.compose(
        [Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      address: ['', Validators.compose(
        [Validators.required, Validators.minLength(10), Validators.maxLength(100)])],
      email: ['', Validators.compose(
        [Validators.required, Validators.minLength(10), Validators.maxLength(50)])],
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

  private calculateTotal(productAddedToCart: ProductRespnseModel[]) {
    this.allTotal = 0;
    productAddedToCart.forEach(item => {
      this.allTotal += item.unit_price * item.quantity;
    });
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  disappearAlert() {
    setTimeout(() => {
      this.closeAlert(this.alerts);
    }, 2000);
  }
}
