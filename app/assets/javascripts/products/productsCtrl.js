angular.module('g-list')
.controller('ProductsCtrl', ['$scope', 'products', 'categories', 'shoppingLists', function($scope, products, categories, shoppingLists) {

  $scope.title = 'Products';
  $scope.products = products.products;
  $scope.categories = categories.allCategories;

  if (localStorage.items && localStorage.items.length > 0) {
    $scope.currentShoppingList = JSON.parse(localStorage.items);
  } else {
    $scope.currentShoppingList = [];
  };

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

  $scope.addToShoppingList = function(product) {
    newProductFormat = {
      id: product.id,
      name: product.attributes.name
    }
    $scope.currentShoppingList.push(newProductFormat);
    localStorage.setItem('items', JSON.stringify($scope.currentShoppingList));
  };

  $scope.isInShoppingList = function(product) {
    exists = false
    if ($scope.currentShoppingList && $scope.currentShoppingList.length > 0) {
      for (i = 0; i < $scope.currentShoppingList.length; i++) {
        if (product.id == $scope.currentShoppingList[i].id) {
          exists = true;
        }
      };
    };
    return exists;
  };

  $scope.removeFromList = function(product) {
    $scope.currentShoppingList = $scope.currentShoppingList.filter( ( object ) => object.id != product.id );
    localStorage.items = JSON.stringify($scope.currentShoppingList);
  };

}]);
