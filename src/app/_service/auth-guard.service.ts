import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        if (route.routeConfig.path === 'recipes') {
            return this.authService.user.pipe(
                take(1),
                map(user => {
                    if (user) {
                        return true;
                    }
                    return this.router.createUrlTree(['/auth']);
                })
            );
        }
        if (route.routeConfig.path === 'auth') {
            return this.authService.user.pipe(
                take(1),
                map(user => {
                    if (!user) {
                        return true;
                    }
                    return this.router.createUrlTree(['/']);
                })
            );
        }
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.canActivate(childRoute, state);
    }
}