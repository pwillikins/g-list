class CategorySerializer < ActiveModel::Serializer
  attributes :name, :products, :recipe, :description

  def products
    object.products
  end
end
