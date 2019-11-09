var mytable;
$(document).ready(function () {
    mytable = $('#myTable').DataTable({
        ajax: {
            url: "api/album/admin_getDanhSachAlbum",
            dataType: "JSON",
            "dataSrc": function (data) {
                return data;
            },
        },
        "ordering": false,
        "autoWidth": false,
        "deferRender": true,
        "processing": true,
        "pageLength": 50,
        "searchHighlight": true,
        "columns": [
            { "data": "Id" },
            { "data": "AlbumCaption" },
            { "data": "DanhMucAlbumTitle" },
            { "data": "AlbumImage" },
            { "data": "ThuTu" },
            { "data": "Active" },
            { "data": "Id" },
        ],
        "columnDefs": [
            {
                "targets": 0, "className": "dt-center",
                render: function (data) {
                    return data;
                }
            },
            {
                "targets": [1, 2],
                "className": "dt-left",
                render: function (data) {
                    return data;
                }
            },
            {
                "targets": [3],
                "className": "dt-center",
                render: function (data) {
                    return ('<a href="javascript:void(0)"><img src="' + data + '" style="width:400px" /></a>');
                }
            },
            {
                "targets": [4],
                "className": "dt-center",
                render: function (data) {
                    return (data);
                }
            },
            {
                "targets": [4],
                "className": "dt-center",
                render: function (data) {
                    return (data);
                }
            },
            {
                "targets": [5],
                "className": "dt-center",
                render: function (data) {
                    if (data) return 'Hiển thị';
                    else return 'Ẩn';
                }
            },
            {
                "targets": 6,
                "className": "dt-center",
                render: function (data) {
                    return '<a href="javascript:void(0);" data-toggle="modal" data-target="#modalChiTiet" data-whatever="' + data + '"><i class="fa fa-edit text-blue" title="Biên tập"></i></a> '
                    + ' || <a href="javascript:void(0);" data-toggle="modal" data-target="#modalImage" data-albumid="' + data + '"><i class="fa fa-picture-o text-blue" title="Biên tập album"></i></a>'
                    + ' || <a href="javascript:void(0);" onclick="deleteData(' + data + ')"><i class="fa fa-trash-o text-red" title="Xóa"></i></a>';

                }
            },
        ],
        language: {
            processing: "<img src='/plugins/DataTables/DataTables/images/loading.gif'> đang tải...",
            "url": "/plugins/DataTables/DataTables/Vietnamese.txt",
            search: "_INPUT_",
            searchPlaceholder: "Nhập chuỗi cần tìm kiếm, dùng \"\" để tìm kiếm chính xác ..."
        },
        "initComplete": function () {
            oninit();
        },
    });
    mytable.on('draw.dt', function () {
        var PageInfo = $('#myTable').DataTable().page.info();
        mytable.column(0, { page: 'current' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
    });
    function oninit() {
        //them nut them moi vao been tren
        $("#btnAdd").appendTo("#myTable_length");
        //set chieu rong o tim kiem
        $('.dataTables_filter input').css({ 'width': '400px', 'display': 'inline-block' });
    }

    $('#modalChiTiet').on('hide.bs.modal', function (event) {
        //mytable.ajax.reload(null, false);
    });

    $('#modalChiTiet').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var loai = button.data('loai');
        var modal = $(this);

        //Sua title
        if (loai == 'add') {
            modal.find('#modalTitle').html("THÊM MỚI ALBUM");
            initForm(0);
        } else {
            var id = button.data('whatever');
            if (id > 0) {
                modal.find('#modalTitle').html("SỬA THÔNG TIN ALBUM");
                initForm(id);
            }
        }
    });
    $('#modalImage').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var albumid = button.data('albumid');
        var modal = $(this);
        $('#hidImageId').val(albumid);
        $('#dsImage > tbody').html('');
        $.ajax({
            url: "/api/album/admin_getDanhSachAlbumImage",
            type: "POST",
            data: JSON.stringify({
                "AlbumId": albumid
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var stt = i + 1;
                    var txt = '<tr>' +
                        '<td><img style="width:400px" src="' + item.Image + '" ImageUrl="' + item.Image + '" ImageId="' + item.Id + '" name="ImageName" /></td>' +
                        '<td align="center"><textarea rows="4" style="width:250px" name="ImageCapt">' + item.ImageCaption + '</textarea></td>' +
                        '<td align="center"><input type="text" style="width:50px" value="' + item.ThuTu + '" name="ImageThuTu" /></td>' +
                        '<td align="center"><i class="fa fa-trash-o text-red" style="cursor:pointer" onclick="DeleteFileUpload($(this));"></i></td></tr>';
                    $('#dsImage > tbody:last-child').append(txt);
                }
            },
        });
    });
    $("input#file").on('change', function () {
        var data = new FormData($('form#formUpload')[0]);
        $.ajax({
            type: "POST",
            url: '/api/UploadFile/UploadFilesAlbum',
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            success: function (data, textStatus, xhr) {
                if (data.fileName.length > 0) {
                    $('#imgAlbumImage').attr("src", data.fileUrl);
                    $('#txtAlbumImage').val(data.fileUrl);
                } else if (data.fileDesc.length > 0) {
                    alert(data.fileDesc);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            }
        });
    });
    $("input#fileImage").on('change', function () {
        var data = new FormData($('form#formUploadImage')[0]);
        $.ajax({
            type: "POST",
            url: 'api/UploadFile/UploadFilesAlbumImage',
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            success: function (result) {
                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var stt = i + 1;
                    var txt = '<tr>' +
                        '<td><img style="width:400px" src="' + item.fileUrl + '" ImageUrl="' + item.fileUrl + '" ImageId="0" name="ImageName"  /></td>' +
                        '<td align="center"><textarea rows="4" style="width:250px" name="ImageCapt"></textarea></td>' +
                        '<td align="center"><input type="text" style="width:50px" value="' + stt + '" name="ImageThuTu" /></td>' +
                        '<td align="center"><i class="fa fa-trash-o text-red" style="cursor:pointer" onclick="DeleteFileUpload($(this));"></i></td></tr>';
                    $('#dsImage > tbody:last-child').append(txt);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            }
        });
    });
    $('#btnSave').click(function () {
        saveData();
    });
    $('#btnSaveImage').click(function () {
        saveAlbumImage();
    });
    $('#btnFile').click(function () {
        $("#file").click();
    });

    loadDanhMucAlbum();
});

