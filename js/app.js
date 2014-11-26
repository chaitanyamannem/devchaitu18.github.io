(function(){
var app = angular.module('syncBudget',[]);

	app.run(function($rootScope) {
		var APP_KEY = 'iiz72ijenjkeuw9';
		var client = new Dropbox.Client({key: APP_KEY});
		if(client.isAuthenticated()){
			console.log(client.isAuthenticated())
			$rootScope.isClientAuthenticated = true;
			console.log(client.dropboxUid());
			$rootScope.user = client.dropboxUid();
		} else {
			$rootScope.isClientAuthenticated = false;
		}
		

		// Try to finish OAuth authorization.
			client.authenticate({interactive: false}, function (error) {
				if (error) {
					alert('Authentication error: ' + error);
				}

				
			});

			// Authenticate when the user clicks the connect button.
		$('#connectDropbox').click(function (e) {
			e.preventDefault();
			client.authenticate();
		});



		});

	

	app.controller('SyncDropBox', function($scope){
		
		console.log("Rootscope::");
		console.log($scope.client);

		//console.log("client authenticated");
				/*var datastoreManager = $rootScope.client.getDatastoreManager();
				datastoreManager.openDefaultDatastore(function (error, datastore) {
					if (error) {
						alert('Error opening default datastore: ' + error);
					}
				 $rootScope.userDatastore = datastore;
				 var testExpensesTable = datastore.getTable('testExpensesTable');
		    	 console.log("testExpensesTable ::::")
		    	 console.log(testExpensesTable);*/

		
	
	});


})();