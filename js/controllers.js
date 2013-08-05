'use strict';

function PmtProductList($scope, $http) {
  $http.get('file.json').success(function(data) {
    $scope.products = data;
  });

  $scope.cart = [];
  
  $scope.addCart = function(nid,quantity) {
    $scope.cart.push({'nid':nid, 'quantity':quantity})
  }
}