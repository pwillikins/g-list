class AddPortionToCategorizations < ActiveRecord::Migration[5.2]
  def change
    add_column :categorizations, :portion, :string
  end
end
