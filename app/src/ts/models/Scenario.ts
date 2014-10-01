module app {

    export class Scenario {

        id: number;
        name: string;
        description: string;
        dateUpdated: Date;
        probability: Probability;
        planCost: number;
        impactCost: number;
        impactLength: number;
        totalImpact: number;
        planEffectiveness: EffectivenessRating;
        scenarioItems: ScenarioItem[] = [];

	}

}
