$(document).ready(function () {

    $('#patient-results-table tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
    });

    $('#prescription-results-table tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
    });

    $("#prescription-results-table tr:odd").addClass("odd");
    $("#prescription-results-table tr:not(.odd)").hide();
    $("#prescription-results-table tr:first-child").show();

    $('#prescription-results-table tbody').on('click', 'tr', function () {
        var class_attr = $(this).attr('class');
        if (class_attr === 'odd' || class_attr === 'odd selected') {
            $(this).next("tr").toggle();
            $(this).find(".arrow").toggleClass("up");
        }
    });

    var model = new patSearchViewModel();

    model.validateDateOfBirth.extend({ notify: 'always' });

    ko.applyBindingsWithValidation(model);

}); // End of document.ready

// Necessary for allowing customization for knockout validation.
ko.validation.init({
    insertMessages: true,
    decorateInputElement: true,
    messagesOnModified: true,
    errorElementClass: 'err',
    errorMessageClass: 'help-block'
}, true);



// Model for patient results from AJAX /patients
function Patient(data) {
    var self = this;
    self.isCheck = ko.observable();
    self.memberId = ko.observable(data.patientMasterKey);

    self.firstName = ko.observable(data.firstName);
    self.lastName = ko.observable(data.lastName);
    self.dateOfBirth = ko.observable(new Date(data.dateOfBirthKey.dateValue));
    self.county = ko.observable(data.patientAddressKey.county);
    self.addressOne = ko.observable(data.patientAddressKey.addressLineOne);
    self.addressTwo = ko.observable(data.patientAddressKey.addressLineTwo);
    self.city = ko.observable(data.patientAddressKey.city);
    self.state = ko.observable(data.patientAddressKey.stateOrProvinceCode);
    self.zip = ko.observable(data.patientAddressKey.zipCode);

    self.dateOfBirthDisplay = ko.computed(function () {
        var year = self.dateOfBirth().getFullYear().toString();
        var month = (self.dateOfBirth().getMonth() + 1).toString();
        var day = self.dateOfBirth().getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.isSelected = function () {
        self.isCheck(true);
    };
}

// Model for prescription results from AJAX /prescriptions/view
function Prescription(data) {
    var self = this;
    // Reduced view
    self.dateDispensed = ko.observable(new Date(data.dateFilledKey.dateValue));
    self.drugName = ko.observable(data.fdaProductKey.proprietaryProductName);

    self.NDC = ko.observable(data.fdaProductKey.ndcNormalizedCode);
    self.quantityDispensed = ko.observable(data.quantityDispensed);
    self.daysSupply = ko.observable(data.daysSupply);
    self.rxNumber = ko.observable(data.prescriptionNumber);
    self.prescriber = ko.observable(data.prescriberMasterKey.firstName + " " + data.prescriberMasterKey.lastName);
    self.dispenser = ko.observable(data.pharmacyMasterKey.dispensingPrescriberName);
    self.recipient = ko.observable(data.patientMasterKey.firstName + " " + data.patientMasterKey.lastName);
    self.paymentMethod = ko.observable(data.paymentTypeDesc);
    self.medDaily = ko.observable(data.medDaily + " mg");

    // Additional fields for expanded view
    self.datePrescribed = ko.observable(new Date(data.dateWrittenKey.dateValue));
    self.refillsAuthorized = ko.observable(data.refillsAuthorized);
    self.prescriberCityState = ko.observable(data.prescriberMasterKey.prescriberAddressKey.city + ", " + data.prescriberMasterKey.prescriberAddressKey.stateOrProvinceCode);
    self.prescriberDeaNumber = ko.observable(data.prescriberMasterKey.deaNumber);
    self.dispenserCityState = ko.observable(data.pharmacyMasterKey.pharmacyAddressKey.city + ", " + data.pharmacyMasterKey.pharmacyAddressKey.stateOrProvinceCode);
    self.dispenserDeaNumber = ko.observable(data.pharmacyMasterKey.deaNumber);
    self.recipientDateOfBirth = ko.observable(new Date(data.patientMasterKey.dateOfBirthKey.dateValue));
    self.recipientAddress = ko.observable(data.patientMasterKey.patientAddressKey.addressLineOne);
    self.recipientCityStateZip = ko.observable(data.patientMasterKey.patientAddressKey.city + ", " + data.patientMasterKey.patientAddressKey.stateOrProvinceCode + ", " + data.patientMasterKey.patientAddressKey.zipCode);
    self.plusIcon = ko.observable(true);
    self.minusIcon = ko.observable(false);

    //Responsible for toggling plus or minus on prescription search
    self.toggleVisibility = function() {
        self.plusIcon(!self.plusIcon());
        self.minusIcon(!self.minusIcon());
    };

    // views for dates
    self.dateDispensedDisplay = ko.computed(function () {
        var year = self.dateDispensed().getFullYear().toString();
        var month = (self.dateDispensed().getMonth() + 1).toString();
        var day = self.dateDispensed().getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.datePrescribedDisplay = ko.computed(function () {
        var year = self.datePrescribed().getFullYear().toString();
        var month = (self.datePrescribed().getMonth() + 1).toString();
        var day = self.datePrescribed().getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.recipientDateOfBirthDisplay = ko.computed(function () {
        var year = self.recipientDateOfBirth().getFullYear().toString();
        var month = (self.recipientDateOfBirth().getMonth() + 1).toString();
        var day = self.recipientDateOfBirth().getDate().toString();
        return month + '/' + day + '/' + year;
    });

}


// Configures the Jquery datepicker to work with Knockout
ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);

        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).datepicker("getDate"));
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).datepicker("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var current = $(element).datepicker("getDate");

        if (value - current !== 0) {
            $(element).datepicker("setDate", value);
        }
    }
};

ko.validation.registerExtenders();
ko.validation.makeBindingHandlerValidatable('datepicker');

// Knockout view model for patsearch.html
// TODO clear the model of existing values for the SEARCH values, i.e. self.firstName = '', self.lastName='', et...
function patSearchViewModel() {
        var kv = ko.validation,
                 		koUtils = ko.utils,
                 		unwrap = koUtils.unwrapObservable,
                 		forEach = koUtils.arrayForEach,
                 		extend = koUtils.extend;
    var self = this;
    self.patientResultsURI = ko.observable();
    self.patientCountURI = ko.observable();
    self.searchCriteriaURI = ko.observable();
    self.prescriptionResultsURI = ko.observable();

    self.firstName = ko.observable().extend({ required: true });
    self.lastName = ko.observable().extend({ required: true });

    self.dateOfBirth = ko.observable();
    self.validateDateOfBirth = ko.observable().extend({
                                                            required: true,
                                                            pattern:
                                                            { params: '^([0][1-9]|[1][0-2])[\/]([0][1-9]|[1-2][0-9]|[3][0-1])[\/][1][9][0-9]+|([2][0][0-9]+)$',
                                                              message: 'Dates must be entered as Month Day Year (ex: 01/23/1990).' }
                                                      });
    self.gender = ko.observable();
    self.county = ko.observable();
    self.zipCode = ko.observable().extend({  minLength: 5,
                                             maxLength: 5,
                                             pattern:   '^[0-9]+$' });
    self.dispenseStart = ko.observable();
    self.validateDispenseStart = ko.observable().extend({
                                                            required: true,
                                                            pattern:
                                                            { params: '^([0][1-9]|[1][0-2])[\/]([0][1-9]|[1-2][0-9]|[3][0-1])[\/][1][9][0-9]+|([2][0][0-9]+)$',
                                                              message: 'Dates must be entered as Month Day Year (ex: 01/23/1990).' }
                                                         });
    self.dispenseEnd = ko.observable();
    self.validateDispenseEnd = ko.observable().extend({
                                                            required: true,
                                                            pattern:
                                                            { params: '^([0][1-9]|[1][0-2])[\/]([0][1-9]|[1-2][0-9]|[3][0-1])[\/][1][9][0-9]+|([2][0][0-9]+)$',
                                                              message: 'Dates must be entered as Month Day Year (ex: 01/23/1990).' }
                                                         });
    self.patients = ko.observableArray([]);
    self.prescriptions = ko.observableArray([]);
    self.checkOnes = ko.observableArray([]);
    self.completeCheck = ko.computed(function () {
        return ko.utils.arrayFilter(self.patients(), function (patient) {
            return patient.isCheck();
        });
    });
    self.justIds = ko.computed(function () {
        var checkedPatients = ko.utils.arrayMap(self.completeCheck(), function (item) {
            return item.memberId();
        });
        return checkedPatients;
    });

    self.checkIdLength = ko.computed(function(){
        if(self.completeCheck().length > 0){
            return true;
        } else {return false;}
    });
    
    //self.validDob = ko.computed(function () {
        //var checkValue = k
    //});

    self.dispenseStartDateDisplay = ko.computed(function () {
        var rawDate = new Date(self.dispenseStart());
        var year = rawDate.getFullYear().toString();
        var month = (rawDate.getMonth() + 1).toString();
        var day = rawDate.getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.dispenseEndDateDisplay = ko.computed(function () {
        var rawDate = new Date(self.dispenseEnd());
        var year = rawDate.getFullYear().toString();
        var month = (rawDate.getMonth() + 1).toString();
        var day = rawDate.getDate().toString();
        return month + '/' + day + '/' + year;
    });

    self.dateOfBirthDisplay = ko.computed(function () {
        var rawDate = new Date(self.dateOfBirth());
        var year = rawDate.getFullYear().toString();
        var month = (rawDate.getMonth() + 1).toString();
        var day = rawDate.getDate().toString();
        return month + '/' + day + '/' + year;
    });
    self.showAlert = ko.observable(false);
    self.errors = ko.validation.group(self, {deep: true});





    // Navigate from patient search form to patient search results
    self.Next = function () {

        if (self.errors().length > 0) {
            self.errors.forEach(function (observable) {
                if(kv.utils.isValidatable(observable)) {

                    if(!observable.isValid()) {
                        observable.isModified(true);
                    }
                }
            });
        } else {
        $.ajax({
            type: 'GET',
            url: 'patients',
            data: {
                firstName: self.firstName,
                lastName: self.lastName,
                dateOfBirthDt: self.dateOfBirth
            }
        }).success(function (result, status) {
            $('#patient-search-wrap').toggle();
            $('#patient-results-wrap').toggle();

            self.patientResultsURI(result.relatedSearchURI);
            self.patientCountURI(result.relatedPatientCountURI);
            getTotalPatientCount();

            var mappedPatients = $.map(result.patients, function (item) {
                return new Patient(item);
            });
            self.patients(mappedPatients);
            $('#patient-results-table').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": false,
                "ordering": false,
                "info": false,
                "autoWidth": true
            });
        });

        }
    }

    // Navigate from patient search results to prescription search results
    self.Submit = function () {
        $.ajax({
            type: 'POST',
            url: 'prescriptions/view',
            data: ko.toJSON({
                patientIds: self.justIds,
                startDate: self.dispenseStart,
                endDate: self.dispenseEnd,
                firstName: $('#query-firstName').val(),
                lastName: $('#query-lastName').val(),
                dateOfBirthDt: $('#query-dateOfBirth').datepicker("getDate"),
                relatedPatientSearchURL: self.patientResultsURI(),
                relatedPatientCountURL: self.patientCountURI(),
            }),
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            'dataType': 'json'
        }).success(function (result, status) {
            $('#patient-results-wrap').toggle();
            $('#prescription-results-wrap').toggle();
            
            self.searchCriteriaURI(result.relatedSearchCriteriaURI);
            self.prescriptionResultsURI(result.relatedPrescriptionsResultsURI);

            var mappedPrescriptions = $.map(result.prescriptions, function (item) {
                return new Prescription(item);
            });
            self.prescriptions(mappedPrescriptions);

        });

    };
    
    self.SavePdf = function() {
    	$.ajax({
            type: 'POST',
            url: 'prescriptions/blindSave',
            data: ko.toJSON({
                patientIds: self.justIds,
                startDate: self.dispenseStart,
                endDate: self.dispenseEnd,
                firstName: $('#query-firstName').val(),
                lastName: $('#query-lastName').val(),
                dateOfBirthDt: $('#query-dateOfBirth').datepicker("getDate"),
                relatedPatientSearchURL: self.patientResultsURI(),
                relatedPatientCountURL: self.patientCountURI(),
            }),
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            'dataType': 'text',
            success: function (result, status) {
                	self.firstName(null);
                	self.lastName(null);
                	self.dateOfBirth(null);
                	self.validateDateOfBirth(null);
                	self.gender(null);
                	self.county(null);
                   	self.zipCode(null);
                	self.dispenseStart(null);
                	self.validateDispenseStart(null);
                	self.dispenseEnd(null);
                	self.validateDispenseEnd(null);
                	self.patients.removeAll();
                	$('#patient-results-wrap').toggle();
                    $('#patient-search-wrap').toggle();
                    self.errors.showAllMessages(false);
            }

    	});
    	
    }
    
    self.ViewPdf = function () {
    	//TODO: This is a temporary hack; will need to get the actual URI instead of this crud.
    	//Suggest making the web layer follow HATEOAS instead of just passing back the service links.
    	var uri = self.prescriptionResultsURI();
    	uri = uri.replace('8080', '8090');
    	window.open(uri + '/save/pdf', 'Prescription PDF');
    	return false;
    };
    
    self.ViewCsv = function() {
    	//TODO: This is a temporary hack; will need to get the actual URI instead of this crud.
    	//Suggest making the web layer follow HATEOAS instead of just passing back the service links.
    	var uri = self.prescriptionResultsURI();
    	uri = uri.replace('8080', '8090');
    	window.open(uri + '/save/csv', 'Prescription CSV');
    	return false;
    };

} // End of viewmodel

function getTotalPatientCount() {
    $.ajax({
        type: "GET",
        url: "/patients/count",
        data: {
            firstName: $('#query-firstName').val(),
            lastName: $('#query-lastName').val(),
            dateOfBirthDt: $('#query-dateOfBirth').datepicker("getDate")}
    }).success(function (data) {
        var count = data;
        $('#total-results-count').text(count);
    });
}




