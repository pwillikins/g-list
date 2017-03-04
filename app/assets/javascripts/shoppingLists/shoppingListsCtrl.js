angular.module('g-list')
.controller('ShoppingListsCtrl', ['$scope', 'shoppingLists', function($scope, shoppingLists) {
  $scope.title = 'Shopping Lists';
  $scope.shoppingLists = shoppingLists.shoppingLists;

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
    shoppingLists.create(params).then(function(data) {
      shoppingLists.shoppingLists.push(data.data.data);
      localStorage.setItem('id', data.data.data.id);
    });
    $scope.shoppingListItems = [];
    $scope.shoppingListId = localStorage.id;
    localStorage.clear();
    url = window.location.origin + '/#!/shopping_lists/' + $scope.shoppingListId;
    window.location.href = url;
  };

}]);
