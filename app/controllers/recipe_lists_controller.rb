class RecipeListsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

  def index
    respond_with RecipeList.where(user_id: current_user.id)
  end

  def create
    byebug
    recipe_list = RecipeList.create(name: "Weekly List - (#{Time.now})", user_id: current_user.id)
    if params[:recipes].present?
      params[:recipes].each do |recipe|
        recipe_list.recipe_list_items << RecipeListItem.create(recipe_id: recipe['id'], recipe_list_id: recipe_list.id)
      end
    end
    render json: recipe_list
  end

  def show
    respond_with RecipeList.find(params[:id])
  end

  def update
    recipe_list_item = RecipeListItem.where(recipe_list_id: params[:recipe_list_id], recipe_id: params[:id]).first
    recipe_list_item.save
    recipe_list = RecipeList.find(recipe_list_item.recipe_list_id)
    render json: recipe_list
  end

  def destroy
    recipe_list = RecipeList.find(params[:id])
    recipe_list.destroy
    respond_with {}
  end

end
