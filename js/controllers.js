'use strict';

angular.module('Pmt', []).
filter('escapestring', function() {
    return function(input) {
      return input.replace("'", "\\\'");
    }
});

function PmtProductList($scope, $http) {
  $http.get('/service/it-works/json').success(function(data) {
    $scope.products = data.products;
    $scope.min_products = data.min_qty;
    $scope.site_url = data.url;
    $scope.min_dollars = data.min_dollars;
  });

  $scope.cart = [];
  $scope.attributes = [];
  $scope.units = 0;
  $scope.dollars = 0.00;
  $scope.configuration = [];  
  $scope.expanded = [];
  $scope.contains_custom = false;

/*
  $scope.hideOption = function(oid) {
    if (oid == 2) {
      return true;
    }
    return false;
  }
  $scope.hideSelect = function(aid) {
    if (aid == 1) {
      return true;
    }
    return false;
  }
*/

  $scope.itemExpand = function(index) {
    var length = $scope.expanded.length;
    for (var i = 0; i < length; i++) {
      if (index != i) {
        $scope.expanded[i] = false;
      }
    }
    if ($scope.expanded[index] == false) {
      $scope.expanded[index] = true;
    } else {
      $scope.expanded[index] = false;
    }
    return true;
  }

  $scope.validCheckout = function() {
    if ((true == $scope.contains_custom && $scope.units >= $scope.min_products) || 
        (false == $scope.contains_custom && $scope.min_dollars <= $scope.dollars)) {
      return true;
    }
    return false;
  }
  
  $scope.addCart = function(nid, quantity, title, price) {
    if ((quantity / 10) != parseInt(quantity / 10) || (parseInt(quantity) < 1)) {
      return false;
    };
    var attr = [];
    var addons = 0;
    var length = $scope.attributes.length;
    
    for (var i = 0; i < length; i++) {
      if (typeof($scope.attributes[i]) == 'undefined') {
        $scope.attributes.splice(i, 1);
      }
    }
/*
    if ($scope.attributes.length == 0) {
      var attribute_length = product.attributes.length;
      for (var k = 0; k < attribute_length; k++) {
        if (parseInt(product.attributes[k].aid) == 1) {
          length = product.attributes[k].options.length;
          for (var i = 0; i < length; i++) {
            if (parseInt(product.attributes[k].options[i].oid) == '2') {
              $scope.attributes[0] = product.attributes[k].options[i];
            }
          }
        }
      }
    } else {
      if (typeof($scope.attributes[0]) == 'undefined') {
        length = product.attributes[0].options.length;
        for (var i = 0; i < length; i++) {
          if (parseInt(product.attributes[0].options[i].oid) == '2') {
            $scope.attributes[0] = product.attributes[0].options[i];
          }
        }
      } else {
        length = product.attributes[1].options.length;
        for (var i = 0; i < length; i++) {
          if (parseInt(product.attributes[1].options[i].oid) == '2') {
            $scope.attributes[1] = product.attributes[1].options[i];
          }
        }
      }
    }
*/
    angular.copy($scope.attributes, attr);
    $scope.units = $scope.units + quantity;
    var attribute_length = attr.length;
    var is_custom = false;
    for (var j = 0; j < attribute_length; j++) {
      if (typeof(attr[j]) != 'undefined') {
        addons = parseFloat(addons) + parseFloat(attr[j].price);
        if ((parseInt(attr[j].aid) == 1) && (parseInt(attr[j].oid) == 2)) {
          is_custom = true;
        }
      }
    }
    $scope.cart.push({'adjusted_price': (parseFloat(price) + parseFloat(addons)), 'price': price, 'title': title, 'nid':nid, 'quantity': quantity, 'attributes': attr, 'custom': is_custom });
    $scope.dollars = $scope.totalCart();
    $scope.attributes.length = 0;

    alertify.log("Your item has been added to the cart");
  }
  
  $scope.multipleOften = function(quantity ) {
    if (parseInt(quantity) == 0) {
      return false;
    }
    if (typeof(quantity) == 'undefined') {
      return true;
    }
    if ((quantity / 10) == parseInt(quantity / 10)) {
      return true;
    }
    return false;
  }
  
  $scope.totalCart = function() {
    var cartitems = [];
    angular.copy($scope.cart, cartitems);
    var length = cartitems.length;
    var dollars = 0;
    $scope.contains_custom = false;
    
    for (var i = 0; i < length; i++) {
      var adjusted_price = cartitems[i].adjusted_price;
      var quantity = cartitems[i].quantity;
      if (cartitems[i].custom) {
        $scope.contains_custom = true;
      }
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
    if (url.match(/.*a1o2.*/g)) {
      window.top.location.href = $scope.site_url + 'cart/add/' + url + '?destination=node/add/order-custom' + encodeURIComponent(query);
      //console.log($scope.site_url + 'cart/add/' + url + '?destination=node/add/order-custom' + encodeURIComponent(query));
    } else {
      window.top.location.href = $scope.site_url + 'cart/add/' + url + '?destination=cart';
      //console.log($scope.site_url + 'cart/add/' + url);
    } 
  }
}
