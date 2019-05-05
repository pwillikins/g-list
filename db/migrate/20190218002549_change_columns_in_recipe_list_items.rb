class ChangeColumnsInRecipeListItems < ActiveRecord::Migration
  def change
    rename_column :recipe_list_items, :recipe_id, :category_id
  end
end
