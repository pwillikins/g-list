angular.module('g-list')
.controller('AuthCtrl', ['$scope', '$state', 'Auth', '$mdToast', function($scope, $state, Auth, $mdToast) {

  $scope.login = function() {
    Auth.login($scope.user).then(function(){
      if($scope.user) {
        $scope.setLocalStorageUser()
      }
      $mdToast.show($mdToast.simple().textContent('Logged in Successfully!'))
      $state.go('home')
    })
    .catch(function(ex) {
      $mdToast.show($mdToast.simple().textContent(ex.data.error))
    })
  }

  $scope.register = function() {
    Auth.register($scope.user).then(function() {
      if ($scope.user) {
        $scope.setLocalStorageUser()
      }
      $mdToast.show($mdToast.simple().textContent('Sign Up Successful!'))
      $state.go('home')
    })
    .catch(function(ex) {
      $mdToast.show($mdToast.simple().textContent(ex.data.error))
    })
  }

  $scope.setLocalStorageUser = async function() {
    if (localStorage.getItem('userId')) {
      localStorage.removeItem('userId')
    }
    
    const user = await Auth.currentUser()
    localStorage.setItem('userId', user.id)
    localStorage.setItem(`userShoppingList-${user.id}`, JSON.stringify([]))
  }

}])
