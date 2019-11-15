class ChangeColumnsInRecipeListItems < ActiveRecord::Migration[5.2]
  def change
    rename_column :recipe_list_items, :recipe_id, :category_id
  end
end
