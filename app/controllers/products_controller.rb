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
    begin
      if params[:categoryId].present?
        product = Product.find(params[:productId])
        cat = Categorization.create(product_id: params[:productId], category_id: params[:categoryId])
        respond_with product
      else
        respond_with {}
      end
    rescue => ex
      print ex
    end
  end

  def update_categorization
    param = params[:productId]
    if param[:categoryId].present? && param[:productId].present? && param[:portion].present?
      cat = Categorization.where(
        category_id: param[:categoryId], 
        product_id: param[:productId]
      )
      cat[0].portion = param[:portion]
      cat[0].save
      render json: cat[0]
    else
      respond_with {}
    end
  end

  def destroy
    product = Product.find(params[:id])
    if product 
      product.destroy
      cats = Categorization.where(product_id: params[:id])
      if cats.present?
        cats.delete(cats.map {|cat| cat.id})
      end
    end
    respond_with {}
  end

  def remove_recipe_product
    if params[:categoryId].present? && params[:productId].present?
      cat = Categorization.where(product_id: params[:productId], category_id: params[:categoryId])
      respond_with cat[0].destroy
    end
  end

  private

  def product_params
    params.require(:product).permit(:name, :category_id)
  end
end
