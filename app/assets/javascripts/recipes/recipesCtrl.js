angular.module('g-list')
.controller('RecipesCtrl', ['$scope', 'categories', function($scope, categories) {
  $scope.recipes = categories.recipes;
  $scope.title = 'Recipes'

  $scope.navigateToRecipe = function (id) {
    window.location = `#!/recipes/${ id }`;
  }

}]);
