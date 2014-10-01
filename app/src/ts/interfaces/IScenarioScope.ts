/// <reference path='../tsd.d.ts' />

module app {

	export interface IScenarioScope extends ng.IScope {
        scenario: Scenario;
        isEdit: boolean;
        scenarioReferenceData: ScenarioReferenceData;
	}

}