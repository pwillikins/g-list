class CreateRecipeListItems < ActiveRecord::Migration[5.2]
  def change
    create_table :recipe_list_items do |t|
      t.belongs_to :recipes
      t.belongs_to :recipe_lists, index: true
      t.timestamps
    end
  end
end
