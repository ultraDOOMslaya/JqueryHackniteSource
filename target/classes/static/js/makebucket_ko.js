ko.components.register('like-widget', {
    viewModel: function(params) {
        // Data: value is either null, 'like', or 'dislike'
        this.chosenValue = params.value;

        // Behaviors
        this.like = function() { this.chosenValue('like'); }.bind(this);
        this.dislike = function() { this.chosenValue('dislike'); }.bind(this);
    },
    template:
        '<div class="like-or-dislike" data-bind="visible: !chosenValue()">\
            <button data-bind="click: like">Like it</button>\
            <button data-bind="click: dislike">Dislike it</button>\
        </div>\
        <div class="result" data-bind="visible: chosenValue">\
            You <strong data-bind="text: chosenValue"></strong> it\
        </div>'
});

function RustBucket() {
    var self = this;
    self.name = ko.observable().extend( {minLength: 5} );
    self.modelnumber = ko.observable();
    self.component = ko.observable();
    self.maker = ko.observable();
    self.userRating = ko.observable(null);

}


function makeBucketViewModel() {
    this.rustbuckets = ko.observableArray();
    //this.makers = ko.observableArray(["Hasbro, AtlanticOcean, Orks"]);



}

makeBucketViewModel.prototype.addRustBucket = function() {
    this.rustbuckets.push(new RustBucket());
};



ko.applyBindings(new makeBucketViewModel());






