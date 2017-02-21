angular.module('g-list')
.controller('RecipesCtrl', ['$scope', 'categories', function($scope, categories) {
  $scope.categories = categories.categories;
  $scope.recipes = [];
  $scope.title = 'Recipes'

  for (i = 0; i < $scope.categories.length; i ++) {
    if ($scope.categories[i].attributes.recipe) {
      $scope.recipes.push($scope.categories[i]);
    };
  };

}]);
