import {Component, OnInit} from '@angular/core';
import {ProductService} from '../service/product.service';
import {ProductdisplayModel} from '../model/productdisplay.model';
import {AlertModel} from '../model/alert.model';
import {ProductRespnseModel} from '../model/productRespnse.model';
import {SharedService} from '../service/shared.service';

@Component({
  selector: 'app-productdisplay',
  templateUrl: './productdisplay.component.html',
  styleUrls: ['./productdisplay.component.css']
})
export class ProductdisplayComponent implements OnInit {
  productList: ProductdisplayModel[];
  public globalResponse: any;
  public alerts: Array<AlertModel> = [];
  productAddedToCart: ProductRespnseModel[];
  cartItemCount = 0;

  constructor(private productService: ProductService, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.productService.getAllProductGroupByCategory()
      .subscribe(result => {
          this.globalResponse = result;
        },
        error => {
          this.alerts.push({
            id: 1,
            type: 'danger',
            message: 'Something went wrong while retrieving the product, Please try after sometime.'
          });
        },
        () => {
          if (this.globalResponse.STATUS) {
            this.productList = this.globalResponse.DATA as ProductdisplayModel[];
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

  onAddToCart(prod: ProductRespnseModel) {
    console.log(prod);
    this.productAddedToCart = this.productService.getProductFromCart();
    if (this.productAddedToCart == null) {
      this.productAddedToCart = [];
      this.productAddedToCart.push(prod);
      this.productService.addProductToCart(this.productAddedToCart);
      this.alerts.push({
        id: 1,
        type: 'success',
        message: 'Product added to cart.'
      });
      console.log(this.productAddedToCart);
      setTimeout(() => {
        this.closeAlert(this.alerts);
      }, 3000);
    } else {
      const tempProduct = this.productAddedToCart.find(p => p.product_id === prod.product_id);
      if (tempProduct == null) {
        this.productAddedToCart.push(prod);
        this.productService.addProductToCart(this.productAddedToCart);
        this.alerts.push({
          id: 1,
          type: 'success',
          message: 'Product added to cart.'
        });

        setTimeout(() => {
          this.closeAlert(this.alerts);
        }, 2000);
      } else {
        {
          this.alerts.push({
            id: 2,
            type: 'warning',
            message: 'Product already exist in cart.'
          });
          setTimeout(() => {
            this.closeAlert(this.alerts);
          }, 2000);
        }
      }
      this.cartItemCount = this.productAddedToCart !== null ? this.productAddedToCart.length : 0;
      this.sharedService.updateCartCount(this.cartItemCount);
    }
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
