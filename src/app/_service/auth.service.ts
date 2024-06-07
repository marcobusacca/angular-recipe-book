import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "../_model/user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User>(null);

    private tokenExpirationTimer: any;

    private apiKey = 'AIzaSyA6Qp6Xl2qdAH9cE2Rv08XUmt7TDUWoNN0';

    constructor(private http: HttpClient, private router: Router) { }

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(
                tap(responseData => {
                    this.handleAuthentication(
                        responseData.email,
                        responseData.localId,
                        responseData.idToken,
                        +responseData.expiresIn
                    );
                }),
                catchError(this.handleError)
            )
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(
                tap(responseData => {
                    this.handleAuthentication(
                        responseData.email,
                        responseData.localId,
                        responseData.idToken,
                        +responseData.expiresIn
                    );
                }),
                catchError(this.handleError)
            )
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        );
        localStorage.setItem('userData', JSON.stringify(user));
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (errorResponse.error && errorResponse.error.error) {
            switch (errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email exists already';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'This email does not exist';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'This password is not correct';
                    break;
            }
        }
        return throwError(errorMessage);
    }
}