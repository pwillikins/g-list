class ShoppingListSerializer < ActiveModel::Serializer
  attributes :id, :name, :timestamp, :products

  def products
    updated_products = []
    products = object.try(:products)
    products.each do |product|
      object.shopping_list_items.each do |sli|
        if sli.product_id == product.id
          updated_products << {
            purchased: sli.purchased,
            name: product.name,
            id: product.id,
            portion: sli.portion,
            comment: sli.comment
          }
        end
      end
    end
    updated_products
  end

  def timestamp 
    created_at = object.try(:created_at)
    created_at
  end

end
