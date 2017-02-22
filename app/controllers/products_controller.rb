class ProductsController < ApplicationController
  before_filter :authenticate_user!, only: :create

  def index
    respond_with Product.where(user_id: current_user.id)
  end

  def create
    product = Product.create( product_params.merge({ user_id: current_user.id }) )
    if params[:categoryId].present?
      Categorization.create( product_id: product.id, category_id: params[:categoryId] )
    end
    respond_with product
  end

  def destroy
    product = Product.find(params[:id])
    product.destroy
    respond_with {}
  end

  private

  def product_params
    params.require(:product).permit(:name)
  end
end
