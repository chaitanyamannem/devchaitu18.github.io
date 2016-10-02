angular.module('syncBudget').component('editUserPref', {
    templateUrl: '/userPreferences/editUserPref.html',
    bindings: {
        userPreferences: '='
    },
    controller: function (fbRef, $firebaseObject, $location) {
        this.currencyTypes = [
            "Indian Rupee",
            "Dollar"
        ]


        this.save = function () {
            this.userPreferences.$save();
            $location.path('/home');
        }

        this.cancel = function () {
            $location.path('/home');
        }
    }


})
