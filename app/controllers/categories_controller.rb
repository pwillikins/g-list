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
    category = Category.find(params[:id])
    print "File Upload: #{params[:file]}"
    if params[:file].present?
      category.cover_image.attach(params[:file])
      category.save
      render json: category
    end

    if params[:description]
      category = Category.find(params[:id])
      category.description = params[:description]
      category.save
      render json: category
    end
  end

  def destroy
    category = Category.find(params[:id])
    category.destroy
    respond_with {}
  end

  private

  def category_params
    params.require(:category).permit(:name, :recipe, :description, image: [])
  end

end
