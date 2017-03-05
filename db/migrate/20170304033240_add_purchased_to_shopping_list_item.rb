class AddPurchasedToShoppingListItem < ActiveRecord::Migration
  def change
    add_column :shopping_list_items, :purchased, :boolean, default: false
  end
end
