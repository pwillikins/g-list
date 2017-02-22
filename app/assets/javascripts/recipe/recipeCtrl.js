angular.module('g-list')
.controller('RecipeCtrl', ['$scope', 'recipe', 'categories', function($scope, recipe, categories) {

  $scope.recipe = recipe;
  $scope.description = $scope.recipe.attributes.description;

  $scope.saveDescription = function() {
    if ($scope.description == '') { return; }
    categories.addDescription($scope.recipe.id, {
      description: $scope.description
    }).then(function(response) {
      $scope.recipe = response.data.data;
      $scope.description = $scope.recipe.attributes.description;
    });
  };
}]);
