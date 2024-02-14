"use strict";
(function(){
    const token = localStorage.getItem('token');
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
                                    user_id = [];
                                    $.confirm({
                                        title: 'Eliminar usuarios seleccionados',
                                        content: 'se elimino todo los usuarios selecionados ',
                                    });
                                    $( "#select_all" ).prop('checked', false);
                                    $('#user-table').DataTable().ajax.reload();
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
            $.confirm({
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
                                    });
                                    user_id = [];
                                    $( "#select_all" ).prop('checked', false);
                                    $('#user-table').DataTable().ajax.reload();
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
            $.confirm({
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
                                    user_id = [];
                                    $.confirm({
                                        title: 'Desactiva usuario',
                                        content: 'Se desactivo todo los usuario selecionados ',
                                    });
                                    $( "#select_all" ).prop('checked', false);
                                    $('#user-table').DataTable().ajax.reload();
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
            $.confirm({
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
                targets : [7],
                render: function(data, type, row, meta){
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
DD
                }
            },
            {
                targets : [8],
                render: function(data, type, row, meta){
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                targets : [9]
                , "render": function (data, type, row, meta) {
                        
                let $html =  '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></button>';
                    $html +=  '<a class="btn bg-danger m-1 remove" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                    
                    if(row.is_active == 1){
                        $html +=  '<a class="btn bg-grey m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
                    }else{
                        $html +=  '<a class="btn bg-grey m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
                    }
                    // if(row.is_active == 1){
                    //     $html +=  '<a class="btn bg-grey m-1 desactivar" data-id="'+row.id+'"><i class="icon-reset"></i> Desactivar</a>';
                    // }else{
                    //     $html +=  '<a class="btn bg-grey m-1 activar" data-id="'+row.id+'"><i class="icon-reset"></i> Activar</a>';
                    // }
                    return $html;
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

    $('#user-table').on('click', '.open-EditbrandDialog ', function() {
        var url = "api/user/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        $("input[name='id']").val(id);
        $.get(url, function(data) {
            $("input[name='name']").val(data['name']);
            $("input[name='last_name']").val(data['last_name']);
            $("input[name='email']").val(data['email']);
            $("input[name='role_id']").val(data['role_id']);
            up_user_id = data['id'];
            console.log(up_user_id);
            

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
                                $.confirm({
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
                                $.confirm({
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
                                $.confirm({
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
            i+=num;
            if(i){
                var user_data = $(this).closest('tr').data('user');
                if(typeof(user_data) !== 'undefined'){
                    console.log(user_data);
                    user_id[i-1] = user_data.id;
                }
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

    $('form#new_user').validate({
        rules:{
            email: {
                required: true,
                email: true
            },
            password : {
                required : true,
            }
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid');
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        messages: {
            name:'name is requerid',
            last_name:'last name is requerid',
            password: {
                required : "password is requerid",
                
            },
            email: {
                required: "We need your email address to contact you",
                email: "Your email address must be in the format of name@domain.com"
            }
        }
    });

    $('#btn-password').bind("keyup", function(){
        ValidatePassword('#btn-password','#new_user');
    });

    $("form#update_user").validate({
        rules:{
            email: {
                required: true,
                email: true
            },
            // password : 'required'
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid');
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        // errorPlacement: function ( error, element ) {
        //     // Add the `invalid-feedback` class to the error element
        //     error.addClass("invalid-feedback");
        //     error.insertAfter(element);
        // },
        messages: {
            name:'The name is requerid',
            last_name:'The last name is requerid',
            password: "The password is requerid",
            email: {
                required: "We need your email address to contact you",
                email: "Your email address must be in the format of name@domain.com"
            }
        }
    });


    $('#btn-password-up').on('keyup', function(){
        ValidatePassword('#btn-password-up', '#update_user');
    });

    var url_user = url_path_user + '';
    // url_user = url_user.replace(':id', up_user_id);
    // console.log(up_user_id);
    var myDropzone1 = new Dropzone('div#imageUploadNewUser', {
        addRemoveLinks: true,
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 1,
        maxFilesize: 12,
        paramName: 'image',
        clickable: true,
        method: 'POST',
        url: url_user,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        renameFile: function(file) {
            var dt = new Date();
            var time = dt.getTime();
            return time + file.name;
        },
        acceptedFiles: ".jpeg,.jpg,.png,.gif",
        init: function () {
            var myDropzone = this;
            $('#submit-btn-create').on("click", function (e) {
                e.preventDefault();
                if ( $("#new_user").valid() && checked_validpass('#btn-password','#new_user')) {
                    tinyMCE.triggerSave();
                    if(myDropzone.getAcceptedFiles().length) {
                        myDropzone.processQueue();
                    }
                    else {
                        $.ajax({
                            type:'POST',
                            url:url_user,
                            data: $("#new_user").serialize(),
                            success:function(response){
                                $("input[name='id']").val('');
                                $("input[name='name']").val('');
                                $("input[name='last_name']").val('');
                                $("input[name='email']").val('');
                                $('.btn-close-modal').trigger('click');
                                $.confirm({
                                    title: 'Crear usuario',
                                    content: 'El usuario se ha creado con exito',
                                });
                              
                            },
                            error:function(response) {

                                if (response.status == 422) { 
                                    //toastError(err.responseJSON.message);
                                    let details = response.responseJSON.errors ;
                                    let content = '';
                                    Object.keys(details).forEach(field => {
                                        content += formatErrorUsingClassesAndPopover(field,details[field]);
                                    });

                                    $.alert({
                                        title: 'Error',
                                        content: content

                                    });
                                }
                            },
                        });
                    }
                }
            });

            this.on('sending', function (file, xhr, formData) {
                // Append all form inputs to the formData Dropzone will POST
                var data = $("#new_user").serializeArray();
                $.each(data, function (key, el) {
                    formData.append(el.name, el.value);
                });
            });
        },
        error: function (file, response) {
            if (response.status == 422) { 
                //toastError(err.responseJSON.message);
                let details = response.responseJSON.errors ;
                let content = '';
                Object.keys(details).forEach(field => {
                    content += formatErrorUsingClassesAndPopover(field,details[field]);
                });

                $.alert({
                    title: 'Error',
                    content: content

                });
            }
        },
        successmultiple: function (file, response) {
            $.confirm({
                title: 'Agregar usuario',
                content: 'El usuario se ha creado con exito',
            });
            //location.href = '../user';
            //console.log(file, response);
        },
        completemultiple: function (file, response) {
            console.log(file, response, "completemultiple");
        },
        reset: function () {
            console.log("resetFiles");
            this.removeAllFiles(true);
        }
    });

    $(".dropzone").sortable({
        items:'.dz-preview',
        cursor: 'grab',
        opacity: 0.5,
        containment: '.dropzone',
        distance: 20,
        tolerance: 'pointer',
        stop: function () {
          var queue = myDropzone1.getAcceptedFiles();
          newQueue = [];
          $('#imageUpload .dz-preview .dz-filename [data-dz-name]').each(function (count, el) {           
                var name = el.innerHTML;
                queue.forEach(function(file) {
                    if (file.name === name) {
                        newQueue.push(file);
                    }
                });
          });
          myDropzone1.files = newQueue;
        }
    });


    var url_user_up = url_path_user + '/:id';
    // url_user = url_user.replace(':id', up_user_id);
    // console.log(up_user_id);
    var myDropzone2 = new Dropzone('div#imageUpload', {
        addRemoveLinks: true,
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 1,
        maxFilesize: 12,
        paramName: 'image',
        clickable: true,
        method: 'POST',
        url: url_user_up,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        renameFile: function(file) {
            var dt = new Date();
            var time = dt.getTime();
            return time + file.name;
        },
        acceptedFiles: ".jpeg,.jpg,.png,.gif",
        init: function () {
            this.on("processing", function(file) {
                var url_user_up = url_path_user + '/:id';
                up_user_id = $("input[name='id']").val();
                url_user_up = url_user_up.replace(':id', up_user_id);
                this.options.url = url_user_up;
            });
            var myDropzone = this;
            $('#submit-btn').on("click", function (e) {
                e.preventDefault();
                if ( $("#update_user").valid() && checked_validpass('#btn-password-up', '#update_user')) {
                    tinyMCE.triggerSave();
                    if(myDropzone.getAcceptedFiles().length) {
                        myDropzone.processQueue();
                    }
                    else {
                        url_user_up = url_path_user + '/:id';
                        up_user_id = $("input[name='id']").val();
                        url_user_up = url_user_up.replace(':id', up_user_id);
                        console.log(url_user_up);
                        console.log(up_user_id);
                        $.ajax({
                            type:'POST',
                            url:url_user_up,
                            data: $("#update_user").serialize(),
                            success:function(response){
                                
                                $("input[name='id']").val('');
                                $("input[name='name']").val('');
                                $("input[name='last_name']").val('');
                                $("input[name='email']").val('');
                                //$('#editModal').modal('hide');
                                $('.btn-close-modal').trigger('click');
                                $.confirm({
                                    title: 'Actualizar usuario',
                                    content: 'El usuario se ha actualizado con exito',
                                });
                                //$('#editModal').modal({backdrop: false});
                                //$('.modal-backdrop').remove();
                                $('#user-table').DataTable().ajax.reload();

                                // location.href = '../user';
                            },
                            error:function(response) {
                                if (response.status == 422) { 
                                    //toastError(err.responseJSON.message);
                                    let details = response.responseJSON.errors ;
                                    let content = '';
                                    Object.keys(details).forEach(field => {
                                        content += formatErrorUsingClassesAndPopover(field,details[field]);
                                    });

                                    $.alert({
                                        title: 'Error',
                                        content: content

                                    });
                                }
                            },
                        });
                    }
                }
            });

            this.on('sending', function (file, xhr, formData) {
                // Append all form inputs to the formData Dropzone will POST
                var data = $("#update_user").serializeArray();
                $.each(data, function (key, el) {
                    formData.append(el.name, el.value);
                });
            });
        },
        error: function (file, response) {
            if (response.status == 422) { 
                //toastError(err.responseJSON.message);
                let details = response.responseJSON.errors ;
                let content = '';
                Object.keys(details).forEach(field => {
                    content += formatErrorUsingClassesAndPopover(field,details[field]);
                });

                $.alert({
                    title: 'Error',
                    content: content

                });
            }
        },
        successmultiple: function (file, response) {
            $.confirm({
                title: 'Actualizar usuario',
                content: 'El usuario se ha actualizado con exito',
            });
            location.href = '../user';
            //console.log(file, response);
        },
        completemultiple: function (file, response) {
            console.log(file, response, "completemultiple");
        },
        reset: function () {
            console.log("resetFiles");
            this.removeAllFiles(true);
        }
    });


    function formatErrorUsingClassesAndPopover(element , array_of_problems ){
        let someHTML = '';
        array_of_problems.forEach(function(e){someHTML+='<li>'+element +': '+ e+'</li>'});
        // $('#'+element+'_error_section').html('<ul>'+someHTML+'</ul>');
        // $('#'+element).addClass('is-invalid');

        return '<ul>'+someHTML+'</ul><br>';
    }

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
    
    $('#genbutton').on("click", function(){
      $.get("api/user/genpass", function(data){
        $("input[name='password']").val(data);

      });
    });

    $('#genbuttonup').on("click", function(){
      $.get("api/user/genpass", function(data){
        $("#btn-password-up").val(data);
      });
    });

    /*Actual validation function*/
    function ValidatePassword(input, form) {
        
        if(input == '#btn-password'){
            $('div.securty_pass_c').show();
   
        }else{
            $('div.securty_pass_u').show();
        }
        /*Array of rules and the information target*/
        var rules = [
            {
                Pattern: "[A-Z]",
                Target: "UpperCase"
            },
            {
                Pattern: "[a-z]",
                Target: "LowerCase"
            },
            {
                Pattern: "[0-9]",
                Target: "Numbers"
            },
            {
                Pattern: "[!@@#$%^&*]",
                Target: "Symbols"
            }
        ];

        //Just grab the password once
        var password = $(input).val();
        var form_ = $(form);

        /*Length Check, add and remove class could be chained*/
        /*I've left them seperate here so you can see what is going on */
        /*Note the Ternary operators ? : to select the classes*/
        form_.find("#Length").removeClass(password.length > 7 ? "glyphicon-remove" : "glyphicon-ok");
        form_.find("#Length").addClass(password.length > 7 ? "glyphicon-ok" : "glyphicon-remove");
        
        /*Iterate our remaining rules. The logic is the same as for Length*/
        for (var i = 0; i < rules.length; i++) {
            var match_pass = new RegExp(rules[i].Pattern).test(password);
            var remove_class = match_pass ? "glyphicon-remove" : "glyphicon-ok";
            var add_class = match_pass ? "glyphicon-ok" : "glyphicon-remove";
            var element = form_.find( "#" + rules[i].Target);
            $(element).removeClass(remove_class); 
            $(element).addClass(add_class);
        }

    }

    function checked_validpass(input, form){

        $(input).addClass('is-invalid');
        $(input).attr('aria-invalid', true);
        if(input !== '#btn-password'){
            var password = $(input).val();
            if(password.length == 0){
                $('div.securty_pass_u').hide();
                $(input).removeClass('is-invalid');
                $(input).attr('aria-invalid', false);
                return true;
            }
        }


        var form_ = $(form);

        if( form_.find("#Length").hasClass('glyphicon-remove')){
            return false;
        }

        if(form_.find("#UpperCase").hasClass('glyphicon-remove')){
            return false;
        }
        if(form_.find("#LowerCase").hasClass('glyphicon-remove')){
            return false;
        }
        if(form_.find("#Numbers").hasClass('glyphicon-remove')){
            return false;
        }
        if(form_.find("#Symbols").hasClass('glyphicon-remove')){
            return false;
        }

        $(input).removeClass('is-invalid');
        $(input).attr('aria-invalid', false);

        return true;

    }
})();
    