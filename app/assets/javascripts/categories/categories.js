angular.module('g-list')
.factory('categories', ['$http', function($http) {
  factory = {
    categories: [],
    recipes: [],
    allCategories: []
  };

  factory.getAll = function() {
    return $http.get('/categories.json').then(function(response) {
      factory.recipes = [];
      factory.categories = [];
      var categoriesResponse = response.data.data;
      angular.copy(categoriesResponse, factory.allCategories);

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
        return newCategory;
      } else {
        factory.recipes.push(newCategory);
        return newCategory;
      };
    });
  };

  factory.upload = function(id, file) {
    var data = new FormData();
    data.append('file', file)
    const req = {
      method: 'PUT',
      url: `/categories/${id}`,
      headers: {
        'Content-Type': undefined
      },
      data: data
    }

    return $http(req).then(function(data) {
      return data
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

  factory.deleteRecipe = function(id) {
    return $http.delete('/categories/' + id + '.json').then(function() {
      var updateRecipes = factory.recipes.filter(function(element) {
        return element.id !== id;
      });
      angular.copy(updateRecipes, factory.recipes);
    });
  };

  return factory;
}]);
