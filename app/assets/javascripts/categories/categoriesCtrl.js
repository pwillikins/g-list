angular.module('g-list')
.controller('CategoriesCtrl', ['$scope', 'categories', function($scope, categories) {

  $scope.categories = categories.categories;
  $scope.title = 'Categories'
  $scope.recipe = false;

  for (index = 0; index < $scope.categories.length; index ++) {
    if ($scope.categories[index].attributes.recipe) {
      $scope.categories.splice(index, 1);
    };
  };

  $scope.createCategory = function() {
    if ($scope.name == '') { return; }
    categories.create({
      name: $scope.name,
      recipe: $scope.recipe
    });
    $scope.name = '';
    $scope.recipe = false;
  };
}]);
