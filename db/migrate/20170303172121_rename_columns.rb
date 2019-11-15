class RenameColumns < ActiveRecord::Migration[5.2]
  def change
    rename_column :shopping_list_items, :products_id, :product_id
    rename_column :shopping_list_items, :shopping_lists_id, :shopping_list_id
  end
end
