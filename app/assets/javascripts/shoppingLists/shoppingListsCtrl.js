angular.module('g-list')
.controller('ShoppingListsCtrl', ['$scope', 'shoppingLists', function($scope, shoppingLists) {
  $scope.title = 'Shopping Lists';
  $scope.shoppingLists = shoppingLists.shoppingLists;

  $scope.createShoppingList = function() {
    if (shoppingLists.newShoppingListItems.length == 0) { return; }
    shoppingLists.create(shoppingLists.newShoppingListItems);
  };

}]);
