angular.module('g-list')
.controller('NavCtrl', ['$scope', 'Auth', '$state', function($scope, Auth, $state) {

  $scope.signedIn = Auth.isAuthenticated;
  $scope.logout = Auth.logout;

  Auth.currentUser().then(function(user) {
    $scope.user = user;
  });

  $scope.$on('devise:new-registration', function (e, user){
    $scope.user = user;
  });

  $scope.$on('devise:login', function (e, user){
    $scope.user = user;
  });

  $scope.$on('devise:logout', function (e, user){
    $scope.user = {};
    $state.go('login');
    localStorage.clear();
  });

  $scope.registerPage = function() {
    $state.go('register');
  };

  $scope.loginPage = function() {
    $state.go('login');
  };

  $scope.openNav = function() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.8";
    document.getElementById("myCanvasNav").style.marginLeft = "250px"
  };

  $scope.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  };

}]);
