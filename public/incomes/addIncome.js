angular.module('syncBudget').component('addIncome', {
    templateUrl: '/incomes/addIncome.html',
    bindings: {
        incomes: '=',
        categories: '=',
        tags: '='
    },
    controller: function ($filter) {
        console.log("In Income controller");

        var allTags = [];

        for (var i = 0; i < this.tags.length; i++) {
            allTags.push(this.tags[i].name);

        }

        var myTaggle = new Taggle('incomeTags', {
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

        this.formattedIncomeDate = function () {

            var incomeDate = Number(this.dt.getFullYear() + '' + pad(this.dt.getMonth() + 1) + '' + pad(this.dt.getDate()));
            console.log('incomeDate' + incomeDate);
            console.log(typeof incomeDate);
            return incomeDate;

        };




        //TODO : add notes only if it has value
        this.addIncome = function () {
            console.log("Add Income called");
            var calculatedIncomeAmount = $filter('calculate')(this.incomeAmount);
            var incomeObject = {
                amount: calculatedIncomeAmount,
                category: this.incomeCategory,
                tags: myTaggle.getTagValues(),
                date: this.formattedIncomeDate()
            };

            if (this.incomeNotes) {
                incomeObject.notes = this.incomeNotes;
            }

            // Add income to incomes table
            this.incomes.$add(incomeObject);

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
