angular.module('g-list')
.controller('ProductsCtrl', ['$scope', 'products', 'categories', function($scope, products, categories) {

  $scope.title = 'Products';
  $scope.products = products.products;
  $scope.categories = categories.allCategories;

  for (i = 0; i < $scope.categories.length; i++) {
    if ($scope.categories[i].attributes.recipe) {
      $scope.categories[i].content = 'Recipe';
    } else {
      $scope.categories[i].content = 'Category';
    };
  };

  $scope.createProduct = function() {
    var product = { name: $scope.name }
    if ($scope.name == '') { return; }
    if ($scope.category) {
      product.categoryId = $scope.category.id;
    }
    products.create(product);
    $scope.name = '';
    $scope.category = '';
  };

  $scope.removeProduct = function(id) {
    products.deleteProduct(id);
  };

}]);
