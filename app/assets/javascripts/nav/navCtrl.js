angular.module('g-list')
  .controller('NavCtrl', [ '$scope', 'Auth', '$state', '$mdDialog', 
    function ($scope, Auth, $state, $mdDialog) {
  
  $scope.signedIn = Auth.isAuthenticated;
  $scope.logout = Auth.logout;
  $scope.showCreateButton = false
  $scope.currentShoppingList = []
  
  // we set a parent scope object that we $watch for changes
  $scope.$watch('$parent.recipeSelected', function () {
    $scope.showCreateButton = $scope.$parent.recipeSelected
  });

  $scope.removeDuplicates = function (myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[ prop ]).indexOf(obj[ prop ]) === pos;
    });
  }

  $scope.buildPropagatedList = function () {
    let propagatedProducts = []
    $scope.$parent.selectedRecipes.forEach(selectedRecipe =>
      propagatedProducts = propagatedProducts.concat(selectedRecipe.attributes.products)
    )

    let uniqueProductList = $scope.removeDuplicates(propagatedProducts, 'id')
    // we reset all products to unselected
    uniqueProductList.forEach(product => product[ 'selected' ] = false)

    return uniqueProductList
  }

  $scope.isInShoppingList = function (product) {
    return $scope.currentShoppingList.indexOf(product) > -1
  };

  $scope.$on('devise:new-registration', function (e, user) {
    $scope.user = user;
  });

  $scope.$on('devise:login', function (e, user) {
    $scope.user = user;
  });

  $scope.$on('devise:logout', function (e, user) {
    $scope.user = {};
    $scope.closeNav();
    $state.go('login');
    localStorage.clear();
  });

  $scope.registerPage = function () {
    $state.go('register');
  };

  $scope.loginPage = function () {
    $state.go('login');
  };


  // ----------------- Sidenav Functionality ----------------- //
  $scope.openNav = function () {
    if ($scope.signedIn()) {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("myCanvasNav").style.width = "100%";
      document.getElementById("myCanvasNav").style.opacity = "0.8";
      document.getElementById("myCanvasNav").style.marginLeft = "250px"
    }
  };

  $scope.closeNav = function () {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  };

  // ---------------- DIALOG FUNCTIONALITY ---------------- //
  $scope.openBuildListDialog = function (ev) {
    $scope.currentShoppingList = JSON.parse(localStorage.items);

    const propagatedProducts = $scope.buildPropagatedList()
    propagatedProducts.forEach(product => {
      product.selected = $scope.isInShoppingList(product)
    })

    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'recipeLists/_buildListDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: { data: propagatedProducts },
      clickOutsideToClose: true
    })
    .then(function () {
      $scope.showCreateButton = false
    }, function () {
      
    });
  };

  function DialogController($scope, $mdDialog, data) {
    $scope.propagatedProducts = data
    $scope.currentShoppingList = []

    if (localStorage.items && localStorage.items.length > 0) {
      $scope.currentShoppingList = JSON.parse(localStorage.items);
    }

    $scope.buildList = function () {
      $scope.currentShoppingList = $scope.currentShoppingList.concat(
        $scope.propagatedProducts.filter(product => product.selected)
      )
      
      const list = $scope.removeDuplicates($scope.currentShoppingList, 'id')
      localStorage.setItem('items', JSON.stringify(list))
      $mdDialog.hide()
      $scope.navigateToShoppingLists()
    }

    $scope.navigateToShoppingLists = function (id) {
      window.location = '#!/new_shopping_list';
    }

    $scope.closeDialog = function () {
      $mdDialog.cancel()
    }


    $scope.removeDuplicates = function (myArr, prop) {
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[ prop ]).indexOf(obj[ prop ]) === pos;
      });
    }
  }

}]);
