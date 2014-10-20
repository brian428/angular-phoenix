/// <reference path='../tsd.d.ts' />
/// <reference path="../controllers/AppController.ts" />
/// <reference path="../controllers/ScenarioController.ts" />
/// <reference path="../services/ScenarioService.ts" />

module app {
    'use strict';

    angular.module( "angularPhoenix", [
        'ui.bootstrap',
        'ngRoute',
        'dcbClearInput',
        'myApp.views.view1',
        'myApp.views.view2',
        'myApp.version'
    ] )
    .config( [ '$routeProvider', function( $routeProvider : ng.route.IRouteProvider ) {
        $routeProvider.otherwise( { redirectTo: '/views/view1' } );
    } ] )
    .controller( 'AppController', AppController )
    .controller( 'ScenarioController', ScenarioController )
    .service( 'scenarioService', ScenarioService );;
    //.directive('todoBlur', todoBlur)
    //.directive('todoFocus', todoFocus)
    //.service('todoStorage', TodoStorage);
}