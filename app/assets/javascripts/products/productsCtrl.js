angular.module('g-list')
  .controller('ProductsCtrl', [ '$scope', 'products', 'categories', '$mdDialog','$mdToast',
    function ($scope, products, categories, $mdDialog, $mdToast) {

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

  $scope.removeProduct = async function(id) {
    try {
      await products.deleteProduct(id)
      $scope.filteredProducts = $scope.filteredProducts.filter(prod => prod.id !== id)
      toastMessage('Product Removed')
    } catch (error) {
      toastMessage('Error Removing Product')
    }
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
      locals: { filteredProducts: $scope.filteredProducts },
      clickOutsideToClose: true
    }).then(function (answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function () {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  function DialogController($scope, $mdDialog, filteredProducts) {
    $scope.createProduct = async function () {
      var product = { name: $scope.productName }
      if ($scope.productName == '') { return; }
      const newProduct = await products.create(product);
      filteredProducts.push(newProduct)
      $scope.productName = '';
      toastMessage('Product Created')
    };

    $scope.closeDialog = function () {
      $mdDialog.hide()
    }
  }

  $scope.searchProducts = function() {
    if ($scope.searchPhrase && $scope.searchPhrase.length) {
      $scope.filteredProducts = $scope.products.filter(prod => prod.attributes.name.toLowerCase().includes($scope.searchPhrase.toLowerCase()))
    } else {
      $scope.filteredProducts = $scope.products
    }
  }

  $scope.clearSearch = function() {
    $scope.filteredProducts = $scope.products
    $scope.searchPhrase = ''
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
      $scope.filteredProducts = [...$scope.products]
    }
  }

  toastMessage = function(message) {
    $mdToast.show($mdToast.simple().textContent(message).position('center'))
  }
}]);
