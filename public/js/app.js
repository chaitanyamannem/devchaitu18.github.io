var app = angular.module('syncBudget', ['ngRoute', 'firebase']);

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
