class ShoppingListsController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

  def index
    respond_with ShoppingList.where(user_id: current_user.id)
  end

  def create
    shopping_list = ShoppingList.create(name: "New List (#{Time.now})", user_id: current_user.id)
    if params[:products].present?
      params[:products].each do |product|
        shopping_list.shopping_list_items << ShoppingListItem.create(product_id: product['id'], shopping_list_id: shopping_list.id)
      end
    end
    render json: shopping_list
  end

  def show
    respond_with ShoppingList.find(params[:id])
  end

  def update
    shopping_list_item = ShoppingListItem.where(shopping_list_id: params[:shopping_list_id], product_id: params[:id]).first
    shopping_list_item.purchased = params[:purchased]
    shopping_list_item.save
    shopping_list = ShoppingList.find(shopping_list_item.shopping_list_id)
    render json: shopping_list
  end

  def destroy
    shopping_list = ShoppingList.find(params[:id])
    shopping_list.destroy
    respond_with {}
  end

end
