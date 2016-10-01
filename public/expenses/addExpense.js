angular.module('syncBudget').component('addExpense', {
    templateUrl: '/expenses/addExpense.html',
    bindings: {
        expenses: '=',
        categories: '=',
        tags: '='
    },
    controller: function ($filter) {
        console.log("In expense controller");

        var allTags = [];

        for (var i = 0; i < this.tags.length; i++) {
            allTags.push(this.tags[i].name);

        }

        var myTaggle = new Taggle('tags', {
            duplicateTagClass: 'bounce'
        });
        var container = myTaggle.getContainer();
        var input = myTaggle.getInput();

        $(input).autocomplete({
            source: allTags, // See jQuery UI documentaton for options
            appendTo: container,
            position: {
                at: "left bottom",
                of: container
            },
            select: function (event, data) {
                event.preventDefault();
                //Add the tag if user clicks
                if (event.which === 1) {
                    myTaggle.add(data.item.value);
                }
            }


        });


        this.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            this.opened = true;
        };

        this.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        this.today = function () {
            this.dt = new Date();
        };
        this.today();

        this.clear = function () {
            this.dt = null;
        };

        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }

        this.formattedExpenseDate = function () {

            var expenseDate = Number(this.dt.getFullYear() + '' + pad(this.dt.getMonth() + 1) + '' + pad(this.dt.getDate()));
            console.log('expenseDate' + expenseDate);
            console.log(typeof expenseDate);
            return expenseDate;

        };





        this.addExpense = function () {
            console.log("Add expense called");



            var calculatedExpenseAmount = $filter('calculate')(this.expenseAmount);



            // Add expense to expenses table
            this.expenses.$add({
                amount: calculatedExpenseAmount,
                category: this.expenseCategory,
                tags: myTaggle.getTagValues(),
                date: this.formattedExpenseDate()

            });

            // Add new tags to tags table

            var newTags = _.difference(myTaggle.getTagValues(), allTags);

            var insertTags = newTags;
            for (var i = 0; i < insertTags.length; i++) {
                this.tags.$add({
                    name: insertTags[i]
                });
                allTags.push(insertTags[i]);
            }

        };






    }
})
