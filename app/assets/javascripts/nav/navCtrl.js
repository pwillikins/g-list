angular.module('g-list')
  .controller('NavCtrl', [ '$scope', 'Auth', '$state', '$mdDialog', 
    function ($scope, Auth, $state, $mdDialog) {
  
  $scope.signedIn = Auth.isAuthenticated;
  $scope.logout = Auth.logout;
  $scope.showCreateButton = false
  $scope.currentShoppingList = []

  if (localStorage.items && localStorage.items.length > 0) {
    $scope.currentShoppingList = JSON.parse(localStorage.items);
  }
  
  // we set a parent scope object that we $watch for changes
  $scope.$watch('$parent.recipeSelected', function () {
    $scope.showCreateButton = $scope.$parent.recipeSelected
  });
  
  $scope.$on('devise:new-registration', function (e, user){
    $scope.user = user;
  });

  $scope.$on('devise:login', function (e, user){
    $scope.user = user;
  });

  $scope.$on('devise:logout', function (e, user){
    $scope.user = {};
    $scope.closeNav();
    $state.go('login');
    localStorage.clear();
  });

  $scope.registerPage = function() {
    $state.go('register');
  };

  $scope.loginPage = function() {
    $state.go('login');
  };

  $scope.openNav = function() {
    if ($scope.signedIn()) {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("myCanvasNav").style.width = "100%";
      document.getElementById("myCanvasNav").style.opacity = "0.8";
      document.getElementById("myCanvasNav").style.marginLeft = "250px"
    }
  };

  $scope.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  };

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

    return $scope.removeDuplicates(propagatedProducts, 'id')
  }

  $scope.isInShoppingList = function (product) {
    exists = false
    for (i = 0; i < $scope.currentShoppingList.length; i++) {
      if ($scope.currentShoppingList[ i ].id == product.id) {
        exists = true;
      }
    };

    return exists;
  };

  // ---------------- DIALOG FUNCTIONALITY ---------------- //
  $scope.openBuildListDialog = function (ev) {
    const propagatedProducts = $scope.buildPropagatedList()
    propagatedProducts.forEach(product => {
      const isInList = $scope.isInShoppingList(product)
      if (isInList) {
        product.selected = true
      }
    })
    $scope.isDialogOpen = true

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
      
    }, function () {
      $scope.showCreateButton = false
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
      $scope.closeDialog()
      $scope.navigateToShoppingLists()
    }

    $scope.navigateToShoppingLists = function (id) {
      window.location = '#!/new_shopping_list';
    }

    $scope.closeDialog = function () {
      $mdDialog.hide()
    }

    $scope.removeDuplicates = function (myArr, prop) {
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[ prop ]).indexOf(obj[ prop ]) === pos;
      });
    }
  }

}]);
