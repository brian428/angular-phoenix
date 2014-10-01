/// <reference path='../ts_definitions/libs/angularjs/angular.d.ts' />
/// <reference path='../ts_definitions/libs/angularjs/angular-animate.d.ts' />
/// <reference path='../ts_definitions/libs/angularjs/angular-mocks.d.ts' />
/// <reference path='../ts_definitions/libs/angularjs/angular-route.d.ts' />
/// <reference path='../ts_definitions/libs/angular-ui-bootstrap/angular-ui-bootstrap.d.ts' />
/// <reference path='../ts_definitions/libs/ng-grid/ng-grid.d.ts' />


/// <reference path='../tsd.d.ts' />
var app;
(function (app) {
    var AppController = (function () {
        function AppController($scope, scenarioService, $location) {
            this.scope = $scope;
            this.tabs = [];
            this.scenarioService = scenarioService;
            this.loadInitialData();
        }
        AppController.prototype.loadInitialData = function () {
            var me = this;
            this.scenarioService.loadInitialData().then(function (data) {
                me.scenarios = data.scenarios;
                me.scenarioReferenceData = data.scenarioReferenceData;
            });
        };

        AppController.prototype.removeTab = function (index) {
            this.tabs.splice(index, 1);
        };

        AppController.prototype.scenarioDetail = function (scenario) {
            var value = {
                title: scenario.name,
                scenario: scenario,
                active: true
            };
            this.tabs.push(value);
        };

        AppController.prototype.newScenario = function () {
            var value = {
                title: "New Scenario",
                scenario: new app.Scenario(),
                active: true
            };
            value.scenario.name = "New Scenario";
            this.tabs.push(value);
        };

        AppController.prototype.addTestScenario = function () {
            var refData = this.scenarioReferenceData;
            var testScenario = new app.Scenario();
            testScenario.id = this.scope.scenarios.length + 1;
            testScenario.name = "Test Scenario " + testScenario.id;
            testScenario.description = "Test scenario " + testScenario.id + " description.";
            testScenario.dateUpdated = new Date();
            testScenario.probability = refData.probabilities[this.getRandomInt(0, refData.probabilities.length - 1)];
            testScenario.impactCost = this.getRandomInt(100, 1000);
            testScenario.impactLength = this.getRandomInt(5, 20);
            testScenario.planEffectiveness = refData.effectivenessRatings[this.getRandomInt(0, refData.effectivenessRatings.length - 1)];
            testScenario.totalImpact = this.getRandomInt(500, 10000);

            var item = new app.ScenarioItem();
            item.id = this.createUUID();
            item.itemDescription = "Scenario Item " + item.id;
            item.cost = this.getRandomInt(100, 500);
            item.timeToRecover = this.getRandomInt(5, 20);
            item.impactSeverity = refData.revenueImpacts[this.getRandomInt(0, refData.revenueImpacts.length - 1)];
            item.affectedItem = refData.affectedItems[this.getRandomInt(0, refData.affectedItems.length - 1)];

            testScenario.scenarioItems.push(item);
            this.scenarios.push(testScenario);
            this.scenarioService.saveScenarios(this.scenarios);
        };

        AppController.prototype.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        AppController.prototype.createUUID = function () {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        };
        AppController.$inject = [
            '$scope',
            'scenarioService',
            '$location'
        ];
        return AppController;
    })();
    app.AppController = AppController;
})(app || (app = {}));


/// <reference path='../tsd.d.ts' />
var app;
(function (app) {
    var ScenarioController = (function () {
        function ScenarioController($scope, scenarioService) {
            this.$scope = $scope;
            this.scope = $scope;
            this.scenarioService = scenarioService;
            this.scenarioReferenceData = scenarioService.scenarioReferenceData;
        }
        ScenarioController.prototype.saveScenario = function () {
            this.isEdit = false;
        };

        ScenarioController.prototype.editScenario = function () {
            this.isEdit = true;
        };
        ScenarioController.$inject = [
            '$scope',
            'scenarioService'
        ];
        return ScenarioController;
    })();
    app.ScenarioController = ScenarioController;
})(app || (app = {}));


