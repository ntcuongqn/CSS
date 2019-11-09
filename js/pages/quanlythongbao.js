var mytable;
$(document).ready(function () {
    mytable = $('#myTable').DataTable({
        ajax: {
            url: "/api/thongbao/admin_getDanhSachThongBao",
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
            { "data": "ThongBaoTitle" },
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
                "targets": [1],
                "className": "dt-left",
                render: function (data) {
                    return data;
                }
            },
            {
                "targets": [2],
                "className": "dt-center",
                render: function (data) {
                    return (data);
                }
            },
            {
                "targets": [3],
                "className": "dt-center",
                render: function (data) {
                    return data?'Hoạt đông':'Không hoạt động';
                }
            },
            {
                "targets": 4,
                "className": "dt-center",
                render: function (data) {
                    return '<a href="javascript:void(0);" data-toggle="modal" data-target="#modalChiTiet" data-whatever="' + data + '"><i class="fa fa-edit text-blue" title="Biên tập"></i></a> '                    
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
            modal.find('#modalTitle').html("THÊM MỚI THÔNG BÁO");
            initForm(0);
        } else {
            var id = button.data('whatever');
            if (id > 0) {
                modal.find('#modalTitle').html("SỬA THÔNG TIN THÔNG BÁO");
                initForm(id);
            }
        }
    });   
    $('#btnSave').click(function () {
        saveData();
    });
    
    
});

function saveData() {
    $.ajax({
        url: "/api/thongbao/insertUpdateThongBao",
        type: "POST",
        data: JSON.stringify({
            "Id": $('#txtId').val(),
            "ThongBaoTitle": $('#txtThongBaoTitle').val(),
            "ThongBaoContent": editor.getData(),
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
        
function deleteData(id) {
    if (confirm('Bạn thật sự muốn xóa thông báo này?')) {
        $.ajax({
            url: "/api/thongbao/deleteThongBao",
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
    $("#txtThongBaoTitle").val('');
    editor.setData('');
    $("#txtThuTu").val('');
    $("#cmbActive option:first").attr('selected', 'selected');
    if (id > 0) {
        $.ajax({
            url: "/api/thongbao/admin_getThongBao",
            type: "POST",
            data: JSON.stringify({
                "Id": id,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#txtId').val(result.Id);
                $("#txtThongBaoTitle").val(result.ThongBaoTitle);
                editor.setData(result.ThongBaoContent);
                $('#txtThuTu').val(result.ThuTu);
                $('#cmbActive').val(result.Active ? 1 : 0);
            },
        });
    }
}

var editor = CKEDITOR.replace('txtThongBaoContent', {
    toolbar: 'Basic',
});
CKFinder.setupCKEditor(null, '/ckfinder');

