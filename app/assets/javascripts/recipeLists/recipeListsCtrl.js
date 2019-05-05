angular.module('g-list')
.controller('RecipeListsCtrl', [ '$scope', 'recipeLists',
    function ($scope, recipeLists) {
        $scope.recipeLists = recipeLists.recipeLists
    }
])