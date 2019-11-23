class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  after_create do 
    generate_seed_products
  end

  private

  def generate_seed_products
    new_products = seed_products.map { |product| { name: product, user_id: self.id } }
    Product.create(new_products)
  end

  def seed_products
    products_to_create = [
      'Kosher Salt', 'Sea Salt', 'Salt', 'Black Pepper', 'Garlic Powder', 'Garlic Salt', 'Onion Powder',
      'Cayenne Pepper', 'Bay Leaves', 'Red Pepper Flakes', 'Cumin', 'Chili Powder', 'Milk', 'Heavy Cream', 'Half & Half',
      'Buttermilk', 'Salsa', 'Sour Cream', 'Taco Shells', 'Tortillas', 'White Bread', 'Wheat Bread', 'Hamburger Buns', 'Hotdog Buns',
      'Vanilla Extract', 'Flour', 'Baking Powder', 'Baking Soda', 'Powdered Sugar', 'Sugar', 'Brown Sugar', 'Eggs',
      'Butter', 'Margarine', 'Olive Oil', 'Ketchup', 'Mustard', 'Mayonnaise',
      'Ranch Dressing', 'Italian Dressing', 'Vinaigrette Dressing',
      'Cheese', 'Cheese Slices', 'Shredded Cheese', 'Parmesan Cheese',
      'Ground Beef', 'Steak', 'Chicken', 'Pork', 'Turkey', 'Lamb',
      'Lettuce', 'Tomato', 'Red Onion', 'Yellow Onion', 'Green Onion', 'Potato', 'Carrot', 'Eggplant',
      'Squash', 'Zuchinni', 'Red Pepper', 'Green Pepper', 'Yellow Pepper', 'Orange Pepper',
      'Snap Peas', 'Peas', 'Green Beans', 'Garlic', 'Parsley', 'Cilantro', 'Ginger', 'Jalepeno', 
      'Apple', 'Orange', 'Pear', 'Grapes', 'Plum', 'Nectarine', 'Peach', 'Banana'
    ]

    products_to_create
  end
end
