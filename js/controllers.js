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
    var addons = 0;
    angular.copy($scope.attributes, attr);
    $scope.units = $scope.units + quantity;
    var attribute_length = attr.length;
    for (var j = 0; j < attribute_length; j++) {
      if (typeof(attr[j]) != 'undefined') {
        addons = parseFloat(addons) + parseFloat(attr[j].price);
      }
    }
    $scope.cart.push({'adjusted_price': (parseFloat(price) + parseFloat(addons)), 'price': price, 'title': title, 'nid':nid, 'quantity': quantity, 'attributes': attr });
    $scope.dollars = $scope.totalCart();
    $scope.attributes.length = 0;
  }
  
  $scope.totalCart = function() {
    var cartitems = [];
    angular.copy($scope.cart, cartitems);
    var length = cartitems.length;
    var dollars = 0;
    
    for (var i = 0; i < length; i++) {
      var adjusted_price = cartitems[i].adjusted_price;
      var quantity = cartitems[i].quantity;
      dollars = parseFloat(dollars) + parseFloat(quantity * adjusted_price);
    }
    return dollars.toFixed(2);
  }
  
  $scope.removeItem = function(index, quantity) {
    $scope.units = $scope.units - quantity;
    $scope.cart.splice(index, 1);
    $scope.dollars = $scope.totalCart();
  }

  $scope.proceedCheckout = function() {
    var cartitems = [];
    angular.copy($scope.cart, cartitems);
    var total_items = cartitems.length;
    var url = '';
    var query = '';
    
    for (var i = 0; i < total_items; i++) {
      url = url + 'p' + cartitems[i].nid + '_q' + cartitems[i].quantity + '_';
      var total_attributes = cartitems[i].attributes.length;
      for (var j = 0; j < total_attributes; j++) {
        if ((parseInt(cartitems[i].attributes[j].aid) == 1) && (parseInt(cartitems[i].attributes[j].oid) == 2) && (query.length == 0)) {
          query = '?product_nid=' + cartitems[i].nid + '&qty=' + cartitems[i].quantity;
          for (var k =0; k < total_attributes; k++) {
            if (k == 0) {
              query += '&attr=';
            }
            query += cartitems[i].attributes[k].aid + '-' + cartitems[i].attributes[k].oid;
            if (k < (total_attributes -1)) {
              query += '_';
            }
          }
        }
        url = url + 'a' + cartitems[i].attributes[j].aid + 'o' + cartitems[i].attributes[j].oid;
        if (j < (total_attributes -1)) {
          url = url + '_';
        }
      }
      if (i < (total_items - 1)) {
        url = url + '-';
      }
    }
    //console.log('http://dev.perfectmeasuringtape.com/cart/add/' + url + '?destination=node/add/order-custom' + encodeURIComponent(query));
    window.location = 'http://dev.perfectmeasuringtape.com/cart/add/' + url + '?destination=node/add/order-custom' + encodeURIComponent(query);
  }
}