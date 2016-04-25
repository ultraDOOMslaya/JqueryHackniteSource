$(document).ready(function () {
    ko.applyBindings(new reportQueueViewModel());
});

function reportQueueViewModel() {
    var self = this;
    self.reports = ko.observableArray([]);

    $.ajax({
        type: 'GET',
        url: 'reports'
    }).success(function (reports, status){
        var mappedReports = $.map(reports, function(item){
           return new Report(item); 
        });
        self.reports(mappedReports);
    });
}

function Report(data) {
    var self = this;
    
    self.requestDate = ko.observable(new Date(data.requestDate));
    self.reportStatus = ko.observable(data.status);
    self.reportType = ko.observable(data.reportType);
    self.prescriptionSearchCriteria = ko.observable(new PrescriptionSearchCriteria(data.psc));
    self.relatedReportURI = ko.observable(data.relatedReportURI);
    
    self.requestDateDisplay = ko.computed(function () {
        var year = self.requestDate().getFullYear().toString();
        var month = (self.requestDate().getMonth() + 1).toString();
        var day = self.requestDate().getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.retrieveReport = function () {
    	window.open("/report/" + data.persistedFileKey, 'Report View');
    	return false;
    };
}

function PrescriptionSearchCriteria(data){
    var self = this;
    self.pscId = ko.observable(data.pscId);
    self.dispenseStart = ko.observable(new Date(data.startDate));
    self.dispenseEnd = ko.observable(new Date(data.endDate));
    self.patientFirstName = ko.observable(data.firstName);
    self.patientLastName = ko.observable(data.lastName);
    self.patientDOB = ko.observable(new Date(data.dateOfBirthDt));
    
    self.dispenseStartDateDisplay = ko.computed(function () {
        var year = self.dispenseStart().getFullYear().toString();
        var month = (self.dispenseStart().getMonth() + 1).toString();
        var day = self.dispenseStart().getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.dispenseEndDateDisplay = ko.computed(function () {
        var year = self.dispenseEnd().getFullYear().toString();
        var month = (self.dispenseEnd().getMonth() + 1).toString();
        var day = self.dispenseEnd().getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.patientDOBDisplay = ko.computed(function () {
        var year = self.patientDOB().getFullYear().toString();
        var month = (self.patientDOB().getMonth() + 1).toString();
        var day = self.patientDOB().getDate().toString();
        return month + '/' + day + '/' + year;
    });
}

