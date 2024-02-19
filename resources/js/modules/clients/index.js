(function(){
    var clients_id = [];
    var module = 'clients';
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
    $('input[name="date_range"]').on('apply.daterangepicker', function(ev, picker) {
        
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });


   var table =  $('#clients-data-table').DataTable({
        responsive: true,
        autoWidth : true,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        //"ajax" : "",
        "ajax": {
            "url":  'api/clients',
           
            "data": function(d) {
                var frm_data = $('form#from_search_client').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
            }
        },
        "createdRow": function( row, data, dataIndex ) {
                $(row).addClass('client-link');
                $(row).attr('data-client', JSON.stringify(data));
        },
        'columns': [
            { 
                data: "text", "render": function (data, type, full, meta) {
                        return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes checkbox_client"><label></label></div>';
                    }
            }
        ],
        "columnDefs": [
            {
                    "orderable": false,
                    'targets': [0]
            },
            {
                targets : [1],
                render : function(data, type, row, meta){
                    return row.name;
                }
            },
            { 
                targets : [2],
                render: function (data, type, row, meta) {
                    var is_active = row.is_active == 1 ? 'Activo' : 'Desactivado';
                    var class_text = "text-success";
                    if (row.is_active == 0) {
                        class_text = "text-warning";
                    }
                    data = '<span class="'+ class_text +'">'+ is_active +'</span>';
                    return data;
                }
            },

            {
                targets : [3],
                render : function(data, type, row, meta){
                    return row.created_by;
                }
            },

            {
                targets : [4],
                render: function(data, type, row, meta){                    
                    if (row.created_at == null) {
                        return '';
                    }
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                targets : [5],
                render: function(data, type, row, meta){
                    if (row.updated_at == null) {
                        return '';
                    }
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                targets : [6],
                render: function (data, type, row, meta) {
                        
                    let html =  '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></button>';
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
    });

    $('#clients-data-table').on('click', '.redirect-record-log', function() {
        let record_id = $(this).data('record-id').toString();
        let record_name = $(this).data('record-name').toString();
        window.location.href = window.location.origin +'/log-record/'+record_id+'?record_name='+record_name+'&module_name='+module;
    });

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    $( "#from_search_client" ).on( "submit", function( event ) {
        event.preventDefault();
        var date_range = $('#date_range').val();
        var type_fecha = $('.client-select-date').val();
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

    $('.clear_form_client').on('click', function(e){
        $('#from_search_client')[0].reset();
        table.ajax.reload();
    });

    $('#clients-data-table').on('click', '.open-EditbrandDialog ', function() {
        var url = "api/clients/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        $("input[name='client_id']").val(id);
        $.get(url, function(response) {
            if(response.status == "success"){
                $("input[name='name']").val(response.data.name);
                
                $("input[name='is_active']").prop( "checked", response.data.is_active );
            }
            
        });
    });

    $('#clients-data-table').on('click', '.remove ', function(e) {
        e.preventDefault();
        var url = "api/clients/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Eliminar clientes',
            content: 'Realmente quieres eliminar el cliente',
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

    $('#clients-data-table').on('click', '.desactivar ', function(e) {
        e.preventDefault();
        var url = "api/clients/{id}/deactivate"
        var id = $(this).data('id').toString();
        url = url.replace(/{id}/g, id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Desactivar clientes',
            content: 'Realmente quieres desactivar el cliente',
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

    $('#clients-data-table').on('click', '.activar ', function(e) {
        e.preventDefault();
        var url = "api/clients/{id}/activate"
        var id = $(this).data('id').toString();
        url = url.replace(/{id}/g, id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Activar clientes',
            content: 'Realmente quieres activar el cliente',
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

    $( "#select_all" ).on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
        clients_id = [];
        verific_checks_users(0);
    });

    $('#clients-data-table').on('click', "tbody input[type='checkbox']", function(e) {
        if (!$(this).is(":checked")) { //If the checkbox is checked
            clients_id = [];
        }
        verific_checks_users(1);
        
    });

    var verific_checks_users = function(num){
        $(':checkbox.checkbox_client:checked').each(function(i){
            var client_data = $(this).closest('tr').data('client');
            if(typeof(client_data) !== 'undefined'){
                clients_id[i] = client_data.id;
            }
        });
    }

    $(".delete_all_client").on('click', function(e){
        e.preventDefault();
        
        if(clients_id.length) {
            $.confirm({
                title: 'Eliminar clientes',
                content: 'Realmente quieres eliminar los usarios selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, eliminar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/clients/all/deletebyselection',
                                data:{
                                    clientsIdArray: clients_id
                                },
                                success:function(data){
                                    clients_id = [];
                                    $.alert({
                                        title: 'Eliminar clientes seleccionados',
                                        content: 'se elimino todo los clientes selecionados ',
                                    });
                                    $( "#select_all" ).prop('checked', false);
                                    $('#clients-data-table').DataTable().ajax.reload();
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
                title: 'Eliminar clientes',
                content: 'Selecciones los clientes que deseas eliminar',
            });
        }
    });
    $(".active_all_client").on('click', function(e){
        e.preventDefault();
        if(clients_id.length) {
            $.confirm({
                title: 'Activar clientes',
                content: 'Realmente quieres Activar los clientes selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, activar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/clients/all/activarbyselection',
                                data:{
                                    clientsIdArray: clients_id
                                },
                                success:function(data){
                                    $.alert({
                                        title: 'Activar clientes',
                                        content: 'se activado todo los clientes selecionados ',
                                    });
                                    clients_id = [];
                                    $( "#select_all" ).prop('checked', false);
                                    $('#clients-data-table').DataTable().ajax.reload();
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
                title: 'Activar clientes',
                content: 'Selecciones los clientes que deseas activar',
            });
        }
    });
    $(".desactive_all_client").on('click', function(e){
        e.preventDefault();
        if(clients_id.length) {

            $.confirm({
                title: 'Desactivar clientes',
                content: 'Realmente quieres desactivar los clientes selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, activar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/clients/all/deactivatebyselection',
                                data:{
                                    clientsIdArray: clients_id
                                },
                                success:function(data){
                                    clients_id = [];
                                    $.alert({
                                        title: 'Desactiva clientes',
                                        content: 'Se desactivo todo los clientes selecionados ',
                                    });
                                    $( "#select_all" ).prop('checked', false);
                                    $('#clients-data-table').DataTable().ajax.reload();
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
                title: 'Desactivar clientes',
                content: 'Selecciones los clientes que deseas desactivar',
            });
        }
    });

     //Cerrar los modales de update or create
     $('.bt-close-modal').on('click', function(e){
        $("input[name='name']").val('');
        $('form#new_client')[0].reset();
        $('form#update_client')[0].reset();
        $("form#new_client").find("#btn-password").removeClass('is-invalid');
        $("form#new_client").find("#btn-password").attr('aria-invalid', false);
        $("form#update_client").find("#btn-password-up").removeClass('is-invalid');
        $("form#update_client").find("#btn-password-up").attr('aria-invalid', false);
    });
    $('.btn-close-modal').on('click', function(e){
        $("input[name='name']").val('');
        $('form#new_client')[0].reset();
        $('form#update_client')[0].reset();
        $("form#new_client").find("#btn-password").removeClass('is-invalid');
        $("form#new_client").find("#btn-password").attr('aria-invalid', false);
        $("form#update_client").find("#btn-password-up").removeClass('is-invalid');
        $("form#update_client").find("#btn-password-up").attr('aria-invalid', false);
    });

    $('#createModal').on('show.bs.modal', function (event) {
        // Encuentra el formulario dentro del modal y limpia los campos
        $(this).find('form')[0].reset();
    });

    
})();



