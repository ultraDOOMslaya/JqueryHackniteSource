//TODO make the table then add the remove function
//TODO add the total count function
//TODO Add the select list functionality
$(document).ready(function() {
    var model = new rustBucketViewModel();

    ko.applyBindingsWithValidation(model);
});



function RustBucket(data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.modelnumber = ko.observable(data.modelnumber);
    self.component = ko.observable(data.component);
    self.maker = ko.observable(data.maker);

}

function rustBucketViewModel() {
    var self = this;
    self.rustBuckets = ko.observableArray([]);
    self.selectedMaker = ko.observable();
    self.origRustBuckets = ko.observableArray([]);

    $.ajax({
        type: "GET",
        url: "/rustbuckets",
    }).success(function ( data, status ) {
        var mappedRustBuckets = $.map(data, function (item) {
            return new RustBucket(item);
        });
        self.rustBuckets(mappedRustBuckets);
        self.origRustBuckets(mappedRustBuckets);
    });

    self.countRB = ko.computed( function() {
        return self.rustBuckets().length;
    });

    self.justMakers = ko.computed(function() {
        var justMakers = ko.utils.arrayMap(self.origRustBuckets(), function(item) {
            return item.maker();
        });
        justMakers.push("All");
        return justMakers;
    });

    self.uniqueMakers = ko.dependentObservable(function() {
        return ko.utils.arrayGetDistinctValues(self.justMakers()).sort();
    });

    self.Submit = function() {

    }

    self.removeRB = function(item) {
        self.rustBuckets.remove(item);
    }

    self.selectChange = function(maker) {
        var filteredBuckets = ko.utils.arrayFilter(self.origRustBuckets(), function(item) {
            return (item.maker() === self.selectedMaker());
        });
        self.rustBuckets(filteredBuckets);
    }
}





//TODO seperate the rust buckets into two lists