angular.module('g-list')
.factory('categories', ['$http', function($http) {
  factory = {
    categories: [],
    recipes: []
  };

  factory.getAll = function() {
    return $http.get('/categories.json').then(function(response) {
      factory.recipes = [];
      factory.categories = [];
      var categoriesResponse = response.data.data;
      for (index = 0; index < categoriesResponse.length; index ++) {
        if (categoriesResponse[index].attributes.recipe) {
          factory.recipes.push(categoriesResponse[index]);
        } else {
          factory.categories.push(categoriesResponse[index]);
        };
      };
    });
  };

  factory.create = function(category) {
    return $http.post('/categories.json', category).then(function(data) {
      var newCategory = data.data.data;
      if (!newCategory.attributes.recipe) {
        factory.categories.push(newCategory);
      } else {
        factory.recipes.push(newCategory);
      };
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

  factory.deleteCategory = function(id) {
    return $http.delete('/categories/' + id + '.json').then(function() {
      var updateCategories = factory.categories.filter(function(element) {
        return element.id !== id;
      });
      angular.copy(updateCategories, factory.categories);
    });
  };

  return factory;
}]);
