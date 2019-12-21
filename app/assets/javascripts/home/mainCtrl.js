angular.module('g-list').controller('MainCtrl', [ '$scope', 'categories', 'recipeLists', '$mdDialog', '$mdToast', 
  function ($scope, categories, recipeLists, $mdDialog, $mdToast) {
    $scope.recipeLists = recipeLists.recipeLists
    $scope.recipes = recipeLists.recipes
    $scope.filteredRecipes = [...$scope.recipes]
    $scope.recipes.forEach(recipe => recipe.selected = false)
    $scope.selectedRecipes = $scope.recipes.filter(recipe => recipe.selected)
    $scope.recipeSelected = false
    $scope.sortOption = 'Custom'

    $scope.currentShoppingList = []
    const items = localStorage[ `userShoppingList-${ localStorage.userId }` ]

    if (items && items.length > 0) {
      $scope.currentShoppingList = JSON.parse(items);
    }
    
    $scope.removeRecipe = function (id) {
      categories.deleteRecipe(id);
      $scope.recipes = $scope.recipes.filter(recipe => recipe.id != id)
      $scope.filteredRecipes = $scope.filteredRecipes.filter(recipe => recipe.id != id)
      toastMessage('Recipe Removed')
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
      // uniqueProductList.forEach(product => product[ 'selected' ] = false)

      return uniqueProductList
    }

    $scope.isInShoppingList = function (product) {
      return $scope.currentShoppingList.some(listItem => listItem.id === product.id)
    }

    // ---------------- DIALOG CONTROLLER ---------------- //
    function NewRecipeDialogController($scope, $mdDialog, recipes) {
      setTimeout(() => {
        const input = document.getElementById("recipe-name")
        input.focus();
      }, 500)

      $scope.createRecipe = function () {
        if (!$scope.recipeName || $scope.recipeName == '') { return; }
        const newRecipe = {
          name: $scope.recipeName,
          recipe: true,
          // image: [$scope.fileUpload]
        }
        categories.create(newRecipe).then(function (newRecipe) {
          recipes.push(newRecipe)
          $scope.recipeName = ''
          toastMessage('New Recipe Created')
        });
      };

      $scope.navigateToRecipe = function (id) {
        window.location = `#!/recipes/${id}`
      }

      $scope.closeDialog = function() {
        $mdDialog.hide()
      }

      $scope.onUpload = (evt) => {
        categories.upload()
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
        locals: {recipes: $scope.filteredRecipes},
        clickOutsideToClose: true
      })
        .then(function (answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    $scope.navigateToShoppingLists = function (id) {
      window.location = '#!/new_shopping_list'
    }

    $scope.buildList = function () {
      const recipeProducts = $scope.buildPropagatedList()
      $scope.currentShoppingList = $scope.currentShoppingList.concat(
        recipeProducts.filter(product => {
          if (!$scope.isInShoppingList(product)) {
            return {
              id: product.id,
              categoryId: product.category,
              portion: product.portion
            }
          }
        })
      )

      localStorage.setItem(`userShoppingList-${ localStorage.userId }`, JSON.stringify($scope.currentShoppingList))
      $scope.navigateToShoppingLists()
      // refactor to keep track of recipes selected
      // recipeLists.create({ recipes: $scope.selectedRecipes }).then(function () {
      // })
    }

    // Open New Recipe List Dialog
    // $scope.openBuildListDialog = function (ev) {
    //   // we fetch each selected recipe's products
    //   const recipeProducts = $scope.buildPropagatedList()
    //   recipeProducts.forEach(product => {
    //     product.selected = true
    //   })

    //   // Appending dialog to document.body to cover sidenav in docs app
    //   // Modal dialogs should fully cover application
    //   // to prevent interaction outside of dialog
    //   $mdDialog.show({
    //     controller: RecipeListDialogController,
    //     templateUrl: 'home/_buildListDialog.html',
    //     parent: angular.element(document.body),
    //     targetEvent: ev,
    //     locals: { data: recipeProducts, selectedRecipes: $scope.selectedRecipes },
    //     clickOutsideToClose: true
    //   })
    //     .then(function (data) {
    //       $scope.showCreateButton = false
    //       $scope.createRecipeList(data)
    //     }, function () {

    //     });
    // };

    // // ----- New Recipe List Dialog ----- //
    // function RecipeListDialogController($scope, $mdDialog, data, selectedRecipes) {
    //   // Build Recipe List Functionality
    //   $scope.selectedRecipes = selectedRecipes
    //   $scope.recipeProducts = data

    //   $scope.closeDialog = function () {
    //     $mdDialog.cancel()
    //   }

    //   $scope.createRecipeList = function () {
    //     $mdDialog.hide($scope.recipeProducts)
    //   }
    // }

    $scope.searchRecipes = function() {
    if ($scope.searchPhrase && $scope.searchPhrase.length) {
      $scope.filteredRecipes = $scope.recipes.filter(recipe => recipe.attributes.name.toLowerCase().includes($scope.searchPhrase.toLowerCase()))
    } else {
      $scope.filteredRecipes = $scope.recipes
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
      $scope.filteredRecipes = $scope.filteredRecipes.sort(function(a, b) {
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
      $scope.filteredRecipes = [...$scope.recipes]
    }
  }

  toastMessage = function(message) {
    $mdToast.show($mdToast.simple().textContent(message).position('center'))
  }
}]);
