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
      var newProduct = data.data.data;
      factory.products.push(newProduct);
      return newProduct;
    }).catch(function activateError(error) {
      return error;
      // alert('An error happened');
    });
  };

  factory.deleteProduct = function(id) {
    return $http.delete('/products/' + id + '.json').then(function() {
      var updateProducts = factory.products.filter(function(element) {
        return element.id !== id;
      });
      angular.copy(updateProducts, factory.products);
    });
  };

  return factory;

}]);
