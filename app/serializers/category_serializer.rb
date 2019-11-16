class CategorySerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :name, :products, :recipe, :description, :cover

  def products
    object.categorizations.collect do |cat|
      if cat && cat.product
        product = {
          id: cat.product.id,
          name: cat.product.name,
          portion: cat.portion,
          category: object.id
        }
        product
      end
    end
  end

  def cover
    image_url = ''
    if object.cover_image.attached?
      path = rails_blob_path(object.cover_image.blob, only_path: true)
      if Rails.env == 'development'
        image_url = "http://localhost:3000#{path}"
      end

      if Rails.env == 'production'
        image_url = path
      end

    end
    image_url
  end
end
