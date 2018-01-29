angular.module('g-list')
.controller('RecipeCtrl', ['$scope', 'recipe', 'categories', 'products', function($scope, recipe, categories, products) {

  $scope.recipe = recipe;
  $scope.error = '';
  $scope.description = $scope.recipe.attributes.description;
  $scope.recipeProducts = $scope.recipe.attributes.products;
  products.getAll();
  $scope.allProducts = products.products;


  if( localStorage.items && localStorage.items.length > 0 ) {

    $scope.currentShoppingList = JSON.parse( localStorage.items );

  } else {

    $scope.currentShoppingList = [];

  }

  $scope.saveDescription = function() {
    if( $scope.description == '' ) { return; }
    
    categories.addDescription($scope.recipe.id, {
      description: $scope.description
    }).then(function(response) {
      $scope.recipe = response.data.data;
      $scope.description = $scope.recipe.attributes.description;
    });
  };

  $scope.createProduct = function () {
    $scope.errors = {};
    if( $scope.productName == '' ) { return; }

    var product = { name: $scope.productName };
    product.categoryId = $scope.recipe.id;
    product.recipe = true;
    products.create(product).then(function(response) {

      if( response.data && response.data.errors ) {
        for( var key in response.data.errors ) {
          
          angular.forEach(response.data.errors, function (errors, field) {
            $scope.productForm[ field ].$setValidity('server', false);
            $scope.errors[ field ] = errors.join(', ');
          });

        }

      } else {
        
        var newProduct = response;
        newProduct.name = response.attributes.name;
        $scope.recipeProducts.push( newProduct );

      }
      
    });   
    
    $scope.productName = '';

  };

  $scope.removeProduct = function( id ) {
    
    products.deleteProduct( id );
    $scope.recipeProducts = $scope.recipeProducts.filter( ( product ) => product.id != id );

  };

  $scope.isInShoppingList = function(product) {
    exists = false
    for( i = 0; i < $scope.currentShoppingList.length; i++ ) {

      if( $scope.currentShoppingList[i].id == product.id ) {

        exists = true;

      }

    };

    return exists;

  };

  $scope.addToShoppingList = function( product ) {

    product.added = true;
    $scope.currentShoppingList.push( product );
    localStorage.setItem( 'items', JSON.stringify( $scope.currentShoppingList ) );

  };

  $scope.removeFromList = function( product ) {

    var index = $scope.currentShoppingList.indexOf( product );
    $scope.currentShoppingList.splice( index, 1 );
    localStorage.items = JSON.stringify( $scope.currentShoppingList );

  };

  $scope.searchProducts = function( input ) {    
    var found = [];
    if( input.length > 2 ) {

      for( var product of $scope.allProducts ) {
        
        if( product.attributes.name.toLowerCase().includes( input ) ) {
          
          found.push( product );

        }

      }

    }
    
    return found;
    
  }

  $scope.createFromExisting = function(selectedItem) {

  }

}]);
