module app {

	export class ScenarioService {

        private STORAGE_ID = 'phoenix-angularjs-typescript';
        private httpService: ng.IHttpService;
        private promiseService: ng.IQService;

		public static $inject = [
			'$http',
            '$q'
		];

        constructor( $httpService: ng.IHttpService, $q: ng.IQService ) {
            this.httpService = $httpService;
            this.promiseService = $q;
		}

        loadScenarios(): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.promiseService.defer();
            deferred.resolve( JSON.parse( localStorage.getItem( this.STORAGE_ID ) || '[]' ) );
            return deferred.promise;
        }

        saveScenarios( scenarios: Scenario[] ): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.promiseService.defer();
            localStorage.setItem( this.STORAGE_ID, JSON.stringify( scenarios ) );
            deferred.resolve();
            return deferred.promise;
        }

        loadProbabilities(): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.promiseService.defer();
            var _this = this;

            this.httpService.get( "data/probabilities.json" ).then(
                ( result: IDataResult ) => {
                    deferred.resolve( result.data.data );
                }
            );

            return deferred.promise;
        }

        loadRevenueImpacts(): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.promiseService.defer();
            var _this = this;

            this.httpService.get( "data/revenueImpacts.json" ).then(
                ( result: IDataResult ) => {
                    deferred.resolve( result.data.data );
                }
            );

            return deferred.promise;
        }

        loadAffectedItems(): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.promiseService.defer();
            var _this = this;

            this.httpService.get( "data/affectedItems.json" ).then(
                ( result: IDataResult ) => {
                    deferred.resolve( result.data.data );
                }
            );

            return deferred.promise;
        }

        loadEffectivenessRatings(): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.promiseService.defer();
            var _this = this;

            this.httpService.get( "data/effectivenessRatings.json" ).then(
                ( result: IDataResult ) => {
                    deferred.resolve( result.data.data );
                }
            );

            return deferred.promise;
        }

        loadInitialData(): ng.IPromise<any> {
            var deferred: ng.IDeferred<any> = this.promiseService.defer();
            var _this = this;
            var finalResult: InitialDataMap = new InitialDataMap();

            this.promiseService.all([
                this.loadProbabilities(),
                this.loadRevenueImpacts(),
                this.loadAffectedItems(),
                this.loadEffectivenessRatings(),
                this.loadScenarios()
            ]).then(
                ( result: Object[] ) => {
                    finalResult.probabilities = <Probability[]>result[ 0 ];
                    finalResult.revenueImpacts = <RevenueImpact[]>result[ 1 ];
                    finalResult.affectedItems = <AffectedItem[]>result[ 2 ];
                    finalResult.effectivenessRatings = <EffectivenessRating[]>result[ 3 ];
                    finalResult.scenarios = <Scenario[]>result[ 4 ];
                    deferred.resolve( finalResult );
                }
            );

            return deferred.promise;
        }

	}

}
