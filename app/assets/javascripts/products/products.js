angular.module('g-list')
.factory('products', ['$http', function($http) {
  var factory = {
    products: []
  };

  factory.getAll = function() {
    return $http.get('/products.json').then(function(response) {
      angular.copy(response.data.data, factory.products);
    });
  };

  factory.create = function(product) {
    return $http.post('/products.json', product).then(function(data) {
      factory.products.push(data.data.data);
    });
  };

  return factory;

}]);
