class CreateShoppingListItems < ActiveRecord::Migration[5.2]
  def change
    create_table :shopping_list_items do |t|
      t.belongs_to :products
      t.belongs_to :shopping_lists, index: true
      t.timestamps
    end
  end
end
