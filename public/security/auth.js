angular.module('syncBudget').factory('auth', function ($firebaseAuth, rootRef) {
    return $firebaseAuth();
})
