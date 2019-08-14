import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RegistrationModel} from '../model/registration.model';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {UserDetailModels} from '../model/userDetail.models';

@Injectable()
export class AuthService {
  url = 'http://localhost:8990/users/login';

  constructor(private httpClient: HttpClient) {
  }

  login(req: RegistrationModel) {
    console.log('call auth service layer');
    return this.httpClient.post(this.url, req)
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  storeToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  removeToken() {
    return localStorage.removeItem('token');
  }
  storeUserDetails(userDetails: UserDetailModels) {
    this.removeUserDetails();
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
  }
  getUserDetails(): UserDetailModels {
    return JSON.parse(localStorage.getItem('userDetails'));
  }
  removeUserDetails() {
    return localStorage.removeItem('userDetails');
  }
}
