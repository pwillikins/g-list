class AddPurchasedToShoppingListItem < ActiveRecord::Migration[5.2]
  def change
    add_column :shopping_list_items, :purchased, :boolean, default: false
  end
end
