angular.module('g-list')
.factory('shoppingLists', ['$http', function($http) {
  factory = {
    products: [],
    shoppingLists: []
  };

  factory.getAll = function() {
    return $http.get('/shopping_lists.json').then(function(response) {
      angular.copy(response.data.data, factory.shoppingLists)
    });
  };

  factory.create = function(products) {
    return $http.post('/shopping_lists.json', products);
  };

  factory.get = function(id) {
    return $http.get('/shopping_lists/' + id + '.json').then(function(response) {
      return response.data.data;
    });
  };

  return factory;
}]);
