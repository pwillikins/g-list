class CategorySerializer < ActiveModel::Serializer
  attributes :name, :products

  def products
    object.products
  end
end
