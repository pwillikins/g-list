class ShoppingListItemsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update]

end
