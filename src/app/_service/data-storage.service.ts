import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../_model/recipe.model";
import { RecipeService } from "./recipe.service";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {

    constructor(private http: HttpClient, private authService: AuthService, private recipesService: RecipeService) { }

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http
            .put('https://angular-recipe-book-f2f9b-default-rtdb.firebaseio.com/recipes.json', recipes)
            .subscribe(
                response => {
                    console.log(response);
                }
            );
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>('https://angular-recipe-book-f2f9b-default-rtdb.firebaseio.com/recipes.json')
            .pipe(
                map(recipes => {
                    if (recipes) {
                        return recipes.map(recipe => {
                            return {
                                ...recipe,
                                ingredients: recipe.ingredients ? recipe.ingredients : [],
                            };
                        });
                    } else {
                        return [];
                    }
                }),
                tap(recipes => {
                    this.recipesService.setRecipes(recipes);
                })
            );
    }
}