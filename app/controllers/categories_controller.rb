class CategoriesController < ApplicationController
  before_action :authenticate_user!, only: :create

  def index
    respond_with Category.where(user_id: current_user.id)
  end

  def create
    respond_with Category.create(category_params.merge({user_id: current_user.id}))
  end

  def show
    respond_with Category.find(params[:id])
  end

  def update
    if params[:description].present?
      category = Category.find(params[:id])
      category.description = params[:description]
      category.save
      render json: category
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :recipe)
  end

end
