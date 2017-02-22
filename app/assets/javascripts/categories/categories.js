angular.module('g-list')
.factory('categories', ['$http', function($http) {
  factory = {
    categories: []
  };

  factory.getAll = function() {
    return $http.get('/categories.json').then(function(response) {
      angular.copy(response.data.data, factory.categories);
    });
  };

  factory.create = function(category) {
    return $http.post('/categories.json', category).then(function(data) {
      factory.categories.push(data.data.data);
    });
  };

  factory.get = function(id) {
    return $http.get('/categories/' + id + '.json').then(function(response) {
      return response.data.data;
    });
  };

  factory.addDescription = function(id, description) {
    return $http.put('/categories/' + id + '.json', description);
  };

  return factory;
}]);
