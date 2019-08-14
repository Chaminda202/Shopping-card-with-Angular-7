import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegistrationService} from './service/registration.service';
import {RegistrationModel} from './model/registration.model';
import {AlertModel} from './model/alert.model';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from './service/auth.service';
import {SharedService} from './service/shared.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RegistrationService]
})
export class AppComponent implements OnInit {
  registrationForm: FormGroup;
  loginForm: FormGroup;
  registrationInputs: RegistrationModel;
  loginDetails: RegistrationModel;
  public alerts: Array<AlertModel> = [];
  public globalResponse: any;
  closeResult: string;
  isLogin = false;
  cartItemCount = 0;

  constructor(private registrationService: RegistrationService, private formBuilder: FormBuilder,
              private modalService: NgbModal, private authService: AuthService,
              private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.sharedService.currentMessage.subscribe(msg => this.cartItemCount = msg);
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.compose(
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      password: ['', Validators.compose(
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)])]
    });

    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.compose(
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      password: ['', Validators.compose(
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      role: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required]
    });
    if (this.authService.isAuthenticated()) {
      console.log('Check user already login or not');
      this.isLogin = true;
    }
  }

  onRegister() {
    this.registrationInputs = this.registrationForm.value;
    console.log(this.registrationForm.value);
    this.registrationService
      .registerUser(this.registrationInputs)
      .subscribe(result => {
          this.globalResponse = result;
        },
        error => {
          this.alerts.push({
            id: 1,
            type: 'danger',
            message: 'Something went wrong register user, Please try after sometime.'
          });
          this.removeAlert();
        },
        () => {
          this.registrationForm.reset();
          this.alerts.push({
            id: 1,
            type: 'success',
            message: 'Registration successful.'
          });
          this.removeAlert();
        });
  }

  onLogin() {
    this.loginDetails = this.loginForm.value;
    console.log(this.loginForm.value);
    this.alerts = [];
    this.clearStorage();
    this.authService
      .login(this.loginDetails)
      .subscribe(result => {
          this.globalResponse = result;
        },
        error => {
          this.alerts.push({
            id: 1,
            type: 'danger',
            message: 'Login failed with following error' + error
          });
          this.removeAlert();
        },
        () => {
          if (this.globalResponse.STATUS) {
            console.log('Token value ' + this.globalResponse.TOKEN + ' Role value ' + this.globalResponse.DATA.role);
            this.authService.storeToken(this.globalResponse.TOKEN);
            this.authService.storeUserDetails({
              name: this.globalResponse.DATA.name,
              user_id: this.globalResponse.DATA.user_id,
              role: this.globalResponse.DATA.role
            });
            this.alerts.push({
              id: 1,
              type: 'success',
              message: 'Login successful.'
            });
            this.isLogin = true;
            this.loginForm.reset();
            this.removeAlert();
          } else {
            if (this.globalResponse.MESSAGE === 'Invalid user name and password') {
              this.alerts.push({
                id: 1,
                type: 'danger',
                message: 'Invalid user name and password.'
              });
            } else {
              this.alerts.push({
                id: 1,
                type: 'danger',
                message: 'Internal server error.'
              });
            }
            this.removeAlert();
          }
        });
  }

  removeAlert() {
    setTimeout(() => {
      this.closeAlert(this.alerts);
    }, 2000);
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  open(content) {
    this.alerts = [];
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, reason => {
      this.closeResult = `Dismissed ${this.getDismissedReason(reason)}`;
    });
  }

  private getDismissedReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking backdrop';
    }
    return `with ${reason}`;
  }

  /*open(content) {
    this.modalService.open(content, {size: 'lg'});
  }*/

  logout() {
    this.clearStorage();
  }

  private clearStorage() {
    this.isLogin = false;
    this.authService.removeToken();
    this.authService.removeUserDetails();
  }
}
