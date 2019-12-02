class CreateUnitOfMeasures < ActiveRecord::Migration[5.2]
  def change
    create_table :unit_of_measures do |t|
      t.belongs_to :user
      t.string :name, null: false
      t.integer :user_id
      t.timestamps
    end
  end
end
