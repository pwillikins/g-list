angular.module('g-list')
  .controller('NavCtrl', [ '$scope', 'Auth', '$state', 
    function ($scope, Auth, $state) {
      
      $scope.signedIn = Auth.isAuthenticated
      $scope.logout = Auth.logout
      $scope.showCreateButton = false
      $scope.currentShoppingList = []
      

      $scope.$on('devise:new-registration', function (e, user) {
        $scope.user = user
        localStorage.setItem('userId', $scope.user.id)
      })

      $scope.$on('devise:login', function (e, user) {
        $scope.user = user
        localStorage.setItem('userId', $scope.user.id)
      })

      $scope.$on('devise:logout', function (e, user) {
        $scope.user = {}
        $scope.closeNav()
        $state.go('login')
        localStorage.removeItem('userId')
      })

      $scope.registerPage = function () {
        $state.go('register')
      }

      $scope.loginPage = function () {
        $state.go('login')
      }

      // ----------------- Sidenav Functionality ----------------- //
      $scope.openNav = function () {
        if ($scope.signedIn()) {
          document.getElementById("mySidenav").style.width = "300px"
          document.getElementById("myCanvasNav").style.width = "100%"
          document.getElementById("myCanvasNav").style.opacity = "0.8"
          document.getElementById("myCanvasNav").style.marginLeft = "300px"
        }
      }

      $scope.closeNav = function () {
        document.getElementById("mySidenav").style.width = "0"
        document.getElementById("myCanvasNav").style.width = "0%"
        document.getElementById("myCanvasNav").style.opacity = "0"
      }

      $scope.navItemSelected = function(location) {
        return window.location.href.includes(location)
      }
    }
  ])
