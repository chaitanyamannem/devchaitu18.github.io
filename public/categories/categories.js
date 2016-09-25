angular.module('syncBudget').component('categories', {
    templateUrl: '/categories/categories.html',
    bindings: {
        categories: '='
    },
    controller: function () {

        this.addNewCategory = function () {
            this.categories.$add({
                name: this.newCategoryName
            });
            this.newCategoryName = '';
            console.log("categorye saved");
        }

    }
})
