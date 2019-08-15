import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {ProductModel} from '../model/product.model';
import {AuthService} from './auth.service';

@Injectable()
export class ProductService {
  url = 'http://localhost:8990/products';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  saveProduct(request: ProductModel) {
    const reqHeader = new HttpHeaders({Authorization: 'Bearer ' + this.authService.getToken()});
    reqHeader.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    formData.append('name', request.name);
    formData.append('description', request.description);
    formData.append('address', request.address);
    formData.append('unitPrice', request.unitPrice.toString());
    formData.append('category', request.category.toString());
    formData.append('quantity', request.quantity.toString());
    formData.append('terms', request.terms.toString());
    formData.append('sellerId', request.sellerId.toString());
    formData.append('sellerName', request.sellerName);
    formData.append('image', request.productImage, request.productImage.name);

    console.log('Uploaded image :- ' + request.productImage + ' Image name ' + request.productImage.name);

    return this.httpClient.post(this.url, formData, {headers: reqHeader})
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  getAllProducts() {
    return this.httpClient.get(this.url)
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  getAllProductGroupByCategory() {
    return this.httpClient.get(this.url + '/display')
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  addProductToCart(product: any) {
    localStorage.setItem('product', JSON.stringify(product));
  }
  getProductFromCart() {
    return JSON.parse(localStorage.getItem('product'));
  }
  removeAllProductFromCart() {
    return localStorage.removeItem('product');
  }

  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
  }
}
