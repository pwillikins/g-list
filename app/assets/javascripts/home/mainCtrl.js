angular.module('g-list').controller('MainCtrl', [ '$scope', 'categories', 'recipeLists', '$mdDialog', 
  function ($scope, categories, recipeLists, $mdDialog) {
    $scope.recipeLists = recipeLists.recipeLists
    $scope.recipes = recipeLists.recipes
    $scope.recipes.forEach(recipe => recipe.selected = false)
    $scope.selectedRecipes = $scope.recipes.filter(recipe => recipe.selected)
    $scope.recipeSelected = false
    
    $scope.removeRecipe = function (id) {
      categories.deleteRecipe(id);
      $scope.recipes = $scope.recipes.filter(recipe => recipe.id != id)
    }
    
    $scope.navigateToRecipe = function (id) {
      $scope.$parent.recipeSelected = false
      window.location = `#!/recipes/${ id }`
    }
    
    $scope.selectRecipe = function () {
      const recipesAreSelected = $scope.areRecipesSelected()
      if ($scope.$parent.recipeSelected != recipesAreSelected) {
        $scope.recipeSelected = recipesAreSelected
      }
      $scope.selectedRecipes = $scope.recipes.filter(recipe => recipe.selected)
    }
    
    $scope.areRecipesSelected = function() {
      let anySelected = false
      anySelected = $scope.recipes.some(recipe => {
        return recipe.selected
      })
      return anySelected
    }

    $scope.removeDuplicates = function (myArr, prop) {
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[ prop ]).indexOf(obj[ prop ]) === pos;
      });
    }

    $scope.buildPropagatedList = function () {
      let propagatedProducts = []
      $scope.selectedRecipes.forEach(selectedRecipe =>
        propagatedProducts = propagatedProducts.concat(selectedRecipe.attributes.products)
      )

      let uniqueProductList = $scope.removeDuplicates(propagatedProducts, 'id')
      // we reset all products to unselected
      uniqueProductList.forEach(product => product[ 'selected' ] = false)

      return uniqueProductList
    }

    $scope.isInShoppingList = function (product) {
      let exists = false
      const foundItem = $scope.currentShoppingList.find(listItem => listItem.id == product.id)
      if (foundItem) {
        exists = !exists
      }
      return exists
    }
    


    // ---------------- DIALOG FUNCTIONALITY ---------------- //
    function NewRecipeDialogController($scope, $mdDialog, recipes) {
      $scope.createRecipe = function () {
        if ($scope.recipeName == '') { return; }
        categories.create({
          name: $scope.recipeName,
          recipe: true
        }).then(function (newRecipe) {
          $scope.navigateToRecipe(newRecipe.id);
          recipes.push(newRecipe)
          $mdDialog.hide()
        });
        $scope.recipeName = ''
      };

      $scope.navigateToRecipe = function (id) {
        window.location = `#!/recipes/${ id }`
      }

      $scope.closeDialog = function() {
        $mdDialog.hide()
      }

    }

    // Open New Recipe Dialog
    $scope.openNewRecipeDialog = function (ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show({
        controller: NewRecipeDialogController,
        templateUrl: 'home/_newRecipeDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {recipes: $scope.recipes},
        clickOutsideToClose: true
      })
        .then(function (answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    // Open New Recipe List Dialog
    $scope.openBuildListDialog = function (ev) {
      $scope.currentShoppingList = []
      if (localStorage[ `userShoppingList-${ localStorage.userId }` ]) {
        $scope.currentShoppingList = JSON.parse(localStorage[ `userShoppingList-${ localStorage.userId}`])
        $scope.currentShoppingList.forEach(product => product.selected = false)
      }

      const propagatedProducts = $scope.buildPropagatedList()
      propagatedProducts.forEach(product => {
        product.selected = $scope.isInShoppingList(product)
      })

      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show({
        controller: RecipeListDialogController,
        templateUrl: 'recipeLists/_buildListDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: { data: propagatedProducts, selectedRecipes: $scope.$parent.selectedRecipes },
        clickOutsideToClose: true
      })
        .then(function () {
          $scope.showCreateButton = false
        }, function () {

        });
    };

    // ----- New Recipe List Dialog ----- //
    function RecipeListDialogController($scope, $mdDialog, data, selectedRecipes) {
      // Build Recipe List Functionality
      $scope.propagatedProducts = data
      $scope.currentShoppingList = []
      const items = localStorage[ `userShoppingList-${ localStorage.userId }` ]
      
      if (items && items.length > 0) {
        $scope.currentShoppingList = JSON.parse(items);
      }

      $scope.navigateToShoppingLists = function (id) {
        window.location = '#!/new_shopping_list'
      }

      $scope.closeDialog = function () {
        $mdDialog.cancel()
      }

      $scope.createRecipeList = function () {
        $scope.currentShoppingList = $scope.currentShoppingList.concat(
          $scope.propagatedProducts.filter(product => product.selected)
        )

        const list = $scope.removeDuplicates($scope.currentShoppingList, 'id')
        localStorage.setItem(`userShoppingList-${ localStorage.userId }`, JSON.stringify(list))
        recipeLists.create({ recipes: selectedRecipes }).then(function () {
          $mdDialog.hide()
          $scope.navigateToShoppingLists()
        })
      }

      $scope.removeDuplicates = function (myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj[ prop ]).indexOf(obj[ prop ]) === pos;
        });
      }
    }
  }
]);
