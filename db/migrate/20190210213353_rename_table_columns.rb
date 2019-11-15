class RenameTableColumns < ActiveRecord::Migration[5.2]
  def change
    rename_column :recipe_list_items, :recipes_id, :recipe_id
    rename_column :recipe_list_items, :recipe_lists_id, :recipe_list_id
  end
end
