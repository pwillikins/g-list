angular.module('g-list')
  .controller('MainCtrl', [ '$scope', 'categories', '$mdDialog', 'recipeLists', function ($scope, categories, $mdDialog, recipeLists){
  $scope.recipes = categories.recipes
  $scope.recipes.forEach(recipe => recipe.selected = false)
  $scope.$parent.selectedRecipes = $scope.recipes.filter(recipe => recipe.selected)
  
  $scope.removeRecipe = function (id) {
    categories.deleteRecipe(id);
    $scope.recipes = $scope.recipes.filter(recipe => recipe.id != id)
  }
  
  $scope.navigateToRecipe = function (id) {
    window.location = `#!/recipes/${ id }`;
  }
  
  $scope.selectRecipe = function () {
    const recipesAreSelected = $scope.areRecipesSelected()
    $scope.$parent.recipeSelected = recipesAreSelected
    $scope.$parent.selectedRecipes = $scope.recipes.filter(recipe => recipe.selected)
  }
  
  $scope.areRecipesSelected = function() {
    let show = false
    show = $scope.recipes.some(recipe => {
      return recipe.selected
    })
    return show
  }
  
  // ---------------- DIALOG FUNCTIONALITY ---------------- //
  $scope.openNewRecipeDialog = function (ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show({
        controller: DialogController,
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

  function DialogController($scope, $mdDialog, recipes) {
    $scope.createRecipe = function () {
      if ($scope.recipeName == '') { return; }
      categories.create({
        name: $scope.recipeName,
        recipe: true
      }).then(function (newRecipe) {
        // $scope.navigateToRecipe(newRecipe.id);
        recipes.push(newRecipe)
        $mdDialog.hide()
      });
      $scope.recipeName = ''
    };

    $scope.navigateToRecipe = function (id) {
      window.location = `#!/recipes/${ id }`;
    }

    $scope.closeDialog = function() {
      $mdDialog.hide()
    }
  }

}]);
