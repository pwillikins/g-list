angular.module('g-list')
  .controller('RecipeCtrl', [ '$scope', 'recipe', 'categories', 'products', '$mdToast', 
    function ($scope, recipe, categories, products, $mdToast) {
  $scope.loading = false
  $scope.recipe = recipe
  $scope.error = ''
  $scope.description = $scope.recipe.attributes.description
  $scope.recipeProducts = $scope.recipe.attributes.products
  // need to come back and refactor to perform search realtime on the db
  products.getAll()
  $scope.allProducts = products.products
  $scope.currentShoppingList = []

  const items = localStorage[`userShoppingList-${localStorage.userId}`]
  if(items && items.length > 0) {
    $scope.currentShoppingList = JSON.parse(items)
  }

  // we check if the item is in the shopping list
  $scope.isInShoppingList = function (product) {
    exists = false
    const foundItem = $scope.currentShoppingList.find(item => item.id === product.id.toString())
    if (foundItem) {
      exists = true
    }

    return exists
  }

  // we loop through each product and set selected products
  $scope.recipeProducts.forEach(product => {
    product.selected = $scope.isInShoppingList(product)
  })

  $scope.onUpload = () => {
    $scope.loading = true
    categories.upload($scope.recipe.id, $scope.fileUpload).then(function(response) {
      console.log('Upload Complete: ', response.data.data)
      $scope.recipe = response.data.data
      $scope.fileUpload = undefined
      $scope.loading = false
      $mdToast.show($mdToast.simple().textContent('Cover Image Updated!'))
    })
    .catch(function(ex) {
      console.log('Upload Error: ', ex)
      $scope.loading = false
      $mdToast.show($mdToast.simple().textContent('Error Uploading Cover Image'))
    })
  }

  $scope.selectProduct = function(product) {
    if (product.selected) {
      $scope.addToShoppingList(product)
    } else {
      $scope.removeFromList(product)
    }
  }

  $scope.saveDescription = function(evt) {
    if (!$scope.description) $scope.description = ''
    categories.addDescription($scope.recipe.id, {
      description: $scope.description
    }).then(function(response) {
      $scope.recipe = response.data.data;
      $scope.description = $scope.recipe.attributes.description;
      $mdToast.show($mdToast.simple().textContent('Instructions Updated!'))
    });
  };

  $scope.createProduct = function ($event) {
    if ($event.target.value == '' ) { return; }
    if ($event.key == 'Enter') {
      const product = { name: $event.target.value, categoryId: $scope.recipe.id };
      const validationResponse = validateProductName( product.name );

      if( validationResponse.valid ) {
        products.create(product).then(function(productResponse) {
          toastMessage('Ingredient Added!')
          $scope.recipeProducts.push({ 
            id: productResponse.id, 
            name: productResponse.attributes.name,
            portion: '',
            category: $scope.recipe.id
          });
          $event.target.value = ''
        });
      } else {
        $mdToast.show($mdToast.simple().textContent(validationResponse.error))
      }
    }
  }

  validateProductName = function( input ) {
    const response = {
      error: 'Product Already Exists',
      valid: true
    };

    if(input.length == 0) {
      response.valid = false;
    }

    for(const product of $scope.allProducts) {
      if(input.toLowerCase() == product.attributes.name.toLowerCase()) {
        response.valid = false;
      }
    }

    return response;
  }

  $scope.removeProduct = function( productId ) {
    products.removeRecipeProduct($scope.recipe.id, productId).then(function() {
      toastMessage('Product Removed!')
    })
    $scope.recipeProducts = $scope.recipeProducts.filter( ( product ) => product.id != productId )
  }

  $scope.addToShoppingList = function(product) {
    $scope.currentShoppingList.push(product)
    localStorage.setItem(`userShoppingList-${product.user_id}`, JSON.stringify($scope.currentShoppingList))
  }

  $scope.removeFromList = function(product) {
    $scope.currentShoppingList = $scope.currentShoppingList.filter(object => object.id !== product.id)
    localStorage[`userShoppingList-${localStorage.userId}`] = JSON.stringify($scope.currentShoppingList)
  }

  $scope.searchProducts = function(input) {    
    const found = []
    if(input.length > 2) {
      
      for(const product of $scope.allProducts) { 
        if( product.attributes.name.toLowerCase().includes(input.toLowerCase()) ) {
          found.push(product)
        }
      }
    }
    
    return found;
  }

  // create recipe product from an existing product
  $scope.selectedItemChange = function (item) {
    if(item) {
      const match = $scope.recipeProducts.filter(product => product.name == item.attributes.name);
      
      if(match.length == 0) {
        products.createRecipeProduct(item.id, $scope.recipe.id).then(function(response) {
          product = response.data.data
          $scope.recipeProducts.push({ 
            id: product.id, 
            name: product.attributes.name,
            portion: '',
            category: $scope.recipe.id
          });
          $scope.selectedItem = {};
        });
      }
    }
  }

  // clears upload object
  $scope.clearUpload = function(){
    $scope.fileUpload = undefined
  }

  // function for manually firing click event on the file select input
  $scope.selectFile = function() {
    const inputElem = document.getElementById('upload_input')
    if (inputElem) {
      const evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      inputElem.dispatchEvent(evt);
    }
  }

  $scope.updatePortion = function(product) {
    if (product.portion.length) {
      // update portion
      const requestParams = {productId: product.id, categoryId: $scope.recipe.id, portion: product.portion}
      products.updateRecipeProduct(requestParams).then(function(response) {
        $mdToast.show($mdToast.simple().textContent('Portion Updated!'))
      })
    }
  }

  toastMessage = function(message) {
    $mdToast.show($mdToast.simple().textContent(message).position('center'))
  }

}])

