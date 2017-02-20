angular.module('g-list')
.controller('CategoriesCtrl', ['$scope', 'categories', function($scope, categories) {
  $scope.categories = categories.categories;
  $scope.title = 'Categories'

  $scope.createCategory = function() {
    if ($scope.name == '') { return; }
    categories.create({
      name: $scope.name
    });
    $scope.name = '';
  };
}]);
