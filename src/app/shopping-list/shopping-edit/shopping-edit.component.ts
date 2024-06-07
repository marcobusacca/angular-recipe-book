import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../_model/ingredient.model';
import { ShoppingListService } from '../../_service/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingEditForm') shoppingEditForm: NgForm;
  startedEditingSubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.startedEditingSubscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(this.editedItemIndex);
        this.shoppingEditForm.setValue({
          'name': this.editedItem.name,
          'amount': this.editedItem.amount,
        });
      }
    );
  }

  onSubmit() {
    const newIngredient = new Ingredient(this.shoppingEditForm.value.name, this.shoppingEditForm.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.shoppingEditForm.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.startedEditingSubscription.unsubscribe();
  }
}
