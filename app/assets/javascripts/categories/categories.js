angular.module('g-list')
.factory('categories', ['$http', function($http) {
  factory = {
    categories: []
  };

  factory.getAll = function() {
    return $http.get('/categories.json').then(function(response) {
      angular.copy(response.data, factory.categories);
    });
  };

  factory.create = function(category) {
    return $http.post('/categories.json', category).then(function(data) {
      factory.categories.push(data.data);
    });
  };

  return factory;
}]);
