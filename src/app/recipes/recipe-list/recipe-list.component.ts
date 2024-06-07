import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../../_model/recipe.model';
import { RecipeService } from '../../_service/recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesChangedSubscription: Subscription;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    this.recipesChangedSubscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
  }

  ngOnDestroy(): void {
    this.recipesChangedSubscription.unsubscribe();
  }
}
