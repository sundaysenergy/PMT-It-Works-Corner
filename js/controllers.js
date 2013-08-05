'use strict';

function PmtProductList($scope, $http) {
  $http.get('file.json').success(function(data) {
    $scope.products = data;
  });

  $scope.cart = [];
  $scope.attributes = [];
  
  $scope.addCart = function(nid, quantity) {
    var attr = [];
    angular.copy($scope.attributes, attr);
    $scope.cart.push({'nid':nid, 'quantity': quantity, 'attributes': attr });
    $scope.attributes.length = 0;
  }
  
}