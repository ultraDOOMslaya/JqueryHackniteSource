//TODO make the table then add the remove function
//TODO add the total count function
//TODO Add the select list functionality
$(document).ready(function() {
    var count = 0;
    var makers = [];
    var uni_makers = [];
    var allData;

    $.ajax({
        type: "GET",
        url: "/rustbuckets",
    }).success(function ( data ) {
        $.each( data, function( index, value ) {
            var str = value.maker.toString();
            $('#rust-bucket-tbody').append("<tr id="+index+"><td>"+value.name+"</td><td>"+value.modelnumber+"</td><td>"+value.component+
                                           "</td><td>"+value.maker+"</td><td><button id="+index+" class='btn bg-blue' title="+value.maker+" onclick='removeThis(this.id,this.title)'>remove</button></td></tr>");
            count = index;
            makers.push(value.maker);
        });
        allData = data;
        uni_makers = unique(makers);
        setSelectList(uni_makers);
        setTotalResults();
    });

    $('#select-maker').change( function() {
        var selected = $(this).val()
        $('#rust-bucket-tbody').empty();
        $.each( uni_makers, function( index, value ) {
            if(value === selected) {
                $('#rust-bucket-tbody').append("<tr id="+index+"'><td>"+value.name+"</td><td>"+value.modelnumber+"</td><td>"+value.component+
                                           "</td><td>"+value.maker+"</td><td><button id="+index+" class='btn bg-blue' title="+value.maker+" onclick='removeThis(this.id,this.title)'>remove</button></td></tr>");
            }
        });
    });

});

function removeThis(id, value) {
    $('#rust-bucket-tbody tr#'+id).remove();
    setTotalResults();
    var conditional = 0;
    $('#rust-bucket-tbody > tr > td > button').each(function() {
        var buttitle = $(this).attr('title');
        if( buttitle === value ) {
            conditional = 1;
        }
    });
    if( conditional === 0 ) {
        alterListData(value);
    }
}

//TODO get the count of all current Rust Buckets
function setTotalResults() {
    var rowCount = $('#rust-bucket-tbody tr').length;
    $('#total-results-count').text(rowCount);
}

function setSelectList(data) {
    var x = document.getElementById("select-maker");

    $.each( data, function( index, value ) {
        var option = document.createElement("option");
        option.text = value;
        x.add(option);
    });
}

function alterListData(value) {
    var x = document.getElementById("select-maker");
    $.each( x, function() {
        if( $(this).val() === value ) {
            $(this).remove();
        }
    });
}

function unique(array){
    return array.filter(function(el, index, arr) {
        return index === arr.indexOf(el);
    });
}
//TODO seperate the rust buckets into two lists