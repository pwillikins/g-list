class ShoppingListsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

  def index
    respond_with ShoppingList.where(user_id: current_user.id)
  end

  def create
    shopping_list = ShoppingList.create(name: "New List (#{Time.now})", user_id: current_user.id)
    if params[:products].present?
      params[:products].each do |product|
        shopping_list.products << ShoppingListItem.create(product_id: product.id, shopping_list_id: shopping_list.id)
      end
    end
    render json: shopping_list
  end

  def update
    if params[:total_spent].present?
      shopping_list = ShoppingList.find(params[:id])
      shopping_list.total_spent = params[:total_spent]
      shopping_list.save
      render json: shopping_list
    end
  end

end
