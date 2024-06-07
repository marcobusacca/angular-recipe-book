import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthComponent } from "./auth/auth.component";

import { RecipesComponent } from "./recipes/recipes.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipesResolverService } from "./_service/recipes-resolver.service";

import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { AuthGuardService } from "./_service/auth-guard.service";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'recipes',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'recipes',
        component: RecipesComponent,
        canActivate: [AuthGuardService],
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                component: RecipeStartComponent,
            },
            {
                path: 'new',
                component: RecipeEditComponent,
            },
            {
                path: ':id',
                component: RecipeDetailComponent,
                resolve: [RecipesResolverService],
            },
            {
                path: ':id/edit',
                component: RecipeEditComponent,
                resolve: [RecipesResolverService]
            },
        ],
    },
    {
        path: 'shopping-list',
        component: ShoppingListComponent,
    },
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }