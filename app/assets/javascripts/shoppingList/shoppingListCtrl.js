angular.module('g-list')
.controller('ShoppingListCtrl', ['$scope', 'shoppingList', function($scope, shoppingList) {

  $scope.currentList = shoppingList;
  $scope.title = $scope.currentList.attributes.name;
  $scope.shoppingListItems = $scope.currentList.attributes.products;

}]);
