class ProductsController < ApplicationController
  before_filter :authenticate_user!, only: :create

  def index
    respond_with Product.where(user_id: current_user.id)
  end

  def create
    respond_with Product.create(product_params.merge({user_id: current_user.id}))
  end

  private

  def product_params
    params.require(:product).permit(:name)
  end
end
