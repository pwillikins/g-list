angular.module('g-list')
.factory('recipeLists', [ '$http', function ($http) {
    factory = {
        recipes: [],
        recipeLists: []
    };

    factory.getAll = function () {
        return $http.get('/recipe_lists.json').then(function (response) {
            angular.copy(response.data.data, factory.recipeLists)
        });
    };

    factory.create = function (recipes) {
        return $http.post('/recipe_lists.json', recipes);
    };

    factory.get = function (id) {
        return $http.get('/recipe_lists/' + id + '.json').then(function (response) {
            return response.data.data;
        });
    };

    factory.deleteList = function (id) {
        return $http.delete('/recipe_lists/' + id + '.json').then(function () {
            var updatedLists = factory.recipeLists.filter(function (element) {
                return element.id !== id;
            });
            angular.copy(updatedLists, factory.recipeLists);
        });
    };

    factory.updateItem = function (item) {
        return $http.put('/recipe_lists/' + item.id + '.json', item);
    };

    return factory;
}]);
