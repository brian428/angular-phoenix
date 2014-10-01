/// <reference path="" />

module app {
	export interface IScenarioScope extends ng.IScope {
        vm: ScenarioController;
        scenario: Scenario;
        isEdit: boolean;

        probabilities: Probability[];
        revenueImpacts: RevenueImpact[];
        effectivenessRatings: EffectivenessRating[];
        affectedItems: AffectedItem[];

	}
}