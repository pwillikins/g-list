angular.module('g-list')
.controller('RecipeCtrl', ['$scope', 'recipe', 'categories', 'products', function($scope, recipe, categories, products) {

  $scope.recipe = recipe;
  $scope.description = $scope.recipe.attributes.description;
  $scope.recipeProducts = $scope.recipe.attributes.products;

  if (localStorage.items && localStorage.items.length > 0) {
    $scope.currentShoppingList = JSON.parse(localStorage.items);
  } else {
    $scope.currentShoppingList = [];
  };

  $scope.saveDescription = function() {
    if ($scope.description == '') { return; }
    categories.addDescription($scope.recipe.id, {
      description: $scope.description
    }).then(function(response) {
      $scope.recipe = response.data.data;
      $scope.description = $scope.recipe.attributes.description;
    });
  };

  $scope.createProduct = function () {
    if ($scope.productName == '') { return; }
    var product = { name: $scope.productName }
    product.categoryId = $scope.recipe.id;
    product.recipe = true;
    products.create(product);
    $scope.recipeProducts.push(product);    
    $scope.productName = '';
  };

  $scope.removeProduct = function(id) {
    products.deleteProduct(id);
    $scope.recipeProducts = $scope.recipeProducts.filter((product) => product.id != id)
  };

  $scope.isInShoppingList = function(product) {
    exists = false
    for (i = 0; i < $scope.currentShoppingList.length; i++) {
      if ($scope.currentShoppingList[i].id == product.id) {
        exists = true;
      }
    };
    return exists;
  };

  $scope.addToShoppingList = function(product) {
    product.added = true;
    $scope.currentShoppingList.push(product);
    localStorage.setItem('items', JSON.stringify($scope.currentShoppingList));
  };

  $scope.removeFromList = function(product) {
    var index = $scope.currentShoppingList.indexOf(product);
    $scope.currentShoppingList.splice(index, 1);
    localStorage.items = JSON.stringify($scope.currentShoppingList);
  };

}]);
