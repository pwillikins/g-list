angular.module('g-list')
.controller('ShoppingListCtrl', ['$scope', 'shoppingLists', function($scope, shoppingLists) {
  $scope.title = 'Shopping List';

  if (localStorage.items && localStorage.items.length > 0) {
    $scope.shoppingListItems = JSON.parse(localStorage.items);
  } else {
    $scope.shoppingListItems = [];
  };

  $scope.removeFromList = function(product) {
    index = $scope.shoppingListItems.indexOf(product);
    if(index != -1) {
	     $scope.shoppingListItems.splice(index, 1);
       localStorage.items = JSON.stringify($scope.shoppingListItems);
    };
  };

  $scope.createShoppingList = function() {
    params = {
      products: $scope.shoppingListItems
    }
    shoppingLists.create(params);
    $scope.shoppingListItems = [];
    localStorage.clear();
  };

}]);
