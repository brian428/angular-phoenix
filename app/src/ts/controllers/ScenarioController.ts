/// <reference path='../tsd.d.ts' />

module app {

    export class ScenarioController {

        private scope:IScenarioScope;
        private scenarioService:ScenarioService;

        public static $inject = [
            '$scope',
            'scenarioService'
        ];

        constructor( private $scope:IScenarioScope, scenarioService:ScenarioService ) {
            this.scope = $scope;
            this.scope.vm = this;
            this.scenarioService = scenarioService;
        }

        saveScenario() {
            this.scope.isEdit = false;
        }

        editScenario() {
            this.scope.isEdit = true;
        }

	}

}
