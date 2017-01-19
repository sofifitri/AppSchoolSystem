﻿$(document).ready(function () {
   
    LoadContacts();

});


function LoadContacts() {
    $('#update_panel').html('Loading Data...');


    $('#example1').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false
    });

    $.ajax({
        url: 'http://localhost:8383/api/students',
        type: 'GET',
        dataType: 'json',
        success: function (d, success) {
            console.log(" success " + JSON.stringify(success));
            console.log(" data " + JSON.stringify(d));
            var key, count = 0;
            for (key in d.students) {
                if (d.students[0]._id) {
                    count++;
                }
            }
            
            if (count > 0) {
                
                var $data = $("<table id='example1'></table>").addClass("table table-bordered table-striped");
                var header = "<thead><tr><th>Contact Person</th><th>Contact No</th><th>Country</th><th>State</th><th></th></tr></thead>";
                $data.append(header);
                console.log(" data " + count);
                $.each(d, function (i, row) {
                    var $row = $('<tr/>');
                    $row.append($('<td/>').html(d.students[0]._id));
                    $row.append($('<td/>').html(d.students[0].nama));
                    $row.append($('<td/>').html(d.students[0].kelas));
                    $row.append($('<td/>').html(d.students[0].jenisKelamin));
                    $row.append($('<td/>').html("<a href='/home/Save/" + row.ContactID + "' class='popup'>Edit</a>&nbsp;|&nbsp;<a href='/home/Delete/" + row.ContactID + "' class='popup'>Delete</a>"));
                    $data.append($row);
                });

                $('#update_panel').html($data);
            }
            else {
                var $noData = $('<div/>').html('No Data Found!');
                $('#update_panel').html($noData);
            }
        },
        error: function () {
            alert('Error! Please try again.');
        }
    });
}

