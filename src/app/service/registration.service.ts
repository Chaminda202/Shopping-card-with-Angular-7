import {HttpClient} from '@angular/common/http';
import {RegistrationModel} from '../model/registration.model';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class RegistrationService {
  url = 'http://localhost:8990/users';

  constructor(private httpClient: HttpClient) {
  }

  registerUser(req: RegistrationModel) {
    console.log('call service layer');
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
}
