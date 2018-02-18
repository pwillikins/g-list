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
    if( $scope.productName == '' ) { return; }
    $scope.errors = {};

    var product = { name: $scope.productName };
    product.categoryId = $scope.recipe.id;
    product.recipe = true;
    var validationResponse = validateProductName( product.name );

    if( validationResponse.valid ) {

      products.create(product).then(function(response) {
        
        // we handle server validation errors
        if( response.data && response.data.errors ) {
          for( var key in response.data.errors ) {
            
            angular.forEach(response.data.errors, function (errors, field) {
              $scope.productForm[ field ].$setValidity('duplicate', false);
              $scope.errors[ field ] = errors.join(', ');
            });
  
          }
  
        } else {

          $scope.productForm['name'].$setValidity('duplicate', true);
          $scope.productForm.$invalid = false;
          $scope.productForm.$dirty = false;

          var newProduct = response;
          newProduct.name = response.attributes.name;
          $scope.recipeProducts.push( newProduct );
  
        }
        
      });

    } else {

      $scope.productForm[ 'name' ].$setValidity('duplicate', false);
      $scope.errors[ 'name' ] = validationResponse.error;

    }
    
    $scope.productName = '';

  };

  validateProductName = function( input ) {
    var response = {
      error: 'Product Already Exists',
      valid: true
    };

    if( input.length == 0 ) {
      response.valid = false;
    }

    for(var product of $scope.allProducts) {
      if( input.toLowerCase() == product.attributes.name.toLowerCase() ) {
        response.valid = false;
      }
    }

    return response;
  }

  $scope.removeProduct = function( productId ) {
    
    products.removeRecipeProduct($scope.recipe.id, productId );
    $scope.recipeProducts = $scope.recipeProducts.filter( ( product ) => product.id != productId );

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
    $scope.currentShoppingList = $scope.currentShoppingList.filter( ( object ) => object.id != product.id );
    localStorage.items = JSON.stringify( $scope.currentShoppingList );
  };

  $scope.searchProducts = function( input ) {    
    var found = [];
    if( input.length > 2 ) {
      
      for( var product of $scope.allProducts ) { 
        if( product.attributes.name.toLowerCase().includes( input.toLowerCase() ) ) {
          found.push( product );
        }
      }
    }
    
    return found;
    
  }

  $scope.selectedItemChange = function (item) {
    
    if( item ) {
      var match = $scope.recipeProducts.filter((product) => product.name == item.attributes.name);
      
      if( match.length == 0 ) {

        products.createRecipeProduct(item.id, $scope.recipe.id).then(function(response) {
          $scope.recipeProducts.push({id: response.id, name: response.attributes.name});
          $scope.selectedItem = {};
        });

      }
    }
  }

}]);
