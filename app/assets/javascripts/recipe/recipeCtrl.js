angular.module('g-list')
.controller('RecipeCtrl', ['$scope', 'recipe', 'categories', 'products', function($scope, recipe, categories, products) {

  $scope.recipe = recipe;
  $scope.description = $scope.recipe.attributes.description;
  $scope.recipeProducts = $scope.recipe.attributes.products;
  $scope.currentShoppingList = JSON.parse(localStorage.items) || [];

  $scope.saveDescription = function() {
    if ($scope.description == '') { return; }
    categories.addDescription($scope.recipe.id, {
      description: $scope.description
    }).then(function(response) {
      $scope.recipe = response.data.data;
      $scope.description = $scope.recipe.attributes.description;
    });
  };

  $scope.removeProduct = function(id) {
    products.deleteProduct(id);
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
    index = $scope.currentShoppingList.indexOf(product);
    $scope.currentShoppingList.splice(index, 1);
    localStorage.items = JSON.stringify($scope.currentShoppingList);
  };

}]);
