(function(){
var app = angular.module('syncBudget',['ngRoute','ui.bootstrap','ngTouch','ngAnimate']);



	//Routing Configuration

	app.config(function($routeProvider) {


		$routeProvider

		.when('/',{
			templateUrl : 'welcome.html',
			controller : 'welcomeController'
		})

		// route for the categories page
		.when('/addCategories', {
			templateUrl : 'addCategories.html'
		})

		.when('/addExpense', {
			templateUrl : 'addExpense.html',
			controller: 'addExpenseController',
			resolve: {
				app: function($q, $timeout) {
					var defer = $q.defer();
					$timeout(function(){
						defer.resolve();
					},2000);
					return defer.promise;
				}
			}
		})

		.when('/showCategories', {
			templateUrl : 'showCategories.html',
			controller: 'showCategoriesController',
			resolve: {
				app: function($q, $timeout) {
					var defer = $q.defer();
					$timeout(function(){
						defer.resolve();
					},3000);
					return defer.promise;
				}
			}
		})

		.when('/showGraphs', {
			templateUrl : 'showGraphs.html',
			controller: 'showGraphsController',
			resolve: {
				app: function($q, $timeout) {
					var defer = $q.defer();
					$timeout(function(){
						defer.resolve();
					},3000);
					return defer.promise;
				}
			}
		})

			.when('/showGraphsByCategories', {
				templateUrl : 'showGraphsByCategories.html',
				controller: 'showGraphsByCategoriesCtrl',
				resolve: {
					app: function($q, $timeout) {
						var defer = $q.defer();
						$timeout(function(){
							defer.resolve();
						},3000);
						return defer.promise;
					}
				}
			})

			.when('/showGraphsByTags', {
				templateUrl : 'showGraphsByTags.html',
				controller: 'showGraphsByTagsCtrl',
				resolve: {
					app: function($q, $timeout) {
						var defer = $q.defer();
						$timeout(function(){
							defer.resolve();
						},3000);
						return defer.promise;
					}
				}
			})

		.when('/showExpenses', {
			templateUrl : 'showExpenses.html',
			controller: 'showExpensesController',
			resolve: {
				app: function($q, $timeout) {
					var defer = $q.defer();
					$timeout(function(){
						defer.resolve();
					},3000);
					return defer.promise;
				}
			}
		})

		.when('/showExpensesByCategory', {
			templateUrl : 'showExpensesByCategory.html',
			controller: 'showExpensesByCategoryController',
			resolve: {
				app: function($q, $timeout) {
					var defer = $q.defer();
					$timeout(function(){
						defer.resolve();
					},3000);
					return defer.promise;
				}
			}
		})

			.when('/showExpensesByTags', {
				templateUrl : 'showExpensesByTags.html',
				controller: 'showExpensesByTagsController',
				resolve: {
					app: function($q, $timeout) {
						var defer = $q.defer();
						$timeout(function(){
							defer.resolve();
						},3000);
						return defer.promise;
					}
				}
			})

		.when('/contact', {
			templateUrl : 'contact.html'
		})

		//route to sync budget medium collection blog
		.when('/blog', {
			templateUrl : 'blog.html'
		})

		.when('/reset', {
			templateUrl : 'reset.html'
		})

		.when('/home', {
			templateUrl : 'addExpense.html',
			controller: 'addExpenseController',
			resolve: {
				app: function($q, $timeout) {
					var defer = $q.defer();
					$timeout(function(){
						defer.resolve();
					},2000);
					return defer.promise;
				}
			}
		});



	});

	//Custom directive
	app.directive('tree', function(){

		return {
			restrict: "E",
			replace: true,
			scope: {
				tree: '='
			},
			template: "<ul class='list-group'><leaf ng-repeat='leaf in tree' leaf='leaf'></leaf></ul>"
		}


	});

	app.directive('leaf', function($compile){
		return {
			restrict: "E",
			replace: true,
			scope: {
				leaf: '='
			},
			template: "<li class='list-group-item'><i class='fa fa-{{leaf.iconName}}'></i>&nbsp{{leaf.get('name')}}</li>",
			link: function (scope, element, attrs){
				if(angular.isObject(scope.leaf.nodes)){
					element.append("<tree tree='leaf.nodes'></tree>");
					$compile(element.contents())(scope)
				}
			}

		}


	});

	//Dropbox Intialization is done here
	app.run(function($rootScope) {

		var APP_KEY = 'iiz72ijenjkeuw9';
		var client = $rootScope.myClient = new Dropbox.Client({key: APP_KEY});

		$rootScope.isClientAuthenticated = false;

		// Try to finish OAuth authorization.
		client.authenticate({interactive: false}, function (error) {
			if (error) {
				alert('Authentication error: ' + error);
			}

		});



		$rootScope.getUser = function(){
			client.getAccountInfo(function (error, info) {
				$rootScope.user = info.name;
				$rootScope.$apply();
			});
			var datastoreManager = client.getDatastoreManager();
			datastoreManager.openDefaultDatastore(function (error, defaultDatastore) {
				if (error) {
					alert('Error opening default datastore: ' + error);
				}

				// Now you have a datastore. The next few examples can be included here.
				$rootScope.datastore = defaultDatastore;
				$rootScope.$apply();
			});
		};







		if(client.isAuthenticated()){
			console.log("First check client is Authenticated::");
			console.log(client.isAuthenticated());
			$rootScope.isClientAuthenticated = true;

			$rootScope.getUser();



		}

		// Authenticate when the user clicks the connect button.
		$('#connectDropbox').click(function (e) {
			e.preventDefault();
			client.authenticate();
			console.log("Client.autenticate called when connect to dropbox is clicked");
			if(client.isAuthenticated()){
				$rootScope.isClientAuthenticated = true;
				$rootScope.getUser();
			}

		});

		});
		/*----------------------------------------------------------*/
		app.controller('showCategoriesController', function($scope,$log){



			$scope.getCategories = function(){
				console.log("Get Categories called");
				var store = $scope.datastore;
				var categoriesTable = store.getTable('categories');
				$scope.primarycategories = categoriesTable.query({type:'Primary'});
				for(var i = 0; i < $scope.primarycategories.length; i++){
					var primaryCategoryName  = $scope.primarycategories[i].get('name');
					$scope.primarycategories[i].iconName = $scope.primarycategories[i].get('icon');
					$scope.primarycategories[i].nodes = categoriesTable.query({type:'Secondary', primary:primaryCategoryName});
					for(var j = 0; j < $scope.primarycategories[i].nodes.length; j++){
						var secondaryCategoryName  = $scope.primarycategories[i].nodes[j].get('name');
						$scope.primarycategories[i].nodes[j].iconName = $scope.primarycategories[i].nodes[j].get('icon');
						$scope.primarycategories[i].nodes[j].nodes = categoriesTable.query({type:'Tertiary', secondary:secondaryCategoryName});
					}
				}

			};

			$scope.getCategories();



		});
		/*----------------------------------------------------------*/
		app.controller('showExpensesController', function($scope, $modal, $log){
			$scope.buttonsState = {};
			$scope.total = 0;
			$scope.showExpensesBy = "Daily";
			$scope.buttonsState.showDateField = true;
			$scope.buttonsState.showMonthField = true;
			$scope.today = new Date();
			$scope.currentDate = $scope.today.getDate();
			$scope.currentMonth = $scope.today.getMonth();
			$scope.currentYear = $scope.today.getFullYear();
			var store = $scope.datastore;
			var expensesTable = store.getTable('expenses');
			$scope.getDailyExpenses = function(queryDate,queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({date:queryDate,
					month: queryMonth,
					year:queryYear });

			};
			$scope.getMonthlyExpenses = function(queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({month: queryMonth,
					year:queryYear });

			};
			$scope.getYearlyExpenses = function(queryYear) {

				$scope.expenses = expensesTable.query({year:queryYear });

			};
			$scope.getTotal = function(){
				for(var i = 0; i < $scope.expenses.length; i++){
					$scope.total += Number($scope.expenses[i].get('amount'));

				}
			};

			$scope.getExpenses = function(){
				$scope.total = 0;
				if($scope.showExpensesBy === "Daily"){
					$scope.buttonsState.showDateField = true;
					$scope.buttonsState.showMonthField = true;
					$scope.getDailyExpenses(Number($scope.currentDate),Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Monthly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = true;

					$scope.getMonthlyExpenses(Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Yearly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = false;
					$scope.getYearlyExpenses(Number($scope.currentYear));
					$scope.getTotal();

				}

			};

			$scope.getDailyExpenses($scope.currentDate,$scope.currentMonth,$scope.currentYear);
			$scope.getTotal();





			$scope.delete = function(expense){
				expense.deleteRecord();
			};

			$scope.open = function (editExpense) {
				$log.info(editExpense);
				var modalInstance = $modal.open({
					templateUrl: 'editExpenseModal.html',
					controller: 'EditExpenseModalController',
					size: 'lg'
			});
				modalInstance.expenseToEdit = editExpense;
			};

		});

		/*----------------------------------------------------------*/
		app.controller('showExpensesByCategoryController', function($scope, $modal, $log){
			$scope.showCategoryName = "";
			$scope.total = 0;
			$scope.categories = [];
			var allCategories = $scope.datastore.getTable('categories').query();
			for (var i=0; i < allCategories.length; i++) {
				$scope.categories.push(allCategories[i].get('name'));
			}

			$scope.buttonsState = {};

			$scope.showExpensesBy = "Daily";
			$scope.buttonsState.showDateField = true;
			$scope.buttonsState.showMonthField = true;
			$scope.today = new Date();
			$scope.currentDate = $scope.today.getDate();
			$scope.currentMonth = $scope.today.getMonth();
			$scope.currentYear = $scope.today.getFullYear();
			var store = $scope.datastore;
			var expensesTable = store.getTable('expenses');
			$scope.getDailyExpenses = function(queryDate,queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({date:queryDate,
					month: queryMonth,
					year:queryYear,
					category: $scope.showCategoryName});

			};
			$scope.getMonthlyExpenses = function(queryMonth,queryYear) {

				$scope.expenses = expensesTable.query({month: queryMonth,
					year:queryYear,
					category: $scope.showCategoryName});

			};
			$scope.getYearlyExpenses = function(queryYear) {

				$scope.expenses = expensesTable.query({year:queryYear, category: $scope.showCategoryName });

			};
			$scope.getTotal = function(){
				for(var i = 0; i < $scope.expenses.length; i++){
					$scope.total += Number($scope.expenses[i].get('amount'));

				}
			};

			$scope.getExpenses = function(){
				$scope.total = 0;
				if($scope.showExpensesBy === "Daily"){
					$scope.buttonsState.showDateField = true;
					$scope.buttonsState.showMonthField = true;
					$scope.getDailyExpenses(Number($scope.currentDate),Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Monthly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = true;

					$scope.getMonthlyExpenses(Number($scope.currentMonth),Number($scope.currentYear));
					$scope.getTotal();

				}
				else if($scope.showExpensesBy === "Yearly"){
					$scope.buttonsState.showDateField = false;
					$scope.buttonsState.showMonthField = false;
					$scope.getYearlyExpenses(Number($scope.currentYear));
					$scope.getTotal();

				}

			};



			$scope.delete = function(expense){
				expense.deleteRecord();
			}

			$scope.open = function (editExpense) {
				$log.info(editExpense);
				var modalInstance = $modal.open({
					templateUrl: 'editExpenseModal.html',
					controller: 'EditExpenseModalController',
					size: 'lg'
				});
				modalInstance.expenseToEdit = editExpense;
			};

		});

	/*----------------------------------------------------------*/
	app.controller('showExpensesByTagsController', function($scope, $modal, $log){
		$scope.showTagName = "";
		$scope.total = 0;
		$scope.tags = [];
		$scope.tagCloud = [];


		var allTags = $scope.datastore.getTable('tags').query();
		for (var i=0; i < allTags.length; i++) {
			$scope.tags.push(allTags[i].get('name'));
			var tagCloudObject = {};
			tagCloudObject.text = allTags[i].get('name');
			tagCloudObject.weight = 10;
			$scope.tagCloud.push(tagCloudObject);

		}
		$('#tagCloud').jQCloud($scope.tagCloud, {
			width: 500,
			height: 350
		});
		$scope.getExpenses = function(){
			$scope.total = 0;
			var store = $scope.datastore;
			var expensesTable = store.getTable('expenses');
			$scope.expenses = [];
			$scope.AllExpenses = expensesTable.query();
			for (var i=0; i < $scope.AllExpenses.length; i++) {
				if(_.contains($scope.AllExpenses[i].get('tags').toArray(),$scope.showTagName)){
					$scope.total += Number($scope.AllExpenses[i].get('amount'));
					$scope.expenses.push($scope.AllExpenses[i]);
				}

			}

		};

		$scope.getExpenses();

		$scope.delete = function(expense){
			expense.deleteRecord();
		}

		$scope.open = function (editExpense) {
			$log.info(editExpense);
			var modalInstance = $modal.open({
				templateUrl: 'editExpenseModal.html',
				controller: 'EditExpenseModalController',
				size: 'lg'
			});
			modalInstance.expenseToEdit = editExpense;
		};

	});

		/*----------------------------------------------------------*/
		app.controller('EditExpenseModalController', function($scope, $modalInstance){

			$scope.currentExpense = $modalInstance.expenseToEdit;
			$scope.editExpenseAmount = $scope.currentExpense.get('amount');
			$scope.editExpenseCategory = $scope.currentExpense.get('category');
			//Tag Handler
			$scope.thisExpenseTags = $scope.currentExpense.get('tags').toArray();
			$scope.allTags = [];
			var tagsRecords = $scope.datastore.getTable('tags').query();
			for (var i=0; i < tagsRecords.length; i++) {
				$scope.allTags.push(tagsRecords[i].get('name'));
			}
			$("#edit_expense_tag_handler").tagHandler({
				assignedTags: $scope.thisExpenseTags,
				availableTags: $scope.allTags,
				onAdd: function(tag) {$scope.thisExpenseTags.push(tag);$scope.$apply();},
				onDelete: function(tag) {$scope.thisExpenseTags.pop(tag);$scope.$apply();},
				autocomplete: true
			});

			$scope.saveEditExpense = function () {
				if($scope.currentExpense.get('amount') != $scope.editExpenseAmount){
					$scope.currentExpense.set('amount',$scope.editExpenseAmount);
				}
				if($scope.currentExpense.get('category') != $scope.editExpenseCategory){
					$scope.currentExpense.set('category',$scope.editExpenseCategory);
				}
				//Edit Date
				if($scope.currentExpense.get('date') != $scope.dt.getDate()){
					$scope.currentExpense.set('date',$scope.dt.getDate());
				}
				if($scope.currentExpense.get('month') != $scope.dt.getMonth()){
					$scope.currentExpense.set('month',$scope.dt.getMonth());
				}
				if($scope.currentExpense.get('year') != $scope.dt.getFullYear()){
					$scope.currentExpense.set('year',$scope.dt.getFullYear());
				}

				$modalInstance.close();
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};




			//Date picker
			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
			$scope.opened = true;
			};
			$scope.dt = new Date($scope.currentExpense.get('year'),$scope.currentExpense.get('month'),$scope.currentExpense.get('date')).toDateString();
			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};

			$scope.today = function() {
				$scope.dt = new Date().toDateString();
			};


			$scope.clear = function () {
				$scope.dt = null;
			};




		});


		/*----------------------------------------------------------*/
		app.controller('showGraphsController', function($scope){

			$scope.today = new Date();
			$scope.currentDate = $scope.today.getDate();
			$scope.currentMonth = $scope.today.getMonth();
			$scope.currentYear = $scope.today.getFullYear();
			var queryMonth = $scope.currentMonth;
			var queryYear = $scope.currentYear;
			console.log("query month and year");
			console.log(queryMonth);
			console.log(queryYear);
			var expensesForMonth = function(queryMonth,queryYear){

			return $scope.datastore.getTable('expenses').query({month : queryMonth, year : queryYear });
			}
			var expensesForDay = function(queryDate,queryMonth,queryYear){

			return $scope.datastore.getTable('expenses').query({date: queryDate, month : queryMonth, year : queryYear });

			}
			var chartYValues = [];
			var chartXValues = [];
			$scope.total = {};
			var monthlyTotal = 0;
			//Populate
			for(var i=1; i <= 31; i++){
				var amount = 0;
				var dailyExpenses = expensesForDay(i,queryMonth,queryYear);
				for(var j=0; j < dailyExpenses.length; j++){
					amount += Number(dailyExpenses[j].get('amount'));

				}
				chartXValues.push(i);
				chartYValues.push(amount);
				monthlyTotal += amount;
			}
			$scope.total.monthly = monthlyTotal;
			$scope.$apply();

			//Show Chart
			$('#dailyChart').highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: 'Your Expenses Summary'
				},
				xAxis: {
					categories: chartXValues
				},
				yAxis: {
					title: {
						text: 'Amount'
					}
				},
				series: [{
					data: chartYValues
				}]
			});

		});

	/*----------------------------------------------------------*/
	app.controller('showGraphsByCategoriesCtrl', function($scope){

		var queryMonth = 11;
		var queryYear = 2014;
		//Get all Categories
		var allCategories = $scope.datastore.getTable('categories').query();
		var expensesForCategory = function(queryMonth,queryYear,queryCategory){

			return $scope.datastore.getTable('expenses').query({month : queryMonth,
																year : queryYear,
																category: queryCategory
			});
		}

		var chartYValues = [];
		var chartXValues = [];


		//Populate X and Y values
		for(var i=0; i < allCategories.length; i++){
			var amount = 0;
			var categoryExpenses = expensesForCategory(queryMonth,queryYear,allCategories[i].get('name'));
			for(var j=0; j < categoryExpenses.length; j++){
				amount += Number(categoryExpenses[j].get('amount'));

			}
			chartXValues.push(allCategories[i].get('name'));
			chartYValues.push(amount);

		}



		//Show Chart
		$('#categoryChart').highcharts({
			chart: {
				type: 'bar',
				zoomType: 'x'
			},
			title: {
				text: 'Drag on the chart to Zoom'
			},
			xAxis: {
				categories: chartXValues
			},
			yAxis: {
				title: {
					text: 'Amount'
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			series: [{
				data: chartYValues
			}]
		});

	});

	/*----------------------------------------------------------*/
	app.controller('showGraphsByTagsCtrl', function($scope){

		var queryMonth = 11;
		var queryYear = 2014;
		//Get all tags
		var allTags = $scope.datastore.getTable('tags').query();

		var getExpenses = function(queryMonth,queryYear){

			return $scope.datastore.getTable('expenses').query({month : queryMonth,
				year : queryYear
			});
		};

		var chartYValues = [];
		var chartXValues = [];

		var allExpenses = getExpenses(queryMonth,queryYear);
		//Populate X and Y values
		for(var i=0; i < allTags.length; i++){
			var amount = 0;

			for (var k=0; k < allExpenses.length; k++) {
				if(_.contains(allExpenses[k].get('tags').toArray(),allTags[i].get('name'))){
					amount += Number(allExpenses[k].get('amount'));
				}

			}

			chartXValues.push(allTags[i].get('name'));
			chartYValues.push(amount);

		}



		//Show Chart
		$('#tagChart').highcharts({
			chart: {
				type: 'bar',
				zoomType: 'x'
			},
			title: {
				text: 'Drag on the chart to Zoom'
			},
			xAxis: {
				categories: chartXValues
			},
			yAxis: {
				title: {
					text: 'Amount'
				}
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			series: [{
				data: chartYValues
			}]
		});

	});

		/*----------------------------------------------------------*/
		app.controller('addExpenseController', function($scope,$timeout){
			$scope.isExpenseAdded = false;
			$scope.thisExpenseTags = [];
			$scope.allTags = [];
			$scope.categories = [];
			var tagsRecords = $scope.datastore.getTable('tags').query();
			var allCategories = $scope.datastore.getTable('categories').query();
			for (var i=0; i < allCategories.length; i++) {
				$scope.categories.push(allCategories[i].get('name'));
			}
			var getTags = function(){
				for (var i=0; i < tagsRecords.length; i++) {
					$scope.allTags.push(tagsRecords[i].get('name'));
				}
			};
			getTags();
			$("#expense_tag_handler").tagHandler({
				availableTags: $scope.allTags,
				onAdd: function(tag) {$scope.thisExpenseTags.push(tag);$scope.$apply();},
				onDelete: function(tag) {$scope.thisExpenseTags.pop(tag);$scope.$apply();},
				autocomplete: true
			});




			$scope.addExpense = function(){
				console.log("Add expense called");
				var store = $scope.datastore;
				var expensesTable = store.getTable('expenses');
				// Add expense to expenses table
				var newExpenseRecord = expensesTable.insert({
					amount : $scope.expenseAmount,
					category : $scope.expenseCategory,
					date: $scope.dt.getDate(),
					month: $scope.dt.getMonth(),
					year: $scope.dt.getFullYear(),
					tags: $scope.thisExpenseTags

				});
				// Add new tags to tags table
				var tagsTable = store.getTable('tags');
				//Update tags List with latest
				getTags();
				$scope.newTags = _.difference($scope.thisExpenseTags, $scope.allTags);
				var insertTags = $scope.newTags;
				for (var i=0; i < insertTags.length; i++) {
					tagsTable.insert({
					name: insertTags[i]
				});
				}
				$scope.isExpenseAdded = true;
				$timeout(function(){
					$scope.isExpenseAdded = false;
					$scope.$apply();
				},2000);


			};

			$scope.open = function($event) {
				$event.preventDefault();
				$event.stopPropagation();

				$scope.opened = true;
			};

			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1
			};

			$scope.today = function() {
				$scope.dt = new Date().toDateString();
			};
			$scope.today();

			$scope.clear = function () {
				$scope.dt = null;
			};


		});
		/*----------------------------------------------------------*/
		app.controller('welcomeController', function($scope){
			//Required for angular routing even though its empty
		});
		/*----------------------------------------------------------*/
		app.controller('resetController', function($scope) {
			$scope.deleteData = function(){
				$scope.myClient.getDatastoreManager().deleteDatastore($scope.datastore.getId(), function (error) {
					if (error) {
						alert('Sorry please try after sometime error: ' + error);
					} else {
						alert('Success, your data is gone');
					}

				});
			};

		});

		/*----------------------------------------------------------*/
		app.controller('addCategoriesController', function($scope,$timeout) {
			$scope.iconName = "";
			$scope.isCategoryAdded = false;
			$scope.close = function(){
				$scope.iconName = "";
			};
			$scope.categoryType = "Primary";
			$scope.addNewCategory = function(){
				var store = $scope.datastore;
				var categoriesTable = store.getTable('categories');
				var newCategoryRecord = {};
				newCategoryRecord.name = $scope.categoryName;
				newCategoryRecord.icon = $scope.iconName;
				newCategoryRecord.type = $scope.categoryType;
				if($scope.categoryType === 'Secondary'){
					newCategoryRecord.primary = $scope.categoryPrimary;
				}
				if($scope.categoryType === 'Tertiary'){
					newCategoryRecord.secondary = $scope.categorySecondary;
				}
				categoriesTable.insert(newCategoryRecord);
				$scope.isCategoryAdded = true;
				$timeout(function(){
					$scope.isCategoryAdded = false;
					$scope.$apply();
				},2000);
			};

			
		});
		/*----------------------------------------------------------*/
})();
