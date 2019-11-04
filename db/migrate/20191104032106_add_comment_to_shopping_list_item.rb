class AddCommentToShoppingListItem < ActiveRecord::Migration[5.2]
  def change
    add_column :shopping_list_items, :comment, :string
  end
end
