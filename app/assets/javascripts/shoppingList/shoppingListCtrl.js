angular.module('g-list')
.controller('ShoppingListCtrl', ['$scope', 'shoppingList', 'shoppingLists', function($scope, shoppingList, shoppingLists) {

  $scope.currentList = shoppingList;
  $scope.title = $scope.currentList.attributes.name;
  $scope.shoppingListItems = $scope.currentList.attributes.products;

  $scope.checkOffList = function(item) {
    item.purchased = true;
    item.shopping_list_id = $scope.currentList.id;
    shoppingLists.updateItem(item).then(function(response) {
      $scope.currentList = response;
      // $scope.shoppingListItems = $scope.currentList.attributes.products;
    });
  };


}]);
