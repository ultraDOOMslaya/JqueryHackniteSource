$(document).ready(function () {
    loadUsers();
    
    $('#add-button').click(function(event){
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'adduser',
            data: JSON.stringify({
                commonName: $('#add-commonName').val(),
                surname: $('#add-surname').val(),
                description: $('#add-description').val()
            }),
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            'dataType': 'json'
        }).success(function(data, status){
            $('#add-commonName').val('');
            $('#add-surname').val('');
            $('#add-description').val('');
            loadUsers();
        });
    });
    
    $('#edit-button').click(function(event){
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'edituser',
            data: JSON.stringify({
                commonName: $('#edit-commonName').val(),
                surname: $('#edit-surname').val(),
                description: $('#edit-description').val()
            }),
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            'dataType': 'json'
        }).success(function(data, status){
            $('#edit-commonName').val('');
            $('#edit-surname').val('');
            $('#edit-description').val('');
            loadUsers();
        });
    });
    
});

function loadUsers(){
    clearUsers();
    var userTable = $('#userTable');
    
    $.ajax({
        url: 'allusers'
    }).success(function(users, status){
        $.each(users, function(index, user){
          userTable.append($('<tr>')
                  .append($('<td>')
                    .append($('<a>')
                        .attr({'onClick': 'loadUser(\"' + user.commonName + '\")'})
                            .text(user.commonName)))
                  .append($('<td>').text(user.surname))
                  .append($('<td>').text(user.description))
                  .append($('<td>')
                    .append($('<a>')
                        .attr({'onClick': 'deleteUser(\"' + user.commonName + '\")'})
                            .text('Delete'))));
        });
    });
}

function clearUsers() {
    $('#userTable').empty();
}

function loadUser(commonName){
    $.ajax({
        url: 'user/' + commonName
    }).success(function(user, status){
        $('#edit-commonName').val(user.commonName);
        $('#edit-surname').val(user.surname);
        $('#edit-description').val(user.description);
    });
}

function deleteUser(commonName) {
    var answer = confirm("Do you really want to delete this user?");
    if (answer === true) {
        $.ajax({
            type: 'DELETE',
            url: 'user/' + commonName
        }).success(function () {
            loadUsers();
        });
    }
}

