/// <reference path='../_all.ts' />

module app {
	export interface IAppScope extends ng.IScope {
        scenarios: Scenario[];
        probabilities: Probability[];
        revenueImpacts: RevenueImpact[];
        effectivenessRatings: EffectivenessRating[];
        affectedItems: AffectedItem[];
		tabs: Array<Scenario>;
		location: ng.ILocationService;
		vm: AppController;
	}
}