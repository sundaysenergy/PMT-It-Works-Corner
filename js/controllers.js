'use strict';

/* Controllers */

function PmtProductList($scope, $http) {
  $http.get('file.json').success(function(data) {
    $scope.products = data;
  });

  /* $scope.orderProp = 'age'; */
}