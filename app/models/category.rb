class Category < ActiveRecord::Base
  belongs_to :user
  has_many :categorizations
  has_many :products, through: :categorizations

end
