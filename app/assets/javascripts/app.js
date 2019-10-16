angular.module('g-list', [ 'ui.router', 'templates', 'Devise', 'tooltips', 'ngMaterial', 'ngAnimate', 'ngAria', 'angularFlex' ])

  .config([ '$stateProvider', '$urlRouterProvider', 'AuthProvider', function ($stateProvider, $urlRouterProvider, AuthProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home/_home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: [ 'categories', 'recipeLists', '$q', function (categories, recipeLists, $q) {
          return $q.all({
            categories: categories.getAll(),
            recipeLists: recipeLists.getAll()
          });
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
    
    .state('recipeLists', {
      url: '/recipe_lists',
      templateUrl: 'recipeLists/_recipeLists.html',
      controller: 'RecipeListsCtrl',
      resolve: {
        postPromise: ['recipeLists', function (recipeLists) {
          return recipeLists.getAll();
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


    .state('recipeList', {
      url: '/recipe_lists/{id}',
      templateUrl: 'recipeLists/_recipeList.html',
      controller: 'RecipeListCtrl',
      resolve: {
        recipeList: [ '$stateParams', 'recipeLists', function ($stateParams, recipeLists) {
          return recipeLists.get($stateParams.id);
        } ]
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
}])

  .run([ '$rootScope', '$location', 'Auth', '$state', function ($rootScope, $location, Auth, $state) {
    // intercepts each route to handle redirecting if not authenticated
    $rootScope.$on('$stateChangeSuccess', async function (event) {
      const currentUser = await Auth.currentUser()
      if (!currentUser) {
        event.preventDefault();
        if (!$location.path().includes('login') && !$location.path().includes('register')) {
          $state.go('login');
        }
      } else {
        localStorage.setItem('userId', currentUser.id)
        if (!localStorage[ `userShoppingList-${ currentUser.id }`]) {
          localStorage.setItem(`userShoppingList-${ currentUser.id }`, JSON.stringify([]))
        }
      }
    });
  } ])
