$(document).ready(function () {

    ko.applyBindingsWithValidation(new dataEntryViewModel());
});

ko.validation.init({
    insertMessages: true,
    decorateInputElement: true,
    messagesOnModified: true,
    errorElementClass: 'err',
    errorMessageClass: 'help-block'
}, true);

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

function dataEntryViewModel() {
    var kv = ko.validation,
                    koUtils = ko.utils,
                 	unwrap = koUtils.unwrapObservable,
                 	forEach = koUtils.arrayForEach,
                 	extend = koUtils.extend;
    var self = this;
    self.pharmacy = ko.observable();
    self.pharmacist = ko.observable();
    self.prescriber = ko.observable();
    self.fdaProduct = ko.observable();
    self.patient = ko.observable();
    self.selectedPatient = ko.observable();
    self.patients = ko.observableArray([]);
    self.prescription = ko.observable();
    self.prescriptions = ko.observableArray([]);

    //pharmacy input fields
    self.pharmacyIdType = ko.observable();
    self.pharmacyId = ko.observable().extend({ required: true,
                                               minLength: 10,
                                               maxLength: 10 });
    //pharmacist input fields
    self.pharmacistIdType = ko.observable();
    self.pharmacistId = ko.observable().extend({ required: true,
                                                 minLength: 10,
                                                 maxLength: 10 });
    // prescriber input fields
    self.prescriberIdType = ko.observable();
    self.prescriberId = ko.observable().extend({ required: true,
                                                 minLength: 10,
                                                 maxLength: 10 });


    // fdaproduct input fields
    self.fdaProductQualifier = ko.observable();
    self.fdaProductId = ko.observable().extend({ required: true,
                                                 number: true });
    // patient input fields
    self.patientFirstName = ko.observable().extend({ required: true });
    self.patientLastName = ko.observable().extend({ required: true });
    self.patientDateOfBirth = ko.observable();
    self.validatePatientDOB = ko.observable().extend({ required: true });
    self.patientAddressOne = ko.observable();
    self.patientAddressTwo = ko.observable();
    self.patientCity = ko.observable();
    self.patientState = ko.observable();
    self.patientZipCode = ko.observable();
    // prescription input fields
    self.rxNumber = ko.observable().extend({ required: true,
                                             number: true });;
    self.txForm = ko.observable();
    self.dateWritten = ko.observable();
    self.validDateWritten = ko.observable().extend({ required: true });
    self.dateFilled = ko.observable();
    self.validDateFilled = ko.observable().extend({ required: true });
    self.dateSold = ko.observable();
    self.validDateSold = ko.observable().extend({ required: true });
    self.quantity = ko.observable().extend({ required: true });
    self.daysSupply = ko.observable().extend({ required: true });
    self.drugDosageUnitCode = ko.observable();
    self.refillsAuthorized = ko.observable().extend({ required: true });
    self.refillNum = ko.observable().extend({ required: true });
    self.partialFill = ko.observable();
    self.paymentType = ko.observable();
    self.rxNormCode = ko.observable();
    self.elecRxRefNum = ko.observable();

    // button toggles
    self.ShowOnButtonClick = ko.observable(false);
    self.ShowOnAddClick = ko.observable(false);
    self.ShowOnLookUpClick = ko.observable(false);

    self.sessionPatients = ko.computed(function () {
        return ko.utils.arrayFilter(self.patients(), function (patient) {
            return patient.isCheck();
        });
    });

    self.isSelected = function (patient) {
        if ($('#gotoprescriber-button').hasClass("disabled")) {
            $('#gotoprescriber-button').toggleClass("disabled");
        }
        return self.selectedPatient(patient);
    };

    self.SwitchToPharmacy = function () {
        $('.dataentry-container:visible').toggle();
        $('#pharmacy-lookup-box').toggle();
    };

    var pharmacyErrors = ko.validation.group( self.pharmacyId );
    self.LookUpPharmacy = function () {
        if (pharmacyErrors().length > 0) {
            pharmacyErrors.forEach(function (observable) {
                if(kv.utils.isValidatable(observable)) {

                    if(!observable.isValid()) {
                        observable.isModified(true);
                    }
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: '/pharmacy',
                data: {
                    identifier: self.pharmacyId,
                    type: self.pharmacyIdType
                }
            }).success(function (data, status) {
                self.pharmacy(new Pharmacy(data));
                if ($('#gotopharmacist-button').hasClass("disabled")) {
                    $('#gotopharmacist-button').toggleClass("disabled");
                }
            });
        }
    };

    self.GoToPharmacist = function () {
        $('#pharmacy-lookup-box').toggle();
        $('#pharmacist-lookup-box').toggle();
        $("#collapsePharmacy").collapse('hide');
        $("#collapsePharmacist").collapse('show');
    };

    self.SwitchToPharmacist = function () {
        $('.dataentry-container:visible').toggle();
        $('#pharmacist-lookup-box').toggle();
    };

    var pharmacistErrors = ko.validation.group( self.pharmacistId );
    self.LookUpPharmacist = function () {
        if (pharmacistErrors().length > 0) {
            pharmacistErrors.forEach(function (observable) {
                if(kv.utils.isValidatable(observable)) {

                    if(!observable.isValid()) {
                        observable.isModified(true);
                    }
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: '/pharmacist',
                data: {
                    identifier: self.pharmacistId,
                    type: self.pharmacistIdType
                }
            }).success(function (data, status) {
                self.pharmacist(new Pharmacist(data));
                if ($('#gotopatient-button').hasClass("disabled")) {
                    $('#gotopatient-button').toggleClass("disabled");
                }
            });
        }
    };

    self.GoToPatient = function () {
        $('#pharmacist-lookup-box').toggle();
        $('#patient-lookup-box-1').toggle();
        $("#collapsePharmacist").collapse('hide');
        $("#collapsePatient").collapse('show');
    };

    self.SwitchToPatient = function () {
        $('.dataentry-container:visible').toggle();
        $('#patient-lookup-box-1').toggle();
    };

    self.LookUpPatient = function () {
        if (self.ShowOnButtonClick(false)) {
            self.ShowOnButtonClick(!self.ShowOnButtonClick());
            $('#look-up-submit').prop('disabled', true);
            $('#add-submit').prop('disabled', false);
        }
        if (self.ShowOnLookUpClick(false)) {
            self.ShowOnLookUpClick(!self.ShowOnLookUpClick());
        }
        if (self.ShowOnAddClick(true)) {
            self.ShowOnAddClick(!self.ShowOnAddClick());
        }
    };

    self.AddPatient = function () {
        if (self.ShowOnButtonClick(false)) {
            self.ShowOnButtonClick(!self.ShowOnButtonClick());
            $('#add-submit').prop('disabled', true);
            $('#look-up-submit').prop('disabled', false);
        }
        if (self.ShowOnAddClick(false)) {
            self.ShowOnAddClick(!self.ShowOnAddClick());
        }
        if (self.ShowOnLookUpClick(true)) {
            self.ShowOnLookUpClick(!self.ShowOnLookUpClick());
        }
    };
    patientErrors = ko.validation.group( [ self.patientFirstName,
                                         self.patientLastName,
                                         self.validatePatientDOB ]);
    self.AddSubmit = function () {
        if (patientErrors().length > 0) {
            patientErrors.forEach(function (observable) {
                if(kv.utils.isValidatable(observable)) {

                    if(!observable.isValid()) {
                        observable.isModified(true);
                    }
                }
            });
        } else {
            $('gotoprescriber-button').toggleClass("disabled");
            
            var data = {
                firstName: self.patientFirstName(),
                lastName: self.patientLastName(),
                dateOfBirthKey: {dateValue: self.patientDateOfBirth()},
                addressLineOne: self.patientAddressOne(),
                addressLineTwo: self.patientAddressTwo(),
                city: self.patientCity(),
                state: self.patientState(),
                zipCode: self.patientZipCode()
            };
            createdPatient = new Patient(data);
            self.selectedPatient(createdPatient);

            if ($('#gotoprescriber-button').hasClass("disabled")) {
                $('#gotoprescriber-button').toggleClass("disabled");
            }
        }
    };

    var table = $('#patient-results-table').DataTable({
        "paging": false,
        "lengthChange": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "autoWidth": true
    });

    self.LookUpSubmit = function () {
        if (patientErrors().length > 0) {
            patientErrors.forEach(function (observable) {
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
                    firstName: self.patientFirstName,
                    lastName: self.patientLastName,
                    dateOfBirthDt: self.patientDateOfBirth
                }
            }).success(function (result, status) {
                var mappedPatients = $.map(result.patients, function (item) {
                    return new Patient(item);
                });

                //mappedPatient.isCheck;
                self.patients(mappedPatients);

                $('#patient-results-table tbody tr').click(function () {
                    $(this).siblings().removeClass('selected');
                    $(this).addClass('selected');
                });
                /*
                $('#patient-results-table tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
                */
            });
        }
    };

    self.PatientSubmit = function () {
        alert("heres the selected patient! " + self.selectedPatient() + " this is all this button does");
    };

    self.GoToPrescriber = function () {
        $('#patient-lookup-box-1').toggle();
        $('#prescriber-lookup-box').toggle();
        $("#collapsePatient").collapse('hide');
        $("#collapsePrescriber").collapse('show');

        if (self.ShowOnButtonClick(true)) {
            self.ShowOnButtonClick(!self.ShowOnButtonClick());
            $('#look-up-submit').prop('disabled', false);
            $('#add-submit').prop('disabled', false);
        }
        if (self.ShowOnLookUpClick(true)) {
            self.ShowOnLookUpClick(!self.ShowOnLookUpClick());
        }
        if (self.ShowOnAddClick(true)) {
            self.ShowOnAddClick(!self.ShowOnAddClick());
        }


    };

    self.SwitchToPrescriber = function () {
        $('.dataentry-container:visible').toggle();
        $('#prescriber-lookup-box').toggle();
    };

    prescriberErrors = ko.validation.group( self.prescriberId );
    self.LookUpPrescriber = function () {
        if (prescriberErrors().length > 0) {
            prescriberErrors.forEach(function (observable) {
                if(kv.utils.isValidatable(observable)) {

                    if(!observable.isValid()) {
                        observable.isModified(true);
                    }
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: '/prescriber',
                data: {
                    identifier: self.prescriberId,
                    type: self.prescriberIdType
                }
            }).success(function (data, status) {
                self.prescriber(new Prescriber(data));
                if ($('#gotoprescription-button').hasClass("disabled")) {
                    $('#gotoprescription-button').toggleClass("disabled");
                }
            });
        }
    };

    self.GoToPrescription = function () {
        $('#prescriber-lookup-box').toggle();
        $('#prescription-lookup-box').toggle();
        $("#collapsePrescriber").collapse('hide');
        $("#collapsePrescription").collapse('show');
    };

    self.SwitchToPrescription = function () {
        $('.dataentry-container:visible').toggle();
        $('#prescription-lookup-box').toggle();
    };

    fdaProductErrors = ko.validation.group( self.fdaProductId );
    self.LookUpFdaProduct = function () {
        if (fdaProductErrors().length > 0) {
            fdaProductErrors.forEach(function (observable) {
                if(kv.utils.isValidatable(observable)) {

                    if(!observable.isValid()) {
                        observable.isModified(true);
                    }
                }
            });
        } else {
            $.ajax({
                type: 'GET',
                url: '/fdaproduct',
                data: {
                    qualifier: self.fdaProductQualifier,
                    productId: self.fdaProductId
                }
            }).success(function (data, status) {
                self.fdaProduct(new FdaProduct(data));
                $('#prescription-form-entry').toggle();
            });
        }
    };
    prescriptionErrors = ko.validation.group( [ self.rxNumber,
                                         self.validDateWritten,
                                         self.validDateFilled,
                                         self.validDateSold,
                                         self.quantity,
                                         self.daysSupply,
                                         self.refillsAuthorized,
                                         self.refillNum ] );

    self.ReviewBeforeCommit = function () {
        if (prescriptionErrors().length > 0) {
            prescriptionErrors.forEach(function (observable) {
                if(kv.utils.isValidatable(observable)) {

                    if(!observable.isValid()) {
                        observable.isModified(true);
                    }
                }
            });
        } else {
            $(".collapse").collapse('show');
            $('#create-repeat-button').toggleClass("disabled");
            $('#create-finish-button').toggleClass("disabled");
            /*self.dateWrittenDisplay = ko.computed( function() {
                    var year = self.dateWritten().getFullYear().toString();
                    var month = (self.dateWritten().getMonth() + 1).toString();
                    var day = self.dateWritten().getDate().toString();
                    return month + '/' + day + '/' + year;
            });

            self.dateFilledDisplay = ko.computed({
                read: function () {
                    var year = self.dateFilled().getFullYear().toString();
                    var month = (self.dateFilled().getMonth() + 1).toString();
                    var day = self.dateFilled().getDate().toString();
                    return month + '/' + day + '/' + year;
                },
                deferEvaluation: true
            });

            self.dateSoldDisplay = ko.computed({
                read: function () {
                    var year = self.dateSold().getFullYear().toString();
                    var month = (self.dateSold().getMonth() + 1).toString();
                    var day = self.dateSold().getDate().toString();
                    return month + '/' + day + '/' + year;
                },
                deferEvaluation: true
            });*/
        }
    };

    self.CreatePrescriptionAndRepeat = function () {
        var newRx = new Prescription();
        newRx.pharmacy(self.pharmacy);
        newRx.pharmacist(self.pharmacist);
        newRx.patient(self.selectedPatient);
        newRx.prescriber(self.prescriber);
        newRx.fdaProduct(self.fdaProduct);

        newRx.rxNumber(self.rxNumber);
        newRx.txForm(self.txForm);
        newRx.dateWritten(self.dateWritten);
        newRx.dateFilled(self.dateFilled);
        newRx.dateSold(self.dateSold);
        newRx.quantity(self.quantity);
        newRx.daysSupply(self.daysSupply);
        newRx.drugDosageUnitCode(self.drugDosageUnitCode);
        newRx.refillsAuthorized(self.refillsAuthorized);
        newRx.refillNum(self.refillNum);
        newRx.partialFill(self.partialFill);
        newRx.paymentType(self.paymentType);
        newRx.rxNormCode(self.rxNormCode);
        newRx.elecRxRefNum(self.elecRxRefNum);
        self.prescription(newRx);

        $.ajax({
            type: 'POST',
            url: '/createPrescription',
            data: ko.toJSON(self.prescription),
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            'dataType': 'json'
        }).success(function () {
            $('#prescription-lookup-box').toggle();
            $('#patient-lookup-box-1').toggle();

            resetViewModelPartial();
        }).error(function (data, status) {
            alert("There were errors. Please check all required fields and resubmit. Alternatively, the database may be down.");
        });
    };

    self.CreatePrescriptionAndFinish = function () {
        var newRx = new Prescription();
        newRx.pharmacy(self.pharmacy);
        newRx.pharmacist(self.pharmacist);
        newRx.patient(self.selectedPatient);
        newRx.prescriber(self.prescriber);
        newRx.fdaProduct(self.fdaProduct);

        newRx.rxNumber(self.rxNumber);
        newRx.txForm(self.txForm);
        newRx.dateWritten(self.dateWritten);
        newRx.dateFilled(self.dateFilled);
        newRx.dateSold(self.dateSold);
        newRx.quantity(self.quantity);
        newRx.daysSupply(self.daysSupply);
        newRx.drugDosageUnitCode(self.drugDosageUnitCode);
        newRx.refillsAuthorized(self.refillsAuthorized);
        newRx.refillNum(self.refillNum);
        newRx.partialFill(self.partialFill);
        newRx.paymentType(self.paymentType);
        newRx.rxNormCode(self.rxNormCode);
        newRx.elecRxRefNum(self.elecRxRefNum);
        self.prescription(newRx);

        $.ajax({
            type: 'POST',
            url: '/createPrescription',
            data: ko.toJSON(self.prescription),
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            'dataType': 'json'
        }).success(function () {
            $('#prescription-lookup-box').toggle();
            $('#pharmacy-lookup-box').toggle();

            resetViewModelAll();
        }).error(function (data, status) {
            alert("There were errors. Please check all required fields and resubmit. Alternatively, the database may be down.");
        });
    };

    function resetViewModelPartial() {
        self.prescriber('');
        self.fdaProduct('');
        self.patient('');
        self.selectedPatient('');
        self.patients([]);
        self.prescription('');
        self.prescriptions([]);

        // prescriber input fields
        self.prescriberIdType('');
        self.prescriberId('');
        // fdaproduct input fields
        self.fdaProductQualifier('');
        self.fdaProductId('');
        // patient input fields
        self.patientFirstName('');
        self.patientLastName('');
        self.patientDateOfBirth('');
        self.validatePatientDOB('');
        self.patientAddressOne('');
        self.patientAddressTwo('');
        self.patientCity('');
        self.patientState('');
        self.patientZipCode('');
        // prescription input fields
        self.rxNumber('');
        self.txForm('');
        self.dateWritten('');
        self.validDateWritten('');
        self.dateFilled('');
        self.validDateFilled('');
        self.dateSold('');
        self.validDateSold('');
        self.quantity('');
        self.daysSupply('');
        self.drugDosageUnitCode('');
        self.refillsAuthorized('');
        self.refillNum('');
        self.partialFill('');
        self.paymentType('');
        self.rxNormCode('');
        self.elecRxRefNum('');
        patientErrors.showAllMessages(false);
        prescriberErrors.showAllMessages(false);
        fdaProductErrors.showAllMessages(false);
        prescriptionErrors.showAllMessages(false);

        if (!($('#gotopharmacist-button').hasClass("disabled"))) {
            $('#gotopharmacist-button').toggleClass("disabled");
        }
        if (!($('#gotopatient-button').hasClass("disabled"))) {
            $('#gotopatient-button').toggleClass("disabled");
        }
        if (!($('#gotoprescriber-button').hasClass("disabled"))) {
            $('#gotoprescriber-button').toggleClass("disabled");
        }
        if (!($('#gotoprescription-button').hasClass("disabled"))) {
            $('#gotoprescription-button').toggleClass("disabled");
        }
        if (!($('create-repeat-button').hasClass("disabled"))) {
            $('#create-repeat-button').toggleClass("disabled");
        }
        if (!($('create-repeat-button').hasClass("disabled"))) {
            $('#create-finish-button').toggleClass("disabled");
        }

        $('#prescription-form-entry').toggle();

        $("#collapsePharmacy").collapse('hide');
        $("#collapsePharmacist").collapse('hide');
        $("#collapsePrescriber").collapse('hide');
        $("#collapsePrescription").collapse('hide');

    }
    ;

    function resetViewModelAll() {
        self.pharmacy('');
        self.pharmacist('');
        self.prescriber('');
        self.fdaProduct('');
        self.patient('');
        self.selectedPatient('');
        self.patients([]);
        self.prescription('');
        self.prescriptions([]);

        //pharmacy input fields
        self.pharmacyIdType('');
        self.pharmacyId('');
        //pharmacist input fields
        self.pharmacistIdType('');
        self.pharmacistId('');
        // prescriber input fields
        self.prescriberIdType('');
        self.prescriberId('');
        // fdaproduct input fields
        self.fdaProductQualifier('');
        self.fdaProductId('');
        // patient input fields
        self.patientFirstName('');
        self.patientLastName('');
        self.patientDateOfBirth('');
        self.validatePatientDOB('');
        self.patientAddressOne('');
        self.patientAddressTwo('');
        self.patientCity('');
        self.patientState('');
        self.patientZipCode('');
        // prescription input fields
        self.rxNumber('');
        self.txForm('');
        self.dateWritten('');
        self.validDateWritten('');
        self.dateFilled('');
        self.validDateFilled('');
        self.dateSold('');
        self.validDateSold('');
        self.quantity('');
        self.daysSupply('');
        self.drugDosageUnitCode('');
        self.refillsAuthorized('');
        self.refillNum('');
        self.partialFill('');
        self.paymentType('');
        self.rxNormCode('');
        self.elecRxRefNum('');
        pharmacyErrors.showAllMessages(false);
        pharmacistErrors.showAllMessages(false);
        patientErrors.showAllMessages(false);
        prescriberErrors.showAllMessages(false);
        fdaProductErrors.showAllMessages(false);
        prescriptionErrors.showAllMessages(false);

        if (!($('#gotopharmacist-button').hasClass("disabled"))) {
            $('#gotopharmacist-button').toggleClass("disabled");
        }
        if (!($('#gotopatient-button').hasClass("disabled"))) {
            $('#gotopatient-button').toggleClass("disabled");
        }
        if (!($('#gotoprescriber-button').hasClass("disabled"))) {
            $('#gotoprescriber-button').toggleClass("disabled");
        }
        if (!($('#gotoprescription-button').hasClass("disabled"))) {
            $('#gotoprescription-button').toggleClass("disabled");
        }
        if (!($('create-repeat-button').hasClass("disabled"))) {
            $('#create-repeat-button').toggleClass("disabled");
        }
        if (!($('create-repeat-button').hasClass("disabled"))) {
            $('#create-finish-button').toggleClass("disabled");
        }

        $('#prescription-form-entry').toggle();

        $("#collapsePharmacist").collapse('hide');
        $("#collapsePatient").collapse('hide');
        $("#collapsePrescriber").collapse('hide');
        $("#collapsePrescription").collapse('hide');

    }
    ;
}

function Pharmacy(data) {
    var self = this;
    self.id = ko.observable(data.pharmacyMasterKey);
    self.npi = ko.observable(data.nationalProviderIdentifier);
    self.ncpdp_nabp = ko.observable(data.ncpdpNabpProviderId);
    self.dea = ko.observable(data.deaNumber);
    self.pharmacyName = ko.observable(data.dispensingPrescriberName);
    self.pharmacyAddressOne = ko.observable(data.addressLineOne);
    self.pharmacyAddressTwo = ko.observable(data.addressLineTwo);
    self.pharmacyCity = ko.observable(data.city);
    self.pharmacyState = ko.observable(data.state);
    self.pharmacyZipCode = ko.observable(data.zip);
}
;

function Pharmacist(data) {
    var self = this;
    self.id = ko.observable(data.pharmacistKey);
    self.npi = ko.observable(data.pharmacistNationalProviderIdentifier);
    self.stateLicenseNum = ko.observable(data.pharmacistStateLicenseNumber);
    self.pharmacistFirstName = ko.observable(data.firstName);
    self.pharmacistLastName = ko.observable(data.lastName);
    self.pharmacistName = ko.observable(data.firstName + " " + data.lastName);
}
;

function Patient(data) {
    var self = this;
    self.id = ko.observable(data.patientMasterKey);
    self.patientFirstName = ko.observable(data.firstName);
    self.patientLastName = ko.observable(data.lastName);
    self.dateOfBirth = ko.observable(new Date(data.dateOfBirthKey.dateValue));
    self.patientAddressOne = ko.observable(data.addressLineOne);
    self.patientAddressTwo = ko.observable(data.addressLineTwo);
    self.patientCity = ko.observable(data.city);
    self.patientState = ko.observable(data.sate);
    self.patientZipCode = ko.observable(data.zipCode);
    self.isCheck = ko.observable();

    self.dateOfBirthDisplay = ko.computed({
        read: function () {
            var year = self.dateOfBirth().getFullYear().toString();
            var month = (self.dateOfBirth().getMonth() + 1).toString();
            var day = self.dateOfBirth().getDate().toString();
            return month + '/' + day + '/' + year;
        },
        deferEvaluation: true
    });
}

function Prescriber(data) {
    var self = this;
    self.id = ko.observable(data.prescriberMasterKey);
    self.npi = ko.observable(data.nationalProviderIdentifier);
    self.stateLicenseNum = ko.observable(data.prescriberStateLicenseNumber);
    self.dea = ko.observable(data.deaNumber);
    self.prescriberFirstName = ko.observable(data.firstName);
    self.prescriberLastName = ko.observable(data.lastName);
    self.prescriberName = ko.observable(data.firstName + " " + data.lastName);
    self.prescriberPhoneNumber = ko.observable(data.phoneNumber);
}
;

function Prescription() {
    var self = this;
    self.pharmacy = ko.observable();
    self.pharmacist = ko.observable();
    self.patient = ko.observable();
    self.prescriber = ko.observable();
    self.fdaProduct = ko.observable();

    self.rxNumber = ko.observable();
    self.txForm = ko.observable();
    self.dateWritten = ko.observable();
    self.dateFilled = ko.observable();
    self.dateSold = ko.observable();
    self.quantity = ko.observable();
    self.daysSupply = ko.observable();
    self.drugDosageUnitCode = ko.observable();
    self.refillsAuthorized = ko.observable();
    self.refillNum = ko.observable();
    self.partialFill = ko.observable();
    self.paymentType = ko.observable();
    self.rxNormCode = ko.observable();
    self.elecRxRefNum = ko.observable();
}
;

function FdaProduct(data) {
    var self = this;
    self.id = ko.observable(data.fdaProductKey);
    self.reportingLabel = ko.observable(data.ndcProductReportingLabel);
    self.packageDescription = ko.observable(data.ndcFullPackageDescription);
    self.proprietaryName = ko.observable(data.proprietaryProductName);
    self.genericName = ko.observable(data.nonProprietaryName);
    self.manufacturer = ko.observable(data.labelerName);
    self.drugClass = ko.observable(data.pharmClasses);
    self.drugSchedule = ko.observable(data.deaSchedule);
}
;






