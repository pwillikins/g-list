angular.module('g-list')
.controller('ShoppingListsCtrl', ['$scope', 'shoppingLists', function($scope, shoppingLists) {

  $scope.newTitle = 'Create Shopping List'
  $scope.title = 'Shopping List History'
  $scope.shoppingLists = shoppingLists.shoppingLists
  $scope.$parent.shoppingListCleared = false
  $scope.userId = localStorage.userId
  $scope.shoppingListItems = []

  const items = localStorage[`userShoppingList-${$scope.userId}`]
  if (items && items.length > 0) {
    $scope.shoppingListItems = JSON.parse(localStorage[`userShoppingList-${$scope.userId}`])
  }
  
  $scope.removeFromList = function(product) {
    index = $scope.shoppingListItems.indexOf(product)
    if(index != -1) {
	     $scope.shoppingListItems.splice(index, 1)
      localStorage[`userShoppingList-${localStorage.userId}`] = JSON.stringify($scope.shoppingListItems)
    }
  }

  $scope.createShoppingList = function() {
    params = {
      products: $scope.shoppingListItems
    }
    shoppingLists.create(params).then(function(data) {
      shoppingLists.shoppingLists.push(data.data.data)
      $scope.shoppingListItems = []
      localStorage.clear()
      redirect(data.data.data.id)
    })
  }

  redirect = function(id) {
    url = window.location.origin + '/#!/shopping_lists/' + id
    window.location.href = url
  }

  $scope.removeList = function(id) {
    shoppingLists.deleteList(id)
  }

  $scope.clearList = function() {
    $scope.shoppingListItems = []
    localStorage.setItem(`userShoppingList-${$scope.userId}`, JSON.stringify([]))
    $scope.$parent.shoppingListCleared = true
  }

}])
