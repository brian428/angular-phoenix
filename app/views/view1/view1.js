'use strict';

angular.module('myApp.views.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/views/view1', {
    templateUrl: 'views/view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}]);