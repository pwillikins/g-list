angular.module('g-list')
.controller('RecipeListCtrl', [ '$scope', 'recipeList', 
    function ($scope, recipeList) {
        $scope.currentList = recipeList;
        $scope.title = $scope.currentList.attributes.name;
        $scope.shoppingListItems = $scope.currentList.attributes.recipes;
    } 
]);
