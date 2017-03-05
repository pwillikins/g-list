class ShoppingListSerializer < ActiveModel::Serializer
  attributes :id, :name, :products

  def products
    updated_products = []
    products = object.try(:products)
    products.each do |product|
      object.shopping_list_items.each do |sli|
        if sli.product_id == product.id
          updated_products << {
            purchased: sli.purchased,
            name: product.name,
            id: product.id
          }
        end
      end
    end
    updated_products
  end

end
