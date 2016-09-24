angular.module('syncBudget').factory('rootRef', function () {
    return firebase.database().ref();
});
