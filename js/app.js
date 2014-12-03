(function(){
var app = angular.module('syncBudget',['ngRoute','ui.bootstrap','ngTouch']);

	//Routing Configuration

	app.config(function($routeProvider) {


		$routeProvider

		// route for the categories page
		.when('/categories', {
			templateUrl : 'categories.html'
		})

		.when('/contact', {
			templateUrl : 'contact.html'
		})

		//route to sync budget medium collection blog
		.when('/blog', {
			templateUrl : 'blog.html'
		})

		.when('/home', {
			templateUrl : 'addExpense.html'
		});



	});

	//Dropbox Intialization is done here
	app.run(function($rootScope) {

		var APP_KEY = 'iiz72ijenjkeuw9';
		var client = new Dropbox.Client({key: APP_KEY});

		$rootScope.isClientAuthenticated = false;


		// Try to finish OAuth authorization.
		client.authenticate({interactive: false}, function (error) {
			if (error) {
				alert('Authentication error: ' + error);
			}

		});

		$rootScope.getUser(function(){
			client.getAccountInfo(function (error, info) {

				$rootScope.user = info.name;

			});

		});



		if(client.isAuthenticated()){
			console.log("First check client is Authenticated::");
			console.log(client.isAuthenticated());
			$rootScope.isClientAuthenticated = true;

			$rootScope.getUser();
			$rootScope.$apply();


		}

		// Authenticate when the user clicks the connect button.
		$('#connectDropbox').click(function (e) {
			e.preventDefault();
			client.authenticate();
			console.log("Client.autenticate called when connect to dropbox is clicked");
			if(client.isAuthenticated()){
				$rootScope.isClientAuthenticated = true;
				$rootScope.getUser();
				$rootScope.$apply();

			}

		});



		});


		app.controller('categoryIconCarousel', function($scope) {
			$scope.iconName = "glass";
			$scope.categoryType = 1;

			console.log("Entered categoryIconCarousel");
			//$scope.myInterval = 80000;
			var slides = $scope.slides = ["coffee",
			"credit-card",
			"cut",
			"glass",
			"hospital-o",
			"heart-o",
			"bus",
			"bicycle",
			"bank",
			"book",
			"beer",
			"cab",
			"child",
			"wrench",
			"video-camera",
			"trophy",
			"spoon",
			"shopping-cart",
			"shield",
			"rocket",
			"plane",
			"phone",
			"music",
			"lemon-o",
			"gift",
			"cutlery",
			"cog",
			"briefcase"



			];



		});



	/*app.controller('SyncDropBox', function($scope){

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
		    	 console.log(testExpensesTable);



	});*/




})();
