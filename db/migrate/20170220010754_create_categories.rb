class CreateCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.integer :user_id
      t.boolean :recipe, default: false
      t.timestamps
    end
  end
end
