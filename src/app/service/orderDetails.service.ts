import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class OrderDetailsService {
  url = 'http://localhost:8990/orders';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  saveOrderDetails(request: any) {
    console.log('Before call the order details service');
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.getToken()
    });
    // reqHeader.append('Content-Type', 'application/json');

    return this.httpClient.post(this.url, request, {headers: reqHeader})
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
  }
}
