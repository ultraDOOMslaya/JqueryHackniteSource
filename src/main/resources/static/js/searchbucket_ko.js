var ViewModel = function() {
    this.users = ko.observableArray([
       { name: ko.observable('bmaakestad'), role: ko.observable('LAW') },
       { name: ko.observable('egranse'), role: ko.observable('SUPER') },
       { name: ko.observable('scollins'), role: ko.observable('EXTERNAL') }
    ]);

    this.getTemplate = function(rustbucket) {
        return rustbucket.role() + "Tmpl";
    }
}

ko.applyBindings(new ViewModel());






