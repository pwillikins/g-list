angular.module('g-list', [ 'ui.router', 'templates', 'Devise', 'tooltips', 'ngMaterial', 'ngAnimate', 'ngAria', 'angularFlex' ])
  .run([ '$rootScope', '$location', 'Auth', '$state', function ($rootScope, $location, Auth, $state) {
    $rootScope.$on('$stateChangeSuccess', function (event) {
      if (!Auth.isAuthenticated()) {
        event.preventDefault();
        if (!$location.path().includes('login') && !$location.path().includes('register')) {
          $state.go('login');
        }
      }
    });

  }])

  .config([ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home/_home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: [ 'categories', function (categories) {
          return categories.getAll();
        }]
      }
    })

    .state('login', {
      url: '/login',
      templateUrl: 'auth/_login.html',
      controller: 'AuthCtrl',
    })

    .state('register', {
      url: '/register',
      templateUrl: 'auth/_register.html',
      controller: 'AuthCtrl',
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

    .state('recipes', {
      url: '/recipes',
      templateUrl: 'recipes/_recipes.html',
      controller: 'RecipesCtrl',
      resolve: {
        postPromise: ['categories', function(categories) {
          return categories.getAll();
        }]
      }
    })

    .state('recipe', {
      url: '/recipes/{id}',
      templateUrl: 'recipe/_recipe.html',
      controller: 'RecipeCtrl',
      resolve: {
        recipe: ['$stateParams', 'categories', function($stateParams, categories) {
          return categories.get($stateParams.id);
        }]
      }
    })

    .state('shoppingLists', {
      url: '/shopping_lists',
      templateUrl: 'shoppingLists/_shoppingLists.html',
      controller: 'ShoppingListsCtrl',
      resolve: {
        postPromise: ['shoppingLists', function(shoppingLists) {
          return shoppingLists.getAll();
        }]
      }
    })

    .state('newShoppingList', {
      url: '/new_shopping_list',
      templateUrl: 'shoppingLists/_shoppingListForm.html',
      controller: 'ShoppingListsCtrl'
    })

    .state('shoppingList', {
      url: '/shopping_lists/{id}',
      templateUrl: 'shoppingList/_shoppingList.html',
      controller: 'ShoppingListCtrl',
      resolve: {
        shoppingList: ['$stateParams', 'shoppingLists', function($stateParams, shoppingLists) {
          return shoppingLists.get($stateParams.id);
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

  $urlRouterProvider.otherwise('login');
}]);
