class ShoppingListSerializer < ActiveModel::Serializer
  attributes :id, :name, :products

  def products
    object.try(:products)
  end
end
