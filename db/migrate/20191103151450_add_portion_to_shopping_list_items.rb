class AddPortionToShoppingListItems < ActiveRecord::Migration[5.2]
  def change
    add_column :shopping_list_items, :portion, :string
  end
end
