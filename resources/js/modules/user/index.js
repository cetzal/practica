(function() {
    const token = localStorage.getItem('token');
    var module = 'users';
    var user_id = [];
    var url_path_user = 'api/user';
    $('div.securty_pass_c').hide();
    $('div.securty_pass_u').hide();
    let up_user_id = $("input[name='id']").val();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $( "#date_range" ).daterangepicker({
        maxDate : moment().endOf(),
        showApplyButton: false,
        autoApply: true,
        showInputs: false,
        maxDate: "0",
        locale: {
            format: 'DD/MM/YYYY',
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
        },
        todayHighlight: true,
        autoUpdateInput: false,
    });

    $( "#date_update" ).daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        },
        todayHighlight: true,
        autoUpdateInput: false,
    });

    $('input[name="date_range"]').on('apply.daterangepicker', function(ev, picker) {
        
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('input[name="date_range"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    $('input[name="date_update"]').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('input[name="date_update"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    //dropzone portion
    Dropzone.autoDiscover = false;

   
    $(".delete_all_user").on('click', function(e){
        e.preventDefault();
        
        if(user_id.length) {
            $.confirm({
                title: 'Eliminar usuarios',
                content: 'Realmente quieres eliminar los usarios selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, eliminar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/user/all/deletebyselection',
                                data:{
                                    userIdArray: user_id
                                },
                                success:function(data){
                                    $.confirm({
                                        title: 'Eliminar usuarios seleccionados',
                                        content: 'se elimino todo los usuarios selecionados ',
                                        buttons: {
                                            ok:function() {
                                                user_id = [];
                                                $( "#select_all").prop('checked', false);
                                                $('#user-table').DataTable().ajax.reload();
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    cancelar: function () {
                        // $.alert('action is canceled');
                    }
                }
            });
        }else{
            $.alert({
                title: 'Eliminar usuario',
                content: 'Selecciones los usuario que deseas eliminar',
            });
        }
    });
    $(".active_all_user").on('click', function(e){
        e.preventDefault();
        if(user_id.length) {
            $.confirm({
                title: 'Activar usuarios',
                content: 'Realmente quieres Activar los usarios selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, activar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/user/all/activatebyselection',
                                data:{
                                    userIdArray: user_id
                                },
                                success:function(data){
                                    $.confirm({
                                        title: 'Activar usuario',
                                        content: 'se activado todo los usuario selecionados ',
                                        buttons: {
                                            ok:function() {
                                                user_id = [];
                                                $( "#select_all" ).prop('checked', false);
                                                $('#user-table').DataTable().ajax.reload();
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    cancelar: function () {
                        // $.alert('action is canceled');
                    }
                }
            });
            
        }else{
            $.alert({
                title: 'Activar usuario',
                content: 'Selecciones los usuario que deseas activar',
            });
        }
    });
    $(".desactive_all_user").on('click', function(e){
        e.preventDefault();
        if(user_id.length) {

            $.confirm({
                title: 'Desactivar usuarios',
                content: 'Realmente quieres desactivar los usarios selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, activar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/user/all/deactivatebyselection',
                                data:{
                                    userIdArray: user_id
                                },
                                success:function(data){
                                    $.confirm({
                                        title: 'Desactiva usuario',
                                        content: 'Se desactivo todo los usuario selecionados ',
                                        buttons: {
                                            ok:function() {
                                                user_id = [];
                                                $( "#select_all" ).prop('checked', false);
                                                $('#user-table').DataTable().ajax.reload();
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    cancelar: function () {
                        // $.alert('action is canceled');
                    }
                }
            });
            
        }else{
            $.alert({
                title: 'Desactivar usuario',
                content: 'Selecciones los usuario que deseas desactivar',
            });
        }
    });

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    var table = $('#user-table').DataTable( {
        responsive: true,
        autoWidth : true,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        //"ajax" : "",
        "ajax": {
            "url": url_path_user + '/list',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            "data": function(d) {
                var frm_data = $('form#from_search').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
            }
        },
        "createdRow": function( row, data, dataIndex ) {
                $(row).addClass('user-link');
                $(row).attr('data-user', JSON.stringify(data));
        },
        'columns': [
            { 
                data: "text", "render": function (data, type, full, meta) {
                        return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes checkbox_user"><label></label></div>';
                    }
            },
            { data: 'name' },
            { data: 'last_name' },
            { data: 'picture' , "render": function (data, type, row, meta) {
                var _picture = 'avarat.png';
                    if(row.picture != null){
                        let _pictures = row.picture.split(",");
                        _picture = _pictures[_pictures.length - 1];
                        _picture = escapeHtml(_picture);
                       
                    }
                   
                    return '<img src="public/images/user/'+_picture+'" height="80" width="80">';
                }
            },
            { data: 'email' },
            { data: 'role_name' , "render": function (data, type, full, meta) {
                        return full.role_name;
                        // return full.role_id == 1 ? 'ADMIN' : 'CUSTOMER';
                    }
            },
            { data: 'status' , "render": function (data, type, full, meta) {
                var is_active = full.is_active == 1 ? 'Activo' : 'Desactivado';
                var class_text = "text-success";
                if (full.is_active == 0) {
                    class_text = "text-warning";
                }
                data = '<span class="'+ class_text +'">'+ is_active +'</span>';
                return data;
                }
            },
           
        ],
        "columnDefs": [
            {
                    "orderable": false,
                    'targets': [0, 3]
            },
            { targets: [1], className: "text-center"},
            {targets: [0, 1, 2, 3], searchable: false},
            {
                targets: [7],
                render : function(data, type, row, meta){
                    return row.user_parent_name;
                }
            },
            {
                targets : [8],
                render: function(data, type, row, meta){                    
                    if (row.created_at == null) {
                        return '';
                    }
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
DD
                }
            },
            {
                targets : [9],
                render: function(data, type, row, meta){
                    if (row.updated_at == null) {
                        return '';
                    }
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                targets : [10]
                , "render": function (data, type, row, meta) {
                        
                let html =  '<button type="button" class="open-EditUserDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></button>';
                    html +=  '<a class="btn bg-danger m-1 remove" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                    html +=  '<a href="#" class="btn bg-primary btn-sm redirect-record-log" data-record-id="'+row.id+'" data-record-name="'+row.name+'"><i class="fa fa-eye" aria-hidden="true"></i></a>';

                    if(row.is_active == 1){
                        html +=  '<a class="btn bg-grey m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
                    }else{
                        html +=  '<a class="btn bg-grey m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
                    }
                    
                    return html;
                 }
            },
        ],
        "order": [],
        'language': {
            'lengthMenu': '_MENU_',
            "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
            "search":  '',
            'paginate': {
                    'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            }
        }, 
    } );

    $('#user-table').on('click', '.redirect-record-log', function() {
        let record_id = $(this).data('record-id').toString();
        let record_name = $(this).data('record-name').toString();
        window.location.href = window.location.origin +'/log-record/'+record_id+'?record_name='+record_name+'&module_name='+module;
    });

    $( "#from_search" ).on( "submit", function( event ) {
        event.preventDefault();
        var date_range = $('#date_range').val();
        var type_fecha = $('.user-select-date').val();
        if(type_fecha=='' && date_range !== ''){
            $.alert({
                title: 'Filtra datos',
                content:'Selecione un tipo de fecha a consultar',
            });

            return '';
        }

        if(date_range == '' && type_fecha !== ''){
            $.alert({
                title: 'Filtra datos',
                content:'Selecione el rango de fecha',
            });

            return '';
        }

        table.ajax.reload();
    });

    $('.clear_form_user').on('click', function(e){
        $('#from_search')[0].reset();
        table.ajax.reload();
    });

    $('#user-table').on('click', '.open-EditUserDialog ', function() {
        var url = "api/user/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        $("input[name='id']").val(id);
        $.get(url, function(data) {
            console.log('get user', data);
            $("input[name='name']").val(data['name']);
            $("input[name='last_name']").val(data['last_name']);
            $("input[name='email']").val(data['email']);
            $("select[name='role_id']").val(data['role_id']);
            up_user_id = data['id'];
        });
    });

    $('#user-table').on('click', '.remove ', function() {
        var url = "api/user/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Eliminar usuarios',
            content: 'Realmente quieres eliminar el usuario',
            buttons: {
                deleteUser: {
                    text: 'Si, eliminar',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            success: function(response) {
                                $.alert({
                                    title: response.status,
                                    content: response.message,
                                });
                                table.ajax.reload();
                            }
                        });
                    }
                },
                cancelar: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });

    $('#user-table').on('click', '.desactivar ', function() {
        var url = "api/user/{id}/deactivate"
        var id = $(this).data('id').toString();
        url = url.replace(/{id}/g, id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Desactivar usuario',
            content: 'Realmente quieres desactivar el usuario',
            buttons: {
                deleteUser: {
                    text: 'Si, desactivar',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'PUT',
                            success: function(response) {
                                $.alert({
                                    title: response.status,
                                    content: response.message,
                                });
                                table.ajax.reload();
                            }
                        });
                    }
                },
                cancelar: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });

    $('#user-table').on('click', '.activar ', function() {
        var url = "api/user/{id}/activate"
        var id = $(this).data('id').toString();
        url = url.replace(/{id}/g, id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Activar usuario',
            content: 'Realmente quieres activar el usuario',
            buttons: {
                deleteUser: {
                    text: 'Si, activar',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'PUT',
                            success: function(response) {
                                $.alert({
                                    title: response.status,
                                    content: response.message,
                                });
                                table.ajax.reload();
                            }
                        });
                    }
                },
                cancelar: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });


    $( "#user-table #select_all" ).on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
        user_id = [];
        verific_checks_users(0);
    });

    $('#user-table').on('click', "tbody input[type='checkbox']", function(e) {
        if (!$(this).is(":checked")) { //If the checkbox is checked
            user_id = [];
        }
        verific_checks_users(1);
        
    });

    $('.bt-close-modal').on('click', function(e){
        $("input[name='name']").val('');
        $("input[name='last_name']").val('');
        $("input[name='email']").val('');
        $('div.securty_pass_c').hide();
        $('div.securty_pass_u').hide();
        $('form#new_user')[0].reset();
        $('form#update_user')[0].reset();
        $("form#new_user").find("#btn-password").removeClass('is-invalid');
        $("form#new_user").find("#btn-password").attr('aria-invalid', false);
        $("form#update_user").find("#btn-password-up").removeClass('is-invalid');
        $("form#update_user").find("#btn-password-up").attr('aria-invalid', false);
    });

    $('.btn-close-modal').on('click', function(e){
        $("input[name='name']").val('');
        $("input[name='last_name']").val('');
        $("input[name='email']").val('');
        $('div.securty_pass_c').hide();
        $('div.securty_pass_u').hide();
        $('form#new_user')[0].reset();
        $('form#update_user')[0].reset();
        $("form#new_user").find("#btn-password").removeClass('is-invalid');
        $("form#new_user").find("#btn-password").attr('aria-invalid', false);
        $("form#update_user").find("#btn-password-up").removeClass('is-invalid');
        $("form#update_user").find("#btn-password-up").attr('aria-invalid', false);
    });


    var verific_checks_users = function(num){
        $(':checkbox.checkbox_user:checked').each(function(i){
            var user_data = $(this).closest('tr').data('user');
            if(typeof(user_data) !== 'undefined'){
                user_id.push(user_data.id);
            }
        });
    }

    jQuery.validator.setDefaults({
        errorPlacement: function (error, element) {
            if(error.html() == 'Select Category...')
                error.html('This field is required.');
            $(element).closest('div.form-group').find('.validation-msg').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('div.form-group').removeClass('has-success').addClass('has-error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('div.form-group').removeClass('has-error').addClass('has-success');
            $(element).closest('div.form-group').find('.validation-msg').html('');
        }
    });

    

    $('#show_pass').on("click", function(){
      
        if($(this).hasClass('show_p')) { 
            $(this).removeClass('show_p');
            $(this).addClass('hiden_p');
            $(this).html('<i class="fa fa-eye-slash" aria-hidden="true"></i>');
            $('#btn-password').attr('type', 'text');
        }else{
            $(this).removeClass('hiden_p');
            $(this).addClass('show_p');
            $(this).html('<i class="fa fa-eye" aria-hidden="true"></i>')
            $('#btn-password').attr('type', 'password');
        }
    });

    $('#show_passpu').on("click", function(){
      
        if($(this).hasClass('show_pu')) { 
            $(this).removeClass('show_pu');
            $(this).addClass('hiden_p');
            $(this).html('<i class="fa fa-eye-slash" aria-hidden="true"></i>');
            $('#btn-password-up').attr('type', 'text');
        }else{
            $(this).removeClass('hiden_p');
            $(this).addClass('show_pu');
            $(this).html('<i class="fa fa-eye" aria-hidden="true"></i>')
            $('#btn-password-up').attr('type', 'password');
        }
    });

    function formatErrorUsingClassesAndPopover(element , array_of_problems ){
        let someHTML = '';
        array_of_problems.forEach(function(e){someHTML+='<li>'+element +': '+ e+'</li>'});
        // $('#'+element+'_error_section').html('<ul>'+someHTML+'</ul>');
        // $('#'+element).addClass('is-invalid');

        return '<ul>'+someHTML+'</ul><br>';
    }

    
})();