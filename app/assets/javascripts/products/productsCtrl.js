angular.module('g-list')
.controller('ProductsCtrl', ['$scope', 'products', 'categories', function($scope, products, categories) {

  $scope.title = 'Products';
  $scope.products = products.products;
  $scope.categories = categories.categories;

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

}]);
