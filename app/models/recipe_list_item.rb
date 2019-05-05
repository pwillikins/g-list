class RecipeListItem < ActiveRecord::Base
  belongs_to :recipe_list
  belongs_to :category
end
