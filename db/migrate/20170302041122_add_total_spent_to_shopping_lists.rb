class AddTotalSpentToShoppingLists < ActiveRecord::Migration
  def change
    add_column :shopping_lists, :total_spent, :integer
  end
end