function saveData() {
    $.ajax({
        url: "api/album/insertUpdateAlbum",
        type: "POST",
        data: JSON.stringify({
            "Id": $('#txtId').val(),
            "DanhMucAlbumId": $('#cmbDanhMucAlbum').val(),
            "AlbumCaption": $('#txtAlbumCaption').val(),
            "AlbumDesc": $('#txtAlbumDesc').val(),
            "AlbumImage": $('#txtAlbumImage').val(),
            "Language": $('#cmbLanguage').val(),
            "ThuTu": $('#txtThuTu').val(),
            "Active": $('#cmbActive').val() == 1,
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result.Content);
            if (result.Code == 0) {
                $('#modalChiTiet').modal('toggle');
                mytable.ajax.reload(null, false);
            }
        },
    });
}

function saveAlbumImage() {
    $.ajax({
        url: "api/album/insertUpdateAlbumImage",
        type: "POST",
        data: JSON.stringify({
            "Id": $('#hidImageId').val(),
            "dsImage": getTableFile(),
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            alert(result.Content);
            if (result.Code == 0) {
                $('#modalImage').modal('toggle');
            }
        },
    });
}
        
function deleteData(id) {
    if (confirm('Bạn thật sự muốn xóa album này?')) {
        $.ajax({
            url: "/api/album/deleteAlbum",
            type: "POST",
            data: JSON.stringify({
                "Id": id,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                alert(result.Content);
                if (result.Code == 0) {
                    mytable.ajax.reload(null, false);
                }
            },
        });
    }
}

function initForm(id) {
    if (id == undefined) return;
    $('#txtId').val('');
    $('#cmbDanhMucAlbum').val(''); 
    $("#txtAlbumCaption").val('');
    $("#txtAlbumDesc").val('');
    $('#txtAlbumImage').val('');
    $('#imgAlbumImage').attr("src", "/upload_img/noimages.png");
    $("#cmbLanguage option:first").attr('selected', 'selected');
    $("#txtThuTu").val('');
    $("#cmbActive option:first").attr('selected', 'selected');
    if (id > 0) {
        $.ajax({
            url: "/api/album/admin_getAlbum",
            type: "POST",
            data: JSON.stringify({
                "Id": id,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#txtId').val(result.Id);
                $("#cmbDanhMucAlbum").val(result.DanhMucAlbumId);
                $('#txtAlbumCaption').val(result.AlbumCaption);
                $('#txtAlbumDesc').val(result.AlbumDesc);
                $('#imgAlbumImage').attr("src", result.AlbumImage.length > 0 ? result.AlbumImage : "/upload_img/noimages.png");
                $('#imgAlbumImage').show();
                $('#txtAlbumImage').val(result.AlbumImage);
                $('#cmbLanguage').val(result.Language);
                $('#txtThuTu').val(result.ThuTu);
                $('#cmbActive').val(result.Active ? 1 : 0);
            },
        });
    }
}

function getTableFile() {
    jsonObj = [];
    $("#dsImage tbody tr").each(function () {
        var Id=0;
        var AlbumId = $('#hidImageId').val();
        var Image;
        var ImageCaption;
        var ThuTu;
        $(this).find("td [name='ImageName']").each(function () {
            Id = this.attributes["ImageId"].value;
            Image = this.attributes["ImageUrl"].value;
        });

        $(this).find("td textarea[name='ImageCapt']").each(function () {
            ImageCaption = $(this).val();
        });

        $(this).find("td input[name='ImageThuTu']").each(function () {
            ThuTu = $(this).val();
        });


        item = {}
        item["Id"] = Id;
        item["AlbumId"] = AlbumId;
        item["Image"] = Image;        
        item["ImageCaption"] = ImageCaption;
        item["ThuTu"] = ThuTu;
        item["Active"] = 1;
        if (Image.length > 0) jsonObj.push(item);
    });
    return jsonObj;
}

function DeleteFileUpload(btnXoa) {
    if (confirm('Bạn thật sự muốn xóa?')) {
        btnXoa.closest('tr').find("[name='ImageName']").each(function () {
            var Image = this.attributes["ImageUrl"].value;
            var Id = this.attributes["ImageId"].value;
            if (Image.length > 0) {
                $.ajax({
                    url: "/api/UploadFile/DeleteFilesAlbumImage",
                    type: "POST",
                    data: JSON.stringify({
                        Id: Id,
                        Image: Image,
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        btnXoa.closest('tr').remove();
                    },
                });
            }
        });
    }
}

function loadDanhMucAlbum() {
    $.get("/api/album/genDanhMucAlbumComboBox", function (result) {
        $('#cmbDanhMucAlbum').empty();
        for (var i = 0; i < result.length; i++) {
            $('<option/>', {
                'value': result[i].Id,
                'text': result[i].DanhMucAlbumTitle
            }).appendTo('#cmbDanhMucAlbum');
        }        
    });
}