class RecipeListSerializer < ActiveModel::Serializer
  attributes :name, :recipes

  def recipes
    updated_recipes = []
    recipes = object.try(:categories)
    recipes.each do |recipe|
      object.recipe_list_items.each do |rli|
        if rli.category_id == recipe.id
          updated_recipes << {
            name: recipe.name,
            id: recipe.id
          }
        end
      end
    end
    updated_recipes
  end
end
