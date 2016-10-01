var app = angular.module('syncBudget', ['ngRoute', 'ui.bootstrap', 'firebase', 'ngMessages']);

app.run(function ($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function (e, next, prev, err) {
        if (err === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    })
})


app.config(function ($routeProvider) {
    $routeProvider
        .when('/home', {
            template: '<home></home>',
            resolve: {
                currentAuth: function (auth) {
                    return auth.$requireSignIn();
                }
            }
        })
        .when('/userPref', {
            template: '<edit-user-pref user-preferences="$resolve.userPreferences"></edit-user-pref>',
            resolve: {
                userPreferences: function (fbRef, $firebaseObject, auth) {
                    return auth.$requireSignIn().then(function () {
                        return $firebaseObject(fbRef.getPreferencesRef()).$loaded();
                    })
                }
            }
        })
        .when('/categories', {
            template: '<categories categories="$resolve.categories"></categories>',
            resolve: {
                categories: function (fbRef, $firebaseArray, auth) {
                    return auth.$requireSignIn().then(function () {
                        return $firebaseArray(fbRef.getCategoriesRef()).$loaded();
                    })
                }
            }
        })
        .when('/addExpense', {
            template: '<add-expense tags="$resolve.tags"  categories="$resolve.categories" expenses="$resolve.expenses"></add-expense>',
            resolve: {
                expenses: function (fbRef, $firebaseArray, auth) {
                    return auth.$requireSignIn().then(function () {
                        return $firebaseArray(fbRef.getExpensesRef()).$loaded();
                    })
                },
                categories: function (fbRef, $firebaseArray, auth) {
                    return auth.$requireSignIn().then(function () {
                        return $firebaseArray(fbRef.getCategoriesRef()).$loaded();
                    })
                },
                tags: function (fbRef, $firebaseArray, auth) {
                    return auth.$requireSignIn().then(function () {
                        return $firebaseArray(fbRef.getTagsRef()).$loaded();
                    })
                }
            }


        })
        .when('/showExpenses', {
            template: '<show-expenses></show-expenses>',
            resolve: {
                currentAuth: function (auth) {
                    return auth.$requireSignIn();
                }
            }
        })
        .when('/login', {
            template: '<login current-auth="$resolve.currentAuth"></login>',
            resolve: {
                currentAuth: function (auth) {
                    return auth.$waitForSignIn();
                }
            }
        })
        .when('/logout', {
            template: '<logout></logout>'
        })
        .otherwise('/home')

})


app.filter('calculate', function () {

    //TODO regular expression for numeric expression validation

    return function (numericExpression) {

        if (numericExpression == undefined || numericExpression.endsWith('+') || numericExpression.endsWith('-') || numericExpression.endsWith('/') || numericExpression.endsWith('*') || numericExpression.endsWith('%')) {
            return numericExpression;
        } else {
            return math.eval(numericExpression);

        }
    }

})
