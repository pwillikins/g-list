angular.module('g-list')
  .controller('ProductsCtrl', [ '$scope', 'products', 'categories', '$mdDialog',
    function ($scope, products, categories, $mdDialog) {

  $scope.title = 'Products';
  $scope.products = products.products;
  $scope.categories = categories.allCategories;

  if (localStorage.items && localStorage.items.length > 0) {
    $scope.currentShoppingList = JSON.parse(localStorage.items);
  } else {
    $scope.currentShoppingList = [];
  };

  for (i = 0; i < $scope.categories.length; i++) {
    if ($scope.categories[i].attributes.recipe) {
      $scope.categories[i].content = 'Recipe';
    } else {
      $scope.categories[i].content = 'Category';
    };
  };

  $scope.removeProduct = function(id) {
    products.deleteProduct(id);
  };

  $scope.addToShoppingList = function(product) {
    newProductFormat = {
      id: product.id,
      name: product.attributes.name
    }
    $scope.currentShoppingList.push(newProductFormat);
    localStorage.setItem('items', JSON.stringify($scope.currentShoppingList));
  };

  $scope.isInShoppingList = function(product) {
    exists = false
    if ($scope.currentShoppingList && $scope.currentShoppingList.length > 0) {
      for (i = 0; i < $scope.currentShoppingList.length; i++) {
        if (product.id == $scope.currentShoppingList[i].id) {
          exists = true;
        }
      };
    };
    return exists;
  };

  $scope.removeFromList = function(product) {
    $scope.currentShoppingList = $scope.currentShoppingList.filter( ( object ) => object.id != product.id );
    localStorage.items = JSON.stringify($scope.currentShoppingList);
  };

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

}]);
