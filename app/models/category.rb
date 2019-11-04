class Category < ActiveRecord::Base
  belongs_to :user
  has_many :categorizations
  has_many :products, through: :categorizations
  has_one_attached :cover_image

  def as_json(options = {})
    super
  end

end
