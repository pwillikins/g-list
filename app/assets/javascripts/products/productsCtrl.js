angular.module('g-list')
  .controller('ProductsCtrl', [ '$scope', 'products', 'categories', '$mdDialog', '$mdMenu',
    function ($scope, products, categories, $mdDialog, $mdMenu) {

  $scope.title = 'Products'
  $scope.products = products.products
  $scope.filteredProducts = [...$scope.products]
  $scope.categories = categories.allCategories
  $scope.currentShoppingList = []
  $scope.sortOption = 'Custom'

  const items = localStorage[`userShoppingList-${localStorage.userId}`]
  if (items && items.length > 0) {
    $scope.currentShoppingList = JSON.parse(items);
  }

  for (i = 0; i < $scope.categories.length; i++) {
    if ($scope.categories[i].attributes.recipe) {
      $scope.categories[i].content = 'Recipe';
    } else {
      $scope.categories[i].content = 'Category';
    }
  }

  $scope.removeProduct = function(id) {
    products.deleteProduct(id)
  }

  $scope.addToShoppingList = function(product) {
    newProductFormat = {
      id: product.id,
      name: product.attributes.name,
      portion: ''
    }
    $scope.currentShoppingList.push(newProductFormat);

    localStorage.setItem(`userShoppingList-${localStorage.userId}`, JSON.stringify($scope.currentShoppingList))
  }

  $scope.isInShoppingList = function(product) {
    exists = false
    if ($scope.currentShoppingList && $scope.currentShoppingList.length > 0) {
      for (i = 0; i < $scope.currentShoppingList.length; i++) {
        if (product.id == $scope.currentShoppingList[i].id) {
          exists = true;
        }
      };
    };
    return exists
  }
  
  $scope.removeFromList = function(product) {
    $scope.currentShoppingList = $scope.currentShoppingList.filter(object => object.id != product.id)
    localStorage[`userShoppingList-${localStorage.userId}`] = JSON.stringify($scope.currentShoppingList)
  }

  $scope.selectProduct = function (product) {
    if (product.selected) {
      $scope.addToShoppingList(product)
    } else {
      $scope.removeFromList(product)
    }
  }

  $scope.products.forEach(product => {
    product.selected = $scope.isInShoppingList(product)
  })

  // ---------------- DIALOG FUNCTIONALITY ---------------- //
  $scope.openNewProductDialog = function (ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'products/_newProductDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      // locals: { recipes: $scope.recipes },
      clickOutsideToClose: true
    }).then(function (answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function () {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  function DialogController($scope, $mdDialog) {
    $scope.createProduct = function () {
      var product = { name: $scope.productName }
      if ($scope.productName == '') { return; }
      products.create(product);
      $scope.productName = '';
      $scope.closeDialog()
    };

    $scope.closeDialog = function () {
      $mdDialog.hide()
    }
  }

  $scope.searchProducts = function(event) {
    console.log('event', event)
    const input = event.target.value
    if (input && input.length) {
      console.log('$scope.prod', $scope.products)
      $scope.filteredProducts = $scope.products.filter(prod => prod.attributes.name.includes(input))
    } else {
      $scope.filteredProducts = $scope.products
    }
  }

  $scope.sort = function(direction) {
    property = 'name'
    if (direction === 'asc') {
      $scope.sortOption = 'Name Asc'
    } else if (direction === 'desc') {
      $scope.sortOption = 'Name Desc'
    } else {
      $scope.sortOption = 'Custom'
    }
    
    if (direction !== 'custom') {
      $scope.filteredProducts = $scope.filteredProducts.sort(function(a, b) {
        if (a.attributes[property] && b.attributes[property]) {
          var prop_a = a.attributes[property].toString().toLowerCase()
          var prop_b = b.attributes[property].toString().toLowerCase()
  
          if (!!Number(a.attributes[property])) prop_a = Number(a.attributes[property])
          if (!!Number(b.attributes[property])) prop_b = Number(b.attributes[property])
  
          if (direction == 'asc') {
            if (prop_a < prop_b) return -1
  
            if (prop_a > prop_b) return 1
  
            return 0
          } else {
            if (prop_a > prop_b) return -1
  
            if (prop_a < prop_b) return 1
  
            return 0
          }
        }
      })
    } else {
      $scope.filteredProducts = $scope.products
    }
  }
}]);
