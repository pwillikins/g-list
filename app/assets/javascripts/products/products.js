angular.module('g-list')
.factory('products', ['$http', function($http) {
  var factory = {
    products: []
  }

  factory.getAll = function() {
    return $http.get('/products.json').then(function(response) {
      angular.copy(response.data.data, factory.products);
    })
  }

  factory.create = function(product) {
    return $http.post('/products.json', product).then(function(data) {
      var newProduct = data.data.data
      factory.products.push(newProduct)
      return newProduct
    }).catch(function activateError(error) {
      return error
    })
  }

  factory.createRecipeProduct = function (productId, categoryId) {
    return $http.post('/recipe/products.json', {productId: productId, categoryId: categoryId}).then(function (data) {
      return data;
    })
  }

  factory.updateRecipeProduct = function (productId, categoryId, portion) {
    const requestParams = {productId: productId, categoryId: categoryId, portion: portion}
    return $http.put('/recipe/products.json', requestParams).then(function (data) {
      return data
    })
  }

  factory.deleteProduct = function(id) {
    return $http.delete('/products/' + id + '.json').then(function() {
      var updateProducts = factory.products.filter(function(element) {
        return element.id !== id
      })
      angular.copy(updateProducts, factory.products)
    })
  }

  factory.removeRecipeProduct = function (categoryId, productId) {
    return $http.post('/categorizations.json', { categoryId: categoryId, productId: productId }).then(function (data) {})
  }

  return factory

}]);
