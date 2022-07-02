
(function (window, document) { // IIFE
    'use strict';


    function render_tree(table, arr) {
        var i = 0,
            len = arr.length;

        console.log("populating " + table.id);
        for (i = 0; i < len; i += 1) {
            console.log(arr[i]);
        }
    }

    function init() {
        var tree = document.getElementById('idTree');
        var emps = [
            {empId: 1, name: "mike", age: 39, bossId: 3},
            {empId: 2, name: "kodjo", age: 45, bossId: 3},
            {empId: 3, name: "lignda", age: 46, bossId: null}
        ];
        render_tree(tree, emps);
    }

    window.onload = function() {
        // use onload to wait for page to fully load before executing javascript
        init();
    };


}(window, document));