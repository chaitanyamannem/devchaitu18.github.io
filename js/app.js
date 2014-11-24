(function(){
var app = angular.module('syncBudget',[]);
var datastore = {};

app.controller('SyncDropBox', function(){

	var isClientAuthenticated = false;
	var  = 'iiz72ijenjkeuw9'
	var client = new Dropbox.Client({key: APP_KEY});
	//console.log(client);

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
		isClientAuthenticated = true;
		//console.log("client authenticated");
		var datastoreManager = client.getDatastoreManager();
		datastoreManager.openDefaultDatastore(function (error, userDatastore) {
			if (error) {
				alert('Error opening default datastore: ' + error);
			}
		datastore = userDatastore;
	   
	});

	} 


});

app.controller('AddExpense', function(){

	// Now you have a datastore. The next few examples can be included here.
	    var testExpensesTable = datastore.getTable('testExpensesTable');
	    console.log(testExpensesTable);

});



})();