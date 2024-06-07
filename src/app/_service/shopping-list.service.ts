import { Injectable } from "@angular/core";
import { Ingredient } from "../_model/ingredient.model";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ShoppingListService {

    ingredientChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ];

    getIngredients(): Ingredient[] {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.onIngredientChanged();
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.onIngredientChanged();
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.onIngredientChanged();
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.onIngredientChanged();
    }

    onIngredientChanged() {
        this.ingredientChanged.next(this.ingredients.slice());
    }
}