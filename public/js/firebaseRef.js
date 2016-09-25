angular.module('syncBudget').factory('fbRef', function (rootRef, auth) {
    return {
        getPreferencesRef: function () {
            return rootRef.child('preferences').child(auth.$getAuth().uid);
        },
        getCategoriesRef: function () {
            return rootRef.child('categories').child(auth.$getAuth().uid);
        }
    }
})
