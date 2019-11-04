class ProductSerializer < ActiveModel::Serializer
  attributes :name, :portion

  def portion
    portion = object.try(:portion)
  end
end
