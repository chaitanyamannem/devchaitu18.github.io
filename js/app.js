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
			templateUrl : 'showCategories.html'
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

		.when('/showExpenses', {
			templateUrl : 'showExpenses.html',
			controller: 'showExpensesController',
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
		app.controller('showCategoriesController', function($scope){



			$scope.getCategories = function(){
				console.log("Get Categories called");
				var store = $scope.datastore;
				console.log(store);
				var categoriesTable = store.getTable('categories');
				$scope.categories = categoriesTable.query();
				console.log($scope.categories);
			};

			$scope.getCategories();



		});
		/*----------------------------------------------------------*/
		app.controller('showExpensesController', function($scope, $modal, $log){

			$scope.getExpenses = function(){
				console.log("Get Expenses called");
				var store = $scope.datastore;
				var expensesTable = store.getTable('expenses');
				$scope.expenses = expensesTable.query();



			};

			$scope.getExpenses();

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

			var queryMonth = 11;
			var queryYear = 2014;
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
			for (var i=0; i < tagsRecords.length; i++) {
				$scope.allTags.push(tagsRecords[i].get('name'));
			}
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
					category : $scope.expenseCategory.get('name'),
					date: $scope.dt.getDate(),
					month: $scope.dt.getMonth(),
					year: $scope.dt.getFullYear(),
					tags: $scope.thisExpenseTags

				});
				// Add new tags to tags table
				var tagsTable = store.getTable('tags');
				$scope.newTags = _.difference($scope.thisExpenseTags, $scope.allTags);
				console.log("New Tags");
				console.log($scope.newTags);
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
		app.controller('addCategoriesController', function($scope) {
			$scope.iconName = "";
			$scope.close = function(){
				$scope.iconName = "";
			};
			$scope.categoryType = "Primary";
			$scope.addNewCategory = function(){
				var store = $scope.datastore;
				var categoriesTable = store.getTable('categories');

				var newCategoryRecord = categoriesTable.insert({
					name : $scope.categoryName,
					icon : $scope.iconName,
					type : $scope.categoryType

				});

			};

			$scope.icons = ["adjust",
			"adn",
			"align-center",
			"align-justify",
			"align-left",
			"align-right",
			"ambulance",
			"anchor",
			"android",
			"angellist",
			"angle-double-down",
			"angle-double-left",
			"angle-double-right",
			"angle-double-up",
			"angle-down",
			"angle-left",
			"angle-right",
			"angle-up",
			"apple",
			"archive",
			"area-chart",
			"arrow-circle-down",
			"arrow-circle-left",
			"arrow-circle-o-down",
			"arrow-circle-o-left",
			"arrow-circle-o-right",
			"arrow-circle-o-up",
			"arrow-circle-right",
			"arrow-circle-up",
			"arrow-down",
			"arrow-left",
			"arrow-right",
			"arrow-up",
			"arrows",
			"arrows-alt",
			"arrows-h",
			"arrows-v",
			"asterisk",
			"at",
			"automobile",
			"backward",
			"ban",
			"bank",
			"bar-chart",
			"bar-chart-o",
			"barcode",
			"bars",
			"beer",
			"behance",
			"behance-square",
			"bell",
			"bell-o",
			"bell-slash",
			"bell-slash-o",
			"bicycle",
			"binoculars",
			"birthday-cake",
			"bitbucket",
			"bitbucket-square",
			"bitcoin",
			"bold",
			"bolt",
			"bomb",
			"book",
			"bookmark",
			"bookmark-o",
			"briefcase",
			"btc",
			"bug",
			"building",
			"building-o",
			"bullhorn",
			"bullseye",
			"bus",
			"cab",
			"calculator",
			"calendar",
			"calendar-o",
			"camera",
			"camera-retro",
			"car",
			"caret-down",
			"caret-left",
			"caret-right",
			"caret-square-o-down",
			"caret-square-o-left",
			"caret-square-o-right",
			"caret-square-o-up",
			"caret-up",
			"cc",
			"cc-amex",
			"cc-discover",
			"cc-mastercard",
			"cc-paypal",
			"cc-stripe",
			"cc-visa",
			"certificate",
			"chain",
			"chain-broken",
			"check",
			"check-circle",
			"check-circle-o",
			"check-square",
			"check-square-o",
			"chevron-circle-down",
			"chevron-circle-left",
			"chevron-circle-right",
			"chevron-circle-up",
			"chevron-down",
			"chevron-left",
			"chevron-right",
			"chevron-up",
			"child",
			"circle",
			"circle-o",
			"circle-o-notch",
			"circle-thin",
			"clipboard",
			"clock-o",
			"close",
			"cloud",
			"cloud-download",
			"cloud-upload",
			"cny",
			"code",
			"code-fork",
			"codepen",
			"coffee",
			"cog",
			"cogs",
			"columns",
			"comment",
			"comment-o",
			"comments",
			"comments-o",
			"compass",
			"compress",
			"copy",
			"copyright",
			"credit-card",
			"crop",
			"crosshairs",
			"css3",
			"cube",
			"cubes",
			"cut",
			"cutlery",
			"dashboard",
			"database",
			"dedent",
			"delicious",
			"desktop",
			"deviantart",
			"digg",
			"dollar",
			"dot-circle-o",
			"download",
			"dribbble",
			"dropbox",
			"drupal",
			"edit",
			"eject",
			"ellipsis-h",
			"ellipsis-v",
			"empire",
			"envelope",
			"envelope-o",
			"envelope-square",
			"eraser",
			"eur",
			"euro",
			"exchange",
			"exclamation",
			"exclamation-circle",
			"exclamation-triangle",
			"expand",
			"external-link",
			"external-link-square",
			"eye",
			"eye-slash",
			"eyedropper",
			"facebook",
			"facebook-square",
			"fast-backward",
			"fast-forward",
			"fax",
			"female",
			"fighter-jet",
			"file",
			"file-archive-o",
			"file-audio-o",
			"file-code-o",
			"file-excel-o",
			"file-image-o",
			"file-movie-o",
			"file-o",
			"file-pdf-o",
			"file-photo-o",
			"file-picture-o",
			"file-powerpoint-o",
			"file-sound-o",
			"file-text",
			"file-text-o",
			"file-video-o",
			"file-word-o",
			"file-zip-o",
			"files-o",
			"film",
			"filter",
			"fire",
			"fire-extinguisher",
			"flag",
			"flag-checkered",
			"flag-o",
			"flash",
			"flask",
			"flickr",
			"floppy-o",
			"folder",
			"folder-o",
			"folder-open",
			"folder-open-o",
			"font",
			"forward",
			"foursquare",
			"frown-o",
			"futbol-o",
			"gamepad",
			"gavel",
			"gbp",
			"ge",
			"gear",
			"gears",
			"gift",
			"git",
			"git-square",
			"github",
			"github-alt",
			"github-square",
			"gittip",
			"glass",
			"globe",
			"google",
			"google-plus",
			"google-plus-square",
			"google-wallet",
			"graduation-cap",
			"group",
			"h-square",
			"hacker-news",
			"hand-o-down",
			"hand-o-left",
			"hand-o-right",
			"hand-o-up",
			"hdd-o",
			"header",
			"headphones",
			"heart",
			"heart-o",
			"history",
			"home",
			"hospital-o",
			"html5",
			"ils",
			"image",
			"inbox",
			"indent",
			"info",
			"info-circle",
			"inr",
			"instagram",
			"institution",
			"ioxhost",
			"italic",
			"joomla",
			"jpy",
			"jsfiddle",
			"key",
			"keyboard-o",
			"krw",
			"language",
			"laptop",
			"lastfm",
			"lastfm-square",
			"leaf",
			"legal",
			"lemon-o",
			"level-down",
			"level-up",
			"life-bouy",
			"life-buoy",
			"life-ring",
			"life-saver",
			"lightbulb-o",
			"line-chart",
			"link",
			"linkedin",
			"linkedin-square",
			"linux",
			"list",
			"list-alt",
			"list-ol",
			"list-ul",
			"location-arrow",
			"lock",
			"long-arrow-down",
			"long-arrow-left",
			"long-arrow-right",
			"long-arrow-up",
			"magic",
			"magnet",
			"mail-forward",
			"mail-reply",
			"mail-reply-all",
			"male",
			"map-marker",
			"maxcdn",
			"meanpath",
			"medkit",
			"meh-o",
			"microphone",
			"microphone-slash",
			"minus",
			"minus-circle",
			"minus-square",
			"minus-square-o",
			"mobile",
			"mobile-phone",
			"money",
			"moon-o",
			"mortar-board",
			"music",
			"navicon",
			"newspaper-o",
			"openid",
			"outdent",
			"pagelines",
			"paint-brush",
			"paper-plane",
			"paper-plane-o",
			"paperclip",
			"paragraph",
			"paste",
			"pause",
			"paw",
			"paypal",
			"pencil",
			"pencil-square",
			"pencil-square-o",
			"phone",
			"phone-square",
			"photo",
			"picture-o",
			"pie-chart",
			"pied-piper",
			"pied-piper-alt",
			"pinterest",
			"pinterest-square",
			"plane",
			"play",
			"play-circle",
			"play-circle-o",
			"plug",
			"plus",
			"plus-circle",
			"plus-square",
			"plus-square-o",
			"power-off",
			"print",
			"puzzle-piece",
			"qq",
			"qrcode",
			"question",
			"question-circle",
			"quote-left",
			"quote-right",
			"ra",
			"random",
			"rebel",
			"recycle",
			"reddit",
			"reddit-square",
			"refresh",
			"remove",
			"renren",
			"reorder",
			"repeat",
			"reply",
			"reply-all",
			"retweet",
			"rmb",
			"road",
			"rocket",
			"rotate-left",
			"rotate-right",
			"rouble",
			"rss",
			"rss-square",
			"rub",
			"ruble",
			"rupee",
			"save",
			"scissors",
			"search",
			"search-minus",
			"search-plus",
			"send",
			"send-o",
			"share",
			"share-alt",
			"share-alt-square",
			"share-square",
			"share-square-o",
			"shekel",
			"sheqel",
			"shield",
			"shopping-cart",
			"sign-in",
			"sign-out",
			"signal",
			"sitemap",
			"skype",
			"slack",
			"sliders",
			"slideshare",
			"smile-o",
			"soccer-ball-o",
			"sort",
			"sort-alpha-asc",
			"sort-alpha-desc",
			"sort-amount-asc",
			"sort-amount-desc",
			"sort-asc",
			"sort-desc",
			"sort-down",
			"sort-numeric-asc",
			"sort-numeric-desc",
			"sort-up",
			"soundcloud",
			"space-shuttle",
			"spinner",
			"spoon",
			"spotify",
			"square",
			"square-o",
			"stack-exchange",
			"stack-overflow",
			"star",
			"star-half",
			"star-half-empty",
			"star-half-full",
			"star-half-o",
			"star-o",
			"steam",
			"steam-square",
			"step-backward",
			"step-forward",
			"stethoscope",
			"stop",
			"strikethrough",
			"stumbleupon",
			"stumbleupon-circle",
			"subscript",
			"suitcase",
			"sun-o",
			"superscript",
			"support",
			"table",
			"tablet",
			"tachometer",
			"tag",
			"tags",
			"tasks",
			"taxi",
			"tencent-weibo",
			"terminal",
			"text-height",
			"text-width",
			"th",
			"th-large",
			"th-list",
			"thumb-tack",
			"thumbs-down",
			"thumbs-o-down",
			"thumbs-o-up",
			"thumbs-up",
			"ticket",
			"times",
			"times-circle",
			"times-circle-o",
			"tint",
			"toggle-down",
			"toggle-left",
			"toggle-off",
			"toggle-on",
			"toggle-right",
			"toggle-up",
			"trash",
			"trash-o",
			"tree",
			"trello",
			"trophy",
			"truck",
			"try",
			"tty",
			"tumblr",
			"tumblr-square",
			"turkish-lira",
			"twitch",
			"twitter",
			"twitter-square",
			"umbrella",
			"underline",
			"undo",
			"university",
			"unlink",
			"unlock",
			"unlock-alt",
			"unsorted",
			"upload",
			"usd",
			"user",
			"user-md",
			"users",
			"video-camera",
			"vimeo-square",
			"vine",
			"vk",
			"volume-down",
			"volume-off",
			"volume-up",
			"warning",
			"wechat",
			"weibo",
			"weixin",
			"wheelchair",
			"wifi",
			"windows",
			"won",
			"wordpress",
			"wrench",
			"xing",
			"xing-square",
			"yahoo",
			"yelp",
			"yen",
			"youtube",
			"youtube-play",
			"youtube-square"
			];
		});
		/*----------------------------------------------------------*/
})();
