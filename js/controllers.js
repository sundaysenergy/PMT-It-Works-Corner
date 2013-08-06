'use strict';

function PmtProductList($scope, $http) {
  $http.get('file.json').success(function(data) {
    $scope.products = data;
  });

  $scope.cart = [];
  $scope.attributes = [];
  $scope.units = 0;
  $scope.dollars = 0.00;
  
  $scope.addCart = function(nid, quantity, title, price) {
    var attr = [];
    angular.copy($scope.attributes, attr);
    $scope.units = $scope.units + quantity;
    $scope.dollars = (parseFloat($scope.dollars) + parseFloat((quantity * price))).toFixed(2); 
    $scope.cart.push({'price': price, 'title': title, 'nid':nid, 'quantity': quantity, 'attributes': attr });
    $scope.attributes.length = 0;
  }
  
  $scope.removeItem = function(index, quantity, price) {
    $scope.dollars = (parseFloat($scope.dollars) - parseFloat(quantity * price)).toFixed(2);
    $scope.units = $scope.units - quantity;
    $scope.cart.splice(index, 1);
  }
}