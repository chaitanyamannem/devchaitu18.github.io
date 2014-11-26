(function(){
var app = angular.module('syncBudget',[]);

	app.run(function($rootScope) {
		var APP_KEY = 'iiz72ijenjkeuw9';
		$rootScope.client = new Dropbox.Client({key: APP_KEY});
		if($rootScope.client.isAuthenticated){
			$rootScope.isClientAuthenticated = true;
		} else {
			$rootScope.isClientAuthenticated = false;
		}
		// Authenticate when the user clicks the connect button.
		$('#connectDropbox').click(function (e) {
			e.preventDefault();
			$rootScope.client.authenticate();
		});

		// Try to finish OAuth authorization.
		$rootScope.client.authenticate({interactive: false}, function (error) {
			if (error) {
				alert('Authentication error: ' + error);
			}

			//console.log("client authenticated");
			var datastoreManager = client.getDatastoreManager();
			datastoreManager.openDefaultDatastore(function (error, datastore) {
				if (error) {
					alert('Error opening default datastore: ' + error);
				}
			 $rootScope.userDatastore = datastore;
			 var testExpensesTable = datastore.getTable('testExpensesTable');
	    	 console.log("testExpensesTable ::::")
	    	 console.log(testExpensesTable);
		});

	});

	app.controller('SyncDropBox', function($scope){
		
		console.log("Rootscope::");
		console.log($scope.client);

		
	
	});


})();