'use strict';

function PmtProductList($scope, $http) {
  $http.get('file.json').success(function(data) {
    $scope.products = data.products;
    $scope.min_products = data.min_qty;
  });

  $scope.cart = [];
  $scope.attributes = [];
  $scope.units = 0;
  $scope.dollars = 0.00;
  $scope.configuration = [];
  
  $scope.validCheckout = function() {
    if ($scope.units >= $scope.min_products) {
      return true;
    }
    return false;
  }
  
  $scope.addCart = function(nid, quantity, title, price) {
    var attr = [];
    angular.copy($scope.attributes, attr);
    $scope.units = $scope.units + quantity;
    $scope.cart.push({'price': price, 'title': title, 'nid':nid, 'quantity': quantity, 'attributes': attr });
    $scope.dollars = $scope.totalCart();
    $scope.attributes.length = 0;
  }
  
  $scope.totalCart = function() {
    var cartitems = [];
    angular.copy($scope.cart, cartitems);
    var length = cartitems.length;
    var dollars = 0;
    
    for (var i = 0; i < length; i++) {
      var price = cartitems[i].price;
      var quantity = cartitems[i].quantity;
      var addons = 0;
      var attribute_length = cartitems[i].attributes.length;
      for (var j = 0; j < attribute_length; j++) {
        if (typeof(cartitems[i].attributes[j].price) != null) {
          addons = parseFloat(addons) + parseFloat(cartitems[i].attributes[j].price);
        }
      }
      dollars = parseFloat(dollars) + parseFloat((quantity * (price + addons)));
    }
    return dollars.toFixed(2);
  }
  
  $scope.removeItem = function(index, quantity, price) {
    $scope.units = $scope.units - quantity;
    $scope.cart.splice(index, 1);
    $scope.dollars = $scope.totalCart();
  }

/*
  $scope.recalc = function(select_model) {
    
  }
*/
}