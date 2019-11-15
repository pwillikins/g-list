class AddUserIdToRecipeLists < ActiveRecord::Migration[5.2]
  def change
    add_column :recipe_lists, :user_id, :integer
  end
end
