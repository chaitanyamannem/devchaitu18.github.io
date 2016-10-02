angular.module('syncBudget').component('login', {
    templateUrl: '/security/login.html',
    bindings: {
        currentAuth: '='
    },
    controller: function (auth, $location) {
        
        this.loggedIn = !!this.currentAuth;
        
        this.googleLogin = function () {
            auth.$signInWithPopup("google").then(function () {
                $location.path('/home');
            }).catch((function (err) {
                this.errorMessage = err.code;
            }).bind(this))
        }
    }
})
