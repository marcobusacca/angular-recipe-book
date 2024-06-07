import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from '../_service/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { PlaceholderDirective } from '../_directive/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild('authForm') authForm: NgForm;
  isLoginMode = true;
  isLoading = false;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeAlertComponentSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    this.isLoading = true;

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      responseData => {
        this.isLoading = false;
        this.router.navigate(['recipes']);
      },
      errorMessage => {
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    this.authForm.reset();
  }

  private showErrorAlert(errorMessage: string) {
    const alertComponentFactory: ComponentFactory<AlertComponent> = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef: ViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef: ComponentRef<AlertComponent> = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = errorMessage;
    this.closeAlertComponentSubscription = componentRef.instance.closeComponent.subscribe(
      () => {
        hostViewContainerRef.clear();
        this.closeAlertComponentSubscription.unsubscribe();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.closeAlertComponentSubscription) {
      this.closeAlertComponentSubscription.unsubscribe();
    }
  }
}
