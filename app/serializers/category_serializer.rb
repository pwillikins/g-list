class CategorySerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :name, :products, :recipe, :description, :cover

  def products
    if object && object.categorizations
      object.categorizations.map do |cat|
        product = {
          id: cat.product.id,
          name: cat.product.name,
          portion: cat.portion,
          category: object.id
        }
        product
      end
    else
      []
    end
  end

  def cover
    if object.cover_image.attached?
      path = rails_blob_path(object.cover_image.blob, only_path: true)
      # temp solution until we set the default_url_options in config
      # will only work locally
      "http://localhost:3000#{path}"
    end
  end

  def categorization
    object
  end
end
