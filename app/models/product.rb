class Product < ActiveRecord::Base
  belongs_to :user
  has_many :categorizations
  has_many :categories, through: :categorizations
  has_many :shopping_list_items

  def as_json(options = {})
    super
  end

end
