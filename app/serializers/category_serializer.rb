class CategorySerializer < ActiveModel::Serializer
  attributes :name, :products, :recipe

  def products
    object.products
  end
end
