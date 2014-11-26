(function(){
var app = angular.module('syncBudget',[]);

	app.controller('SyncDropBox', function($scope){
		
		$scope.num = 100;
		$scope.isClientAuthenticated = false;
		console.log($scope.isClientAuthenticated);
		
		var APP_KEY = 'iiz72ijenjkeuw9';
		var client = new Dropbox.Client({key: APP_KEY});
		console.log(client);

		// Authenticate when the user clicks the connect button.
		$('#connectDropbox').click(function (e) {
			e.preventDefault();
			client.authenticate();
		});

		// Try to finish OAuth authorization.
		client.authenticate({interactive: false}, function (error) {
			if (error) {
				alert('Authentication error: ' + error);
			}
		});

		if (client.isAuthenticated()) {
			$scope.isClientAuthenticated = true;
			//console.log("client authenticated");
			var datastoreManager = client.getDatastoreManager();
			datastoreManager.openDefaultDatastore(function (error, datastore) {
				if (error) {
					alert('Error opening default datastore: ' + error);
				}
			 $scope.userDatastore = datastore;
		   
		});

		} 

		console.log($scope.isClientAuthenticated);
		if($scope.isClientAuthenticated){
		// Now you have a datastore. The next few examples can be included here.
	    var testExpensesTable = datastore.getTable('testExpensesTable');
	    console.log("testExpensesTable ::::")
	    console.log(testExpensesTable);
		}


	});


})();