angular.module('g-list')
.controller('CategoriesCtrl', ['$scope', 'categories', function($scope, categories) {

  $scope.categories = categories.categories;
  $scope.title = 'Categories'
  $scope.recipe = false;

  $scope.createCategory = function() {
    if ($scope.name == '') { return; }
    categories.create({
      name: $scope.name,
      recipe: $scope.recipe
    });
    $scope.name = '';
    $scope.recipe = false;
  };

  $scope.removeCategory = function(id) {
    categories.deleteCategory(id);
  };
}]);
