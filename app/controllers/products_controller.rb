class ProductsController < ApplicationController
  before_action :authenticate_user!, only: :create

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

  def create_categorization
    if params[:categoryId].present?
      cat = Categorization.create( product_id: params[:productId], category_id: params[:categoryId] )
      respond_with Product.find(params[:productId])
    else
      respond_with {}
    end
  end

  def destroy
    product = Product.find(params[:id])
    product.destroy
    respond_with {}
  end

  def remove_recipe_product
    if params[:categoryId].present? && params[:productId].present?
      cat = Categorization.where(product_id: params[:productId], category_id: params[:categoryId])
      respond_with cat[0].destroy
      # respond_with {}
    end
    
    
  end

  private

  def product_params
    params.require(:product).permit(:name)
  end
end
