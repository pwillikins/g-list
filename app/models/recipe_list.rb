class RecipeList < ActiveRecord::Base
  belongs_to :user
  has_many :recipe_list_items
  has_many :recipes, through: :recipe_list_items
end