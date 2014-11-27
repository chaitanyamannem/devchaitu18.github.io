(function(){
var app = angular.module('syncBudget',[]);

	app.run(function($rootScope) {
		
		var APP_KEY = 'iiz72ijenjkeuw9';
		var client = new Dropbox.Client({key: APP_KEY});
		
		$rootScope.isClientAuthenticated = false;
		$rootScope.user = "Guest";	
		
		// Try to finish OAuth authorization.
		client.authenticate({interactive: false}, function (error) {
			if (error) {
				alert('Authentication error: ' + error);
			}
		
		});

		if(client.isAuthenticated()){
			console.log("First check client is Authenticated::");
			console.log(client.isAuthenticated());
			$rootScope.isClientAuthenticated = true;
			client.getAccountInfo(function (error, info) {
				console.log(info.name);
				$rootScope.user = info.name;
			});
			
			
		}

		// Authenticate when the user clicks the connect button.
		$('#connectDropbox').click(function (e) {
			e.preventDefault();
			client.authenticate();
			console.log("Client.autenticate called when connect to dropbox is clicked");
			if(client.isAuthenticated()){
				$rootScope.isClientAuthenticated = true;
				client.getAccountInfo(function (error, info) {
					$rootScope.user = info.name;
				});
			}
			
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