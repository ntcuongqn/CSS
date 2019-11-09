var mytable;
$(document).ready(function () {
    mytable = $('#myTable').DataTable({
        ajax: {
            url: "/api/News/genNewsAll?request=0",
            dataType: "JSON",
            "dataSrc": function (data) {
                return jQuery.parseJSON(data.Content);
            },
        },
        "ordering": false,
        "autoWidth": false,
        "deferRender": true,
        "processing": true,
        "pageLength": 10,
        "searchHighlight": true,
        "columns": [
            { "data": "STT" },
            { "data": "Title" },
            { "data": "NewsCategoryName" },
            { "data": "ThoiGian" },
            { "data": "PheDuyet" },
            { "data": "HienThi" },
            { "data": "Hot" },
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
                "targets": [5, 4, 6, 3],
                "className": "dt-center",
                render: function (data) {
                    return (data);
                }
            },
            {
                "targets": 7,
                "className": "dt-center",
                render: function (data) {
                    return '<a href="#" data-toggle="modal" data-target="#modalChiTiet" data-whatever="' + data + '"><i class="fa fa-edit text-blue" title="Biên tập"></i></a> || ' +
                        '<a href="javascript:void(0);" onclick="deleteData(' + data + ')" hosoid="' + data + '"><i class="fa fa-trash-o text-red" title="Xóa"></i></a>';;

                }
            },
        ],
        language: {
            processing: "<img src='/plugins/DataTables/DataTables/images/loading.gif'> đang tải...",
            "url": "/plugins/DataTables/DataTables/Vietnamese.txt",
            search: "_INPUT_",
            searchPlaceholder: "Nhập chuỗi cần tìm kiếm, dùng \"\" để tìm kiếm chính xác ..."
        },
        "oLanguage": {
            "sLengthMenu": "Hiển thị _MENU_ bài viết",
            "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bài viết",
            "oPaginate": {
                "sFirst": "Đầu",
                "sPrevious": "Trước",
                "sNext": "Tiếp",
                "sLast": "Cuối"
            }
        },
        "initComplete": function () {
            oninit();
        },
    });

    function oninit() {
        //them nut them moi vao been tren
        $("#divLoai").appendTo("#myTable_length");
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
            modal.find('#modalTitle').html("THÊM MỚI TIN BÀI");
            initForm(0);
        } else {
            var id = button.data('whatever');
            if (id > 0) {
                modal.find('#modalTitle').html("SỬA TIN BÀI");
                initForm(id);
            }
        }
    });

    $('#btnSave').click(function () {
        saveData();
    });
    loadNewsCategory();
    $('#cmbNewsCategory').change(function () {
        mytable.ajax.url('/api/News/genNewsAll?request=' + $(this).val()).load();
    });

    $('#btnFile').click(function () {
        $("#file").click();
    });

    $("input#file").on('change', function () {
        var data = new FormData($('form#formUpload')[0]);
        $.ajax({
            type: "POST",
            url: '/api/UploadFile/UploadFilesNews',
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            cache: false,
            data: data,
            success: function (data, textStatus, xhr) {
                if (data.fileName.length > 0) {
                    $('#imgNewsImage').attr("src", data.fileUrl);
                    $('#hidNewsImage').val(data.fileNameTime);
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
function loadNewsCategory() {
    $.get("/api/News/genNewsCategoryComboBox", function (result) {
        $('#cmbNewsCategory_Edit').empty();
        for (var i = 0; i < result.length; i++) {
            $('<option/>', {
                'value': result[i].Id,
                'text': result[i].TrangThai
            }).appendTo('#cmbNewsCategory_Edit');
        }

        $('#cmbNewsCategory').empty();
        $('#cmbNewsCategory').append($('<option>', { value: 0, text: 'Tất cả' }));
        for (var i = 0; i < result.length; i++) {
            $('<option/>', {
                'value': result[i].Id,
                'text': result[i].TrangThai
            }).appendTo('#cmbNewsCategory');
        }
    });
}
function deleteData(id) {
    if (confirm('Bạn thật sự muốn xóa bài viết này này?')) {
        $.ajax({
            url: "api/News/deleteNews",
            type: "POST",
            data: JSON.stringify({
                "Id": id,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                //alert(result);
                mytable.ajax.reload(null, false);
            },
        });
    }
}
function saveData() {
    $.ajax({
        url: "/api/News/insertUpdateNews",
        type: "POST",
        data: JSON.stringify({
            "Id": $('#txtId').val(),
            "NewsCategoryId": $('#cmbNewsCategory_Edit').val(),
            "Title": $('#txtTitle').val(),
            "Summary": $('#txtSummary').val(),
            "NewsContent": editor.getData(),
            "NewsImage": $('#hidNewsImage').val(),
            "NewsSource": $('#txtNewsSource').val(),
            //"Approved": $('#cmbApproved').val() == 1,
            "Display": $('#cmbDisplay').val() == 1,
            "Hot": $('#cmbHot').val(),
            "ThoiGian": $('#dtThoiGian').val(),
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

function initForm(id) {
    if (id == undefined) return;
    $('#txtId').val('');
    $('#cmbNewsCategory_Edit').val($('#cmbNewsCategory').val()),
    $('#txtTitle').val('');
    $("#txtSummary").val('');
    $("#dtThoiGian").val('');
    $("#txtNewsSource").val('');
    $("#hidNewsImage").val('');
    $('#imgNewsImage').attr('src', '/upload_img/noimages.jpg');
    editor.setData('');
    $("#cmbApproved option:first").attr('selected', 'selected');
    $("#cmbDisplay option:first").attr('selected', 'selected');
    $("#cmbHot option:first").attr('selected', 'selected');
    $("#cmbNewsCategory_Edit option:first").attr('selected', 'selected');

    if (id > 0) {
        $.ajax({
            url: "/api/News/getNews",
            type: "POST",
            data: JSON.stringify({
                "Id": id,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {

                $('#txtId').val(result.Id);
                $('#cmbNewsCategory_Edit').val(result.NewsCategoryId),
                $("#txtTitle").val(result.Title);
                $('#txtSummary').val(result.Summary);
                $("#dtThoiGian").val(result.ThoiGian);
                $("#txtNewsSource").val(result.NewsSource);
                $("#hidNewsImage").val(result.NewsImage);
                $('#imgNewsImage').attr('src', result.NewsImage.length == 0 ? '/upload_img/noimages.jpg' : '/upload_img/tintuc/' + result.NewsImage);
                editor.setData(result.NewsContent);
                $('#cmbApproved').val(result.Approved ? 1 : 0);
                $('#cmbDisplay').val(result.Display ? 1 : 0);
                $('#cmbHot').val(result.Hot);
            },
        });
    }
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        modal_this = this
        $(document).on('focusin.modal', function (e) {
            if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
                && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select')
                && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')
                && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_textarea')) {
                modal_this.$element.focus()
            }
        })
    };
}
var editor = CKEDITOR.replace('txtNewsContent', {
    toolbar: 'Basic',
});
CKFinder.setupCKEditor(null, '/ckfinder');

$('#dtThoiGian').datetimepicker({
    format: 'd/m/Y H:i'
});
