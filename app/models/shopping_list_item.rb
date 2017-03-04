class ShoppingListItem < ActiveRecord::Base
  belongs_to :shopping_list
  belongs_to :product
end
