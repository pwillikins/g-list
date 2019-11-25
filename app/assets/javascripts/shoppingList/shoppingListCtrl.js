angular.module('g-list')
.controller('ShoppingListCtrl', ['$scope', 'shoppingList', 'shoppingLists', function($scope, shoppingList, shoppingLists) {
  $scope.loading = true
  $scope.currentList = shoppingList;
  if ($scope.currentList) $scope.loading = false
  $scope.title = $scope.currentList.attributes.name;
  $scope.shoppingListItems = $scope.currentList.attributes.products;
  $scope.date = new Date($scope.currentList.attributes.timestamp).toDateString()

  $scope.checkOffList = function(item) {
    item.purchased = !item.purchased;
    item.shopping_list_id = $scope.currentList.id;
    shoppingLists.updateItem(item).then(function(response) {
      $scope.currentList = response.data.data;
    });
  };

}]);
