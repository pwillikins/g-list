class RecipeListItemsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

end
