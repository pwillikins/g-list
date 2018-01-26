angular.module('g-list')
.controller('MainCtrl', ['$scope', 'categories', 'Auth', function($scope, categories, Auth){
  $scope.recipes = categories.recipes;
  
  $scope.createRecipe = function () {
    if ($scope.recipeName == '') { return; }
    categories.create({
      name: $scope.recipeName,
      recipe: true
    });
    $scope.recipeName = '';
  };

  $scope.navigateToRecipe = function (id) {
    window.location = `#!/recipes/${id}`;
  }

}]);
