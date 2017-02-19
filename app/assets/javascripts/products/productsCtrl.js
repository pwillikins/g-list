angular.module('g-list')
.controller('ProductsCtrl', ['$scope', 'products', function($scope, products) {

  $scope.title = 'Products';
  $scope.products = products.products;

  $scope.createProduct = function() {
    if ($scope.name == '') { return; }
    products.create({
      name: $scope.name
    });
    $scope.name = '';
  };

}]);
