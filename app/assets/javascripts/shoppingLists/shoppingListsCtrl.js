angular.module('g-list')
  .controller('ShoppingListsCtrl', [ '$scope', 'shoppingLists', '$mdToast', function ($scope, shoppingLists, $mdToast) {

  $scope.newTitle = 'Create Shopping List'
  $scope.title = 'Shopping List History'
  $scope.shoppingLists = shoppingLists.shoppingLists
  $scope.$parent.shoppingListCleared = false
  $scope.userId = localStorage.userId
  $scope.shoppingListItems = []

  const items = localStorage[`userShoppingList-${$scope.userId}`]
  if (items && items.length > 0) {
    $scope.shoppingListItems = JSON.parse(localStorage[`userShoppingList-${$scope.userId}`])
    // $scope.shoppingListItems.forEach(item => item['comment'] = '')
  }
  
  $scope.removeFromList = function(product) {
    index = $scope.shoppingListItems.indexOf(product)
    if(index != -1) {
      $scope.shoppingListItems.splice(index, 1)
      localStorage[`userShoppingList-${localStorage.userId}`] = JSON.stringify($scope.shoppingListItems)
      toastMessage('Item Removed!')
    }
  }

  $scope.createShoppingList = function() {
    params = {
      products: $scope.shoppingListItems
    }
    shoppingLists.create(params).then(function(data) {
      toastMessage('Shopping List Saved!')
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

  $scope.clearList = function() {
    $scope.shoppingListItems = []
    localStorage.setItem(`userShoppingList-${$scope.userId}`, JSON.stringify([]))
    $scope.$parent.shoppingListCleared = true
    toastMessage('Shopping List Cleared!')
  }

  $scope.updateItem = function(item, property) {
    const foundItem = $scope.shoppingListItems.find(listItem => {
      if (item.category) {
        if (item.id == listItem.id && item.category == listItem.category) {
          return listItem
        }
      } else if (item.id == listItem.id) {
        return listItem
      }
    })

    if (foundItem) {
      foundItem[property] = item[property]
      localStorage.setItem(`userShoppingList-${ $scope.userId }`, JSON.stringify($scope.shoppingListItems))
      toastMessage('Item Updated!')
    } else {
      toastMessage('Error Updating item - Item Not Found!')
    }
  }

  toastMessage = function(message) {
    $mdToast.show($mdToast.simple().textContent(message))
  }

}])
