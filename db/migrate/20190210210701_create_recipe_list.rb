class CreateRecipeList < ActiveRecord::Migration
  def change
    create_table :recipe_lists do |t|
      t.string :name
      t.timestamps null: false
    end
  end
end