var app;
(function (app) {
    var ScenarioService = (function () {
        function ScenarioService($httpService, $q) {
            this.STORAGE_ID = 'phoenix-angularjs-typescript';
            this.httpService = $httpService;
            this.promiseService = $q;
        }
        ScenarioService.prototype.loadScenarios = function () {
            var deferred = this.promiseService.defer();
            deferred.resolve(JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]'));
            return deferred.promise;
        };

        ScenarioService.prototype.saveScenarios = function (scenarios) {
            var deferred = this.promiseService.defer();
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(scenarios));
            deferred.resolve();
            return deferred.promise;
        };

        ScenarioService.prototype.loadProbabilities = function () {
            var deferred = this.promiseService.defer();
            var _this = this;

            this.httpService.get("data/probabilities.json").then(function (result) {
                deferred.resolve(result.data.data);
            });

            return deferred.promise;
        };

        ScenarioService.prototype.loadRevenueImpacts = function () {
            var deferred = this.promiseService.defer();
            var _this = this;

            this.httpService.get("data/revenueImpacts.json").then(function (result) {
                deferred.resolve(result.data.data);
            });

            return deferred.promise;
        };

        ScenarioService.prototype.loadAffectedItems = function () {
            var deferred = this.promiseService.defer();
            var _this = this;

            this.httpService.get("data/affectedItems.json").then(function (result) {
                deferred.resolve(result.data.data);
            });

            return deferred.promise;
        };

        ScenarioService.prototype.loadEffectivenessRatings = function () {
            var deferred = this.promiseService.defer();
            var _this = this;

            this.httpService.get("data/effectivenessRatings.json").then(function (result) {
                deferred.resolve(result.data.data);
            });

            return deferred.promise;
        };

        ScenarioService.prototype.loadInitialData = function () {
            var deferred = this.promiseService.defer();
            var me = this;
            var finalResult = new app.InitialDataMap();
            me.scenarioReferenceData = new app.ScenarioReferenceData();

            this.promiseService.all([
                this.loadProbabilities(),
                this.loadRevenueImpacts(),
                this.loadAffectedItems(),
                this.loadEffectivenessRatings(),
                this.loadScenarios()
            ]).then(function (result) {
                me.scenarioReferenceData.probabilities = result[0];
                me.scenarioReferenceData.revenueImpacts = result[1];
                me.scenarioReferenceData.affectedItems = result[2];
                me.scenarioReferenceData.effectivenessRatings = result[3];
                finalResult.scenarios = result[4];
                finalResult.scenarioReferenceData = me.scenarioReferenceData;
                deferred.resolve(finalResult);
            });

            return deferred.promise;
        };
        ScenarioService.$inject = [
            '$http',
            '$q'
        ];
        return ScenarioService;
    })();
    app.ScenarioService = ScenarioService;
})(app || (app = {}));


/// <reference path='../_all.ts' />
/// <reference path="../controllers/AppController.ts" />
/// <reference path="../controllers/ScenarioController.ts" />
/// <reference path="../services/ScenarioService.ts" />
var app;
(function (app) {
    'use strict';

    angular.module("angularPhoenix", [
        'ui.bootstrap',
        'ngRoute',
        'dcbClearInput',
        'myApp.views.view1',
        'myApp.views.view2',
        'myApp.version'
    ]).config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({ redirectTo: '/views/view1' });
        }]).controller('AppController', app.AppController).controller('ScenarioController', app.ScenarioController).service('scenarioService', app.ScenarioService);
    ;
})(app || (app = {}));


/// <reference path='../tsd.d.ts' />


/// <reference path='../tsd.d.ts' />


/// <reference path='../tsd.d.ts' />


var app;
(function (app) {
    var AffectedItem = (function () {
        function AffectedItem() {
        }
        return AffectedItem;
    })();
    app.AffectedItem = AffectedItem;
})(app || (app = {}));


var app;
(function (app) {
    var EffectivenessRating = (function () {
        function EffectivenessRating() {
        }
        return EffectivenessRating;
    })();
    app.EffectivenessRating = EffectivenessRating;
})(app || (app = {}));


var app;
(function (app) {
    var InitialDataMap = (function () {
        function InitialDataMap() {
        }
        return InitialDataMap;
    })();
    app.InitialDataMap = InitialDataMap;
})(app || (app = {}));


var app;
(function (app) {
    var Probability = (function () {
        function Probability() {
        }
        return Probability;
    })();
    app.Probability = Probability;
})(app || (app = {}));


var app;
(function (app) {
    var RevenueImpact = (function () {
        function RevenueImpact() {
        }
        return RevenueImpact;
    })();
    app.RevenueImpact = RevenueImpact;
})(app || (app = {}));


var app;
(function (app) {
    var Scenario = (function () {
        function Scenario() {
            this.scenarioItems = [];
        }
        return Scenario;
    })();
    app.Scenario = Scenario;
})(app || (app = {}));


var app;
(function (app) {
    var ScenarioItem = (function () {
        function ScenarioItem() {
        }
        return ScenarioItem;
    })();
    app.ScenarioItem = ScenarioItem;
})(app || (app = {}));


/// <reference path='../controllers/MainController.ts' />


/// <reference path='../../../_all.ts' />
/// <reference path='../interfaces/IMainScope' />
var main;
(function (main) {
    'use strict';

    /**
    * The main controller for the app. The controller:
    * - retrieves and persists the model via the todoStorage service
    * - exposes the model to the template and provides event handlers
    */
    var MainController = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function MainController($scope, $location) {
            this.$scope = $scope;
            this.$location = $location;
        }
        MainController.$inject = [
            '$scope',
            '$location'
        ];
        return MainController;
    })();
    main.MainController = MainController;
})(main || (main = {}));


var app;
(function (app) {
    var ScenarioReferenceData = (function () {
        function ScenarioReferenceData() {
        }
        return ScenarioReferenceData;
    })();
    app.ScenarioReferenceData = ScenarioReferenceData;
})(app || (app = {}));



//# sourceMappingURL=angular-phoenix-all.js.map