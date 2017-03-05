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

  factory.deleteList = function(id) {
    return $http.delete('/shopping_lists/' + id + '.json').then(function() {
      var updatedLists = factory.shoppingLists.filter(function(element) {
        return element.id !== id;
      });
      angular.copy(updatedLists, factory.shoppingLists);
    });
  };

  factory.updateItem = function(item) {
    return $http.put('/shopping_lists/' + item.id + '.json', item);
  };

  return factory;
}]);
