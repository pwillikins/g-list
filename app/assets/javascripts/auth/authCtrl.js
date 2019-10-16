angular.module('g-list')
.controller('AuthCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth){

  $scope.login = function() {
    Auth.login($scope.user).then(function(){
      if($scope.user) {
        $scope.setLocalStorageUser()
      }
      $state.go('home');
    });
  };

  $scope.register = function() {
    Auth.register($scope.user).then(function() {
      if ($scope.user) {
        $scope.setLocalStorageUser()
      }
      $state.go('home');
    });
  };

  $scope.setLocalStorageUser = async function() {
    localStorage.clear()
    const user = await Auth.currentUser()
    localStorage.setItem('userId', user.id)
    localStorage.setItem(`userShoppingList-${user.id}`, JSON.stringify([]))
  }

}]);
