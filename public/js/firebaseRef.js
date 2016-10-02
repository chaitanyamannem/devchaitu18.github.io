angular.module('syncBudget').factory('fbRef', function (rootRef, auth) {
    return {
        getPreferencesRef: function () {
            return rootRef.child('preferences').child(auth.$getAuth().uid);
        },
        getCategoriesRef: function () {
            return rootRef.child('categories').child(auth.$getAuth().uid);
        },
        getTagsRef: function () {
            return rootRef.child('tags').child(auth.$getAuth().uid);
        },
        getExpensesRef: function () {
            return rootRef.child('expenses').child(auth.$getAuth().uid);
        },
        getIncomesRef: function () {
            return rootRef.child('incomes').child(auth.$getAuth().uid);
        }
    }
})
