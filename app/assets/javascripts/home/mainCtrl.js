angular.module('g-list')
  .controller('MainCtrl', [ '$scope', 'categories', '$mdDialog', function ($scope, categories, $mdDialog){
  $scope.recipes = categories.recipes
  $scope.recipes.forEach(recipe => recipe.selected = false)
  $scope.selectedRecipes = []
  
  $scope.createRecipe = function () {
    if ($scope.recipeName == '') { return; }
    categories.create({
      name: $scope.recipeName,
      recipe: true
    }).then( function(newRecipe) {
      $scope.navigateToRecipe(newRecipe.id);
    });
    $scope.recipeName = '';
  };

  $scope.navigateToRecipe = function (id) {
    window.location = `#!/recipes/${ id }`;
  }

  $scope.selectRecipe = function (selectedRecipe) {
    selectedRecipe.selected = !selectedRecipe.selected
  }

  $scope.areRecipesSelected = function() {
    let show = false
    show = $scope.recipes.some(recipe => {
      return recipe.selected
    })
    return show
  }

  $scope.openNewRecipeDialog = function (ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'home/_newRecipeDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
      .then(function (answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function () {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  function DialogController($scope, $mdDialog) {
    $scope.createRecipe = function () {
      if ($scope.recipeName == '') { return; }
      categories.create({
        name: $scope.recipeName,
        recipe: true
      }).then(function (newRecipe) {
        $scope.navigateToRecipe(newRecipe.id);
        $mdDialog.hide()
      });
      $scope.recipeName = '';
    };

    $scope.navigateToRecipe = function (id) {
      window.location = `#!/recipes/${ id }`;
    }

    $scope.closeDialog = function() {
      $mdDialog.hide()
    }
  }

}]);
