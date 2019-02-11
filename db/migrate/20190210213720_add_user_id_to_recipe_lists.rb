class AddUserIdToRecipeLists < ActiveRecord::Migration
  def change
    add_column :recipe_lists, :user_id, :integer
  end
end
