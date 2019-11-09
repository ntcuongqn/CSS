var mytable;
$(document).ready(function () {
    mytable = $('#myTable').DataTable({
        ajax: {
            url: "/api/sanpham/admin_getDanhSachSanPham",
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
            { "data": "SanPhamTitle" },
            { "data": "SanPhamDesc" },
            { "data": "SanPhamImage" },
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
                "targets": [1,2],
                "className": "dt-left",
                render: function (data) {
                    return data;
                }
            },
            {
                "targets": [3],
                "className": "dt-center",
                render: function (data) {
                    return '<img src="' + data + '" style="width:53px" />';
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
                    return data?'Hiển thị':'Không hiển thị';
                }
            },
            {
                "targets": 6,
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
            modal.find('#modalTitle').html("THÊM MỚI SẢN PHẨM");
            initForm(0);
        } else {
            var id = button.data('whatever');
            if (id > 0) {
                modal.find('#modalTitle').html("SỬA THÔNG TIN SẢN PHẨM");
                initForm(id);
            }
        }
    });   
    

    $('#btnSave').click(function () {
        saveData();
    });

    $('#btnFile').click(function () {
        $("#file").click();
    });

    $("input#file").on('change', function () {
        var data = new FormData($('form#formUpload')[0]);
        data.append("sanpham", $('#hidLoai').val());
        $.ajax({
            type: "POST",
            url: '/api/Upload/UploadImage',
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            success: function (data, textStatus, xhr) {
                if (data.fileName.length > 0) {
                    $('#imgSanPhamImage').attr("src", data.fileUrl);
                    $('#hidSanPhamImage').val(data.fileNameTime);
                } else if (data.fileDesc.length > 0) {
                    alert(data.fileDesc);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            }
        });
    });
});

function saveData() {
    $.ajax({
        url: "/api/sanpham/insertUpdateSanPham",
        type: "POST",
        data: JSON.stringify({
            "Id": $('#txtId').val(),
            "SanPhamTitle": $('#txtSanPhamTitle').val(),
            "SanPhamDesc": $('#txtSanPhamDesc').val(),
            "SanPhamImage": $('#hidSanPhamImage').val(),
            "SanPhamContent": editor.getData(),
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
    if (confirm('Bạn thật sự muốn xóa sản phẩm này?')) {
        $.ajax({
            url: "/api/sanpham/deleteSanPham",
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
    $("#txtSanPhamTitle").val('');
    $("#txtSanPhamDesc").val('');
    editor.setData('');
    $("#hidSanPhamImage").val('');
    $('#imgSanPhamImage').attr('src', '/upload_img/noimages.jpg');
    $("#txtThuTu").val('');
    $("#cmbActive option:first").attr('selected', 'selected');
    $("#file").val(null);
    if (id > 0) {
        $.ajax({
            url: "/api/sanpham/admin_getSanPham",
            type: "POST",
            data: JSON.stringify({
                "Id": id,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#txtId').val(result.Id);
                $("#txtSanPhamTitle").val(result.SanPhamTitle);
                $("#txtSanPhamDesc").val(result.SanPhamDesc);
                editor.setData(result.SanPhamContent);
                $("#hidSanPhamImage").val(result.SanPhamImage);
                $('#imgSanPhamImage').attr('src', result.SanPhamImage);
                $('#txtThuTu').val(result.ThuTu);
                $('#cmbActive').val(result.Active ? 1 : 0);
            },
        });
    }
}

var editor = CKEDITOR.replace('txtSanPhamContent', {
    toolbar: 'Basic',
});
CKFinder.setupCKEditor(null, '/ckfinder');

