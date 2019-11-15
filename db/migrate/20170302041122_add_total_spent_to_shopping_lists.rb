class AddTotalSpentToShoppingLists < ActiveRecord::Migration[5.2]
  def change
    add_column :shopping_lists, :total_spent, :integer
  end
end
