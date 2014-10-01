/// <reference path='../tsd.d.ts' />

module app {
	export interface IAppScope extends ng.IScope {
        scenarios: Scenario[];
        tabs: Array<Scenario>;
        scenarioReferenceData: ScenarioReferenceData;
	}
}