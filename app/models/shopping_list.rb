class ShoppingList < ActiveRecord::Base
  belongs_to :user
  has_many :shopping_list_items
  has_many :products, through: :shopping_list_items
end
