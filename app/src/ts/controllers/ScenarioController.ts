/// <reference path='../tsd.d.ts' />

module app {

    export class ScenarioController {

        private scope:IScenarioScope;
        private scenarioService:ScenarioService;

        scenario: Scenario;
        isEdit: boolean;
        scenarioReferenceData: ScenarioReferenceData;

        public static $inject = [
            '$scope',
            'scenarioService'
        ];

        constructor( private $scope:IScenarioScope, scenarioService:ScenarioService ) {
            this.scope = $scope;
            this.scenarioService = scenarioService;
            this.scenarioReferenceData = scenarioService.scenarioReferenceData;
        }

        saveScenario() {
            this.isEdit = false;
        }

        editScenario() {
            this.isEdit = true;
        }

	}

}
