angular.module('syncBudget').component('showExpenses', {
    templateUrl: '/showExpenses/showExpenses.html',
    controller: function (fbRef, $firebaseArray) {

        var data = {
            isDataLoaded: false,
            total: 0,
            expenses: []
        };

        // This helper object helps to solve binding issues
        this.helper = data;
        this.buttonsState = {};
        this.showExpensesBy = "Daily";
        this.buttonsState.showDateField = true;
        this.buttonsState.showMonthField = true;
        this.today = new Date();
        this.currentDay = this.today.getDate();
        this.currentMonth = this.today.getMonth() + 1;
        this.currentYear = this.today.getFullYear();

        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        function formattedExpenseDate(queryDay, queryMonth, queryYear) {
            var expenseDate = Number(queryYear + '' + pad(queryMonth) + '' + pad(queryDay));
            return expenseDate;

        };

        function getTotal() {
            console.log(data.expenses.length);
            data.total = 0;
            for (var i = 0; i < data.expenses.length; i++) {
                data.total += data.expenses[i].amount;
            }
        };

        this.getDailyExpenses = function (queryDay, queryMonth, queryYear) {

            var query = fbRef.getExpensesRef().orderByChild("date").equalTo(formattedExpenseDate(queryDay, queryMonth, queryYear));

            var expensesList = $firebaseArray(query);

            expensesList.$loaded().then(function () {
                data.expenses = expensesList;
                getTotal();
                data.isDataLoaded = true;

            })

        };

        this.getMonthlyExpenses = function (queryMonth, queryYear) {

            var startAt = formattedExpenseDate(01, queryMonth, queryYear);
            var endAt = formattedExpenseDate(31, queryMonth, queryYear);

            var query = fbRef.getExpensesRef().orderByChild("date").startAt(startAt).endAt(endAt);

            var expensesList = $firebaseArray(query);

            expensesList.$loaded().then(function () {
                data.expenses = expensesList;
                getTotal();
                data.isDataLoaded = true;

            })

        };

        this.getYearlyExpenses = function (queryYear) {

            var startAt = formattedExpenseDate(01, 01, queryYear);
            var endAt = formattedExpenseDate(31, 12, queryYear);

            var query = fbRef.getExpensesRef().orderByChild("date").startAt(startAt).endAt(endAt);

            var expensesList = $firebaseArray(query);

            expensesList.$loaded().then(function () {
                data.expenses = expensesList;

                getTotal();
                data.isDataLoaded = true;

            })

        };

        this.getDailyExpenses(this.currentDay, this.currentMonth, this.currentYear);


        this.getExpenses = function () {
            data.isDataLoaded = false;
            this.total = 0;
            if (this.showExpensesBy === "Daily") {
                this.buttonsState.showDateField = true;
                this.buttonsState.showMonthField = true;
                this.getDailyExpenses(Number(this.currentDay), Number(this.currentMonth), Number(this.currentYear));


            } else if (this.showExpensesBy === "Monthly") {
                this.buttonsState.showDateField = false;
                this.buttonsState.showMonthField = true;

                this.getMonthlyExpenses(Number(this.currentMonth), Number(this.currentYear));


            } else if (this.showExpensesBy === "Yearly") {
                this.buttonsState.showDateField = false;
                this.buttonsState.showMonthField = false;
                this.getYearlyExpenses(Number(this.currentYear));


            }

        };

    }
})
