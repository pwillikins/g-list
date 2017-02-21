angular.module('g-list', ['ui.router', 'templates', 'Devise'])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home/_home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts) {
          return posts.getAll();
        }]
      }
    })

    .state('login', {
      url: '/login',
      templateUrl: 'auth/_login.html',
      controller: 'AuthCtrl',
      // onEnter: ['$state', 'Auth', function($state, Auth) {
      //   Auth.currentUser().then(function (){
      //     $state.go('home');
      //   })
      // }]
    })

    .state('register', {
      url: '/register',
      templateUrl: 'auth/_register.html',
      controller: 'AuthCtrl',
      // onEnter: ['$state', 'Auth', function($state, Auth) {
      //   Auth.currentUser().then(function (){
      //     $state.go('home');
      //   })
      // }]
    })

    .state('products', {
      url: '/products',
      templateUrl: 'products/_products.html',
      controller: 'ProductsCtrl',
      resolve: {
        postPromise: ['products', 'categories', '$q', function(products, categories, $q) {
          return $q.all({
            products: products.getAll(),
            categories: categories.getAll()
          });
        }]
      }
    })

    .state('categories', {
      url: '/categories',
      templateUrl: 'categories/_categories.html',
      controller: 'CategoriesCtrl',
      resolve: {
        postPromise: ['categories', function(categories) {
          return categories.getAll();
        }]
      }
    })

    .state('posts', {
      url: '/posts/{id}',
      templateUrl: 'posts/_posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]);
