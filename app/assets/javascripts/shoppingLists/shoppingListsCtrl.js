angular.module('g-list')
.controller('ShoppingListsCtrl', ['$scope', 'shoppingLists', function($scope, shoppingLists) {
  $scope.title = 'Create Shopping List';
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
      redirect(data.data.data.id);
    });
    $scope.shoppingListItems = [];
    localStorage.clear();
  };

  redirect = function(id) {
    url = window.location.origin + '/#!/shopping_lists/' + id;
    window.location.href = url;
  };

  $scope.removeList = function(id) {
    shoppingLists.deleteList(id);
  };

}]);
