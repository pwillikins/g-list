angular.module('g-list').controller('MainCtrl', [ '$scope', 'categories', 'recipeLists', '$mdDialog', 
  function ($scope, categories, recipeLists, $mdDialog) {
    $scope.recipeLists = recipeLists.recipeLists
    $scope.recipes = recipeLists.recipes
    $scope.recipes.forEach(recipe => recipe.selected = false)
    $scope.selectedRecipes = $scope.recipes.filter(recipe => recipe.selected)
    $scope.recipeSelected = false

    $scope.currentShoppingList = []
    const items = localStorage[ `userShoppingList-${ localStorage.userId }` ]

    if (items && items.length > 0) {
      $scope.currentShoppingList = JSON.parse(items);
    }
    
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
      const foundItem = $scope.currentShoppingList.find(listItem => {
        if (listItem.category) {
          if (listItem.id == product.id && listItem.category == product.category) {
            return listItem
          }
        } else if (listItem.id == product.id) {
          return listItem
        }
      })
      if (foundItem) {
        exists = !exists
      }
      return exists
    }
    // product without catId
    // product with catId - could have dups from two different recipes

    // ---------------- DIALOG FUNCTIONALITY ---------------- //
    function NewRecipeDialogController($scope, $mdDialog, recipes) {
      $scope.createRecipe = function () {
        if (!$scope.recipeName || $scope.recipeName == '') { return; }
        const newRecipe = {
          name: $scope.recipeName,
          recipe: true,
          // image: [$scope.fileUpload]
        }
        console.log('new recipe', newRecipe)
        categories.create(newRecipe).then(function (newRecipe) {
          $scope.navigateToRecipe(newRecipe.id);
          recipes.push(newRecipe)
          $mdDialog.hide()
        });
        $scope.recipeName = ''
      };

      $scope.navigateToRecipe = function (id) {
        window.location = `#!/recipes/${id}`
      }

      $scope.closeDialog = function() {
        $mdDialog.hide()
      }

      $scope.onUpload = (evt) => {
        console.log('UPLOAD', $scope.fileUpload)
        categories.upload()
        // $scope.imageUpload = evt[0]
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

    $scope.navigateToShoppingLists = function (id) {
      window.location = '#!/new_shopping_list'
    }

    $scope.buildList = function () {
      const recipeProducts = $scope.buildPropagatedList()
      recipeProducts.forEach(product => {
        product.selected = true
      })

      $scope.currentShoppingList = $scope.currentShoppingList.concat(
        recipeProducts.filter(product => {
          if (product.selected && !$scope.isInShoppingList(product)) {
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
  }
]);
