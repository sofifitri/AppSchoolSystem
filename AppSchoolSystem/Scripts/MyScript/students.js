$(document).ready(function () {
   
    LoadStudents();

    //Open popup
    $('body').on("click", "a.popup", function (e) {
        e.preventDefault();
        var page = $(this).attr('href');
        OpenPopup(page);
    });

    //Save Contacts
    $("body").on('submit', '#saveForm', function (e) {
        e.preventDefault();
        SaveStudents();
        LoadStudents();
        
    });

    //Delete Contact
    $('body').on('submit', '#deleteForm', function (e) {
        e.preventDefault();
        DeleteStudents();
    });


});


function LoadStudents() {
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
                var header = "<thead><tr><th>NIS</th><th>Nama</th><th>Kelas</th><th>Jenis Kelamin</th><th></th></tr></thead>";
                $data.append(header);
                console.log(" data " + count);
                
                $.each(d, function (i, row) {
                    for (var i = 0; i < count; i++) {
                        var $row = $('<tr/>');
                        $row.append($('<td/>').html(d.students[i].nis));
                        $row.append($('<td/>').html(d.students[i].nama));
                        $row.append($('<td/>').html(d.students[i].kelas));
                        $row.append($('<td/>').html(d.students[i].jenisKelamin));
                        $row.append($('<td/>').html("<a href='/Students/Edit/" + d.students[i]._id + "' class='popup'>Edit</a>&nbsp;|&nbsp;<a href='/Students/Delete/" + d.students[i]._id + "'>Delete</a>"));
                        $data.append($row);
                    }
                    
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

//Save Contact
function SaveStudents() {
    //Validation
    if ($('#nis').val().trim() == '' ||
        $('#nama').val().trim() == '' ||
        $('#kelas').val().trim() == '' ||
        $('#jk').val().trim() == '') {
        $('#msg').html('<div class="failed">All fields are required.</div>');
        return false;
    }

    var students = {
        nis: $('#nis').val() == '' ? '0' : $('#nis').val(),
        nama: $('#nama').val().trim(),
        kelas: $('#kelas').val().trim(),
        jk: $('#jk').val().trim()
    };

    students.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
    //Save Contact
    $.ajax({
        url: 'http://localhost:8383/api/students/create',
        type: 'POST',
        data: students,
        dataType: 'json',
        success: function (data) {
            if (data.status) {
                $('#nis').val('');
                $('#nama').val('');
                $('#kelas').val('');
                $('#jk').val('');
                $dialog.dialog('close');
            }
            window.location.href = '/Students/index';
        },
        error: function () {
            //$('#msg').html('<div class="failed">Error! Please try again.</div>');
        }
    });
}


//open popup
function OpenPopup(Page) {
    var $pageContent = $('<div/>');
    $pageContent.load(Page);
    $dialog = $('<div class="popupWindow" style="overflow:hidden"></div>')
            .html($pageContent)
            .dialog({
                draggable: false,
                autoOpen: false,
                resizable: false,
                model: true,
                height: 600,
                width: 600,
                close: function () {
                    $dialog.dialog('destroy').remove();
                }
            })
    $dialog.dialog('open');
}

function DeleteStudents() {
    $.ajax({
        url: 'http://localhost:8383/api/students/delete',
        type: 'POST',
        dataType: 'json',
        data: {
            'id': $('#id').val(),
            '__RequestVerificationToken': $('input[name=__RequestVerificationToken]').val()
        },
        success: function (data) {
            alert(data.message);
            if (data.status) {
                $dialog.dialog('close');
                LoadContacts();
            }
        },
        error: function () {
            $('#msg').html('<div class="failed">Error ! Please try again.</div>');
        }
    });
}
