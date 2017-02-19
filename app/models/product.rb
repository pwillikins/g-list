class Product < ActiveRecord::Base
  belongs_to :user

  def as_json(options = {})
    super
  end
end
