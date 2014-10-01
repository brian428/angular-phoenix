/// <reference path='../_all.ts' />

module app {

    export class AppController {

        private scope:IAppScope;
        private scenarioService:ScenarioService;

        public static $inject = [
            '$scope',
            'scenarioService',
            '$location'
        ];

        constructor( $scope:IAppScope, scenarioService:ScenarioService, $location:ng.ILocationService ) {
            this.scope = $scope;
            this.scope.vm = this;
            this.scope.tabs = [];
            this.scenarioService = scenarioService;
            this.loadInitialData();
        }

        loadInitialData() {
            var me = this;
            this.scenarioService.loadInitialData().then(
                ( data:InitialDataMap ) => {
                    me.scope.scenarios = data.scenarios;
                    me.scope.affectedItems = data.affectedItems;
                    me.scope.probabilities = data.probabilities;
                    me.scope.revenueImpacts = data.revenueImpacts;
                    me.scope.effectivenessRatings = data.effectivenessRatings;
                }
            );
        }

        removeTab( index:number ) {
            this.scope.tabs.splice( index, 1 );
        }

        scenarioDetail( scenario:Scenario ) {
            var value:any = {
                title: scenario.name,
                scenario: scenario,
                active: true
            };
            this.scope.tabs.push( value );
        }

        newScenario() {
            var value:any = {
                title: "New Scenario",
                scenario: new Scenario(),
                active: true
            };
            value.scenario.name = "New Scenario"
            this.scope.tabs.push( value );
        }

        addTestScenario() {
            var testScenario:Scenario = new Scenario();
            testScenario.id = this.scope.scenarios.length + 1;
            testScenario.name = "Test Scenario " + testScenario.id;
            testScenario.description = "Test scenario " + testScenario.id + " description.";
            testScenario.dateUpdated = new Date();
            testScenario.probability = this.scope.probabilities[ this.getRandomInt( 0, this.scope.probabilities.length-1 ) ];
            testScenario.impactCost = this.getRandomInt( 100, 1000 );
            testScenario.impactLength = this.getRandomInt( 5, 20 );
            testScenario.planEffectiveness = this.scope.effectivenessRatings[ this.getRandomInt( 0, this.scope.effectivenessRatings.length-1 ) ];
            testScenario.totalImpact = this.getRandomInt( 500, 10000 );

            var item:ScenarioItem = new ScenarioItem();
            item.id = this.createUUID();
            item.itemDescription = "Scenario Item " + item.id;
            item.cost = this.getRandomInt( 100, 500 );
            item.timeToRecover = this.getRandomInt( 5, 20 );
            item.impactSeverity = this.scope.revenueImpacts[ this.getRandomInt( 0, this.scope.revenueImpacts.length-1 ) ];
            item.affectedItem = this.scope.affectedItems[ this.getRandomInt( 0, this.scope.affectedItems.length-1 ) ];

            testScenario.scenarioItems.push( item );
            this.scope.scenarios.push( testScenario )
            this.scenarioService.saveScenarios( this.scope.scenarios );
        }

        getRandomInt( min, max ):number {
            return Math.floor( Math.random() * (max - min + 1) ) + min;
        }

        createUUID():string {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for( var i = 0; i < 36; i++ ) {
                s[ i ] = hexDigits.substr( Math.floor( Math.random() * 0x10 ), 1 );
            }
            s[ 14 ] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[ 19 ] = hexDigits.substr( (s[ 19 ] & 0x3) | 0x8, 1 );  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[ 8 ] = s[ 13 ] = s[ 18 ] = s[ 23 ] = "-";

            var uuid = s.join( "" );
            return uuid;
        }

    }

}
