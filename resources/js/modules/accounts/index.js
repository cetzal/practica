(function(){
    var accounts_id = [];
    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $( "#from_accounts_search" ).on( "submit", function( event ) {
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

    $('.clear_form').on('click', function(e){
        $('#from_accounts_search')[0].reset();
        table.ajax.reload();
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    $('.open-modal-account').on('click', function(e) {
        e.preventDefault();
        $('form#new_accounts')[0].reset();
        // load_combobox("#suppliers_id");
    });

    var verific_checks_accounts = function(num){
        $(':checkbox:checked').each(function(i){
            var account_data = $(this).closest('tr').data('account-id');
            if (typeof(account_data) != "undefined") {
                accounts_id.push(account_data);
            }
            console.log('accounts', accounts_id);
        });
    }

    var table =  $('#accounts-table').DataTable({
        responsive: true,
        autoWidth : true,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax": {
            "url":  'api/accounts',
            "data": function(d) {
                var frm_data = $('form#from_accounts_search').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
            }
        },
        "createdRow": function( row, data, dataIndex ) {
            $(row).attr('data-account-id', data['id']);
        },
        'columns': [
            { 
                data: "check", 
                render: function (data, type, full, meta) {
                    return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes checkbox_client"><label></label></div>';
                }
            },
            {
                data: "name", 
                render : function(data, type, row, meta){
                    return row.name;
                }
            },
            {
                data : 'init_balance',
                render : function(data, type, row, meta){
                    return '$ '+parseFloat(row.init_balance).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
            {
                data : 'renueve',
                render : function(data, type, row, meta){
                    return '$ '+parseFloat(row.revenue).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
            {
                data : 'egress',
                render : function(data, type, row, meta){
                    return 0;
                }
            },
            {
                data : 'balance',
                render : function(data, type, row, meta){
                    return '$ '+parseFloat(row.balance).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
            { 
                data: "null", 
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
                data: "null", 
                render : function(data, type, row, meta){
                    return row.created_by;
                }
            },

            {
                data: "null", 
                render: function(data, type, row, meta){                    
                    if (row.created_at == null) {
                        return '';
                    }
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                data: "null", 
                render: function(data, type, row, meta){
                    if (row.updated_at == null) {
                        return '';
                    }
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                data: "null", 
                render: function (data, type, row, meta) {
                        
                    let html =  '<button type="button" class="open-EditAccountDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></button>';
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
        "columnDefs": [
            {
                    "orderable": false,
                    'targets': [0]
            }
        ],
        "order": [],
        'language': {
            'infoFiltered': ' - filtrado de _MAX_ registros en total',
            'lengthMenu': '_MENU_',
            "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
            "search":  '',
            'paginate': {
                    'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            }
        }, 
    });

    $('#accounts-table').on('click', '.open-EditAccountDialog ', function() {
        var url = "api/accounts/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        $("input[name='accounts_id']").val(id);
        $.get(url, function(response) {
            if(response.status == "success"){
                $("input[name='name']").val(response.data.name);
                $("input[name='init_balance']").val(response.data.init_balance);
                $("input[name='is_active']").prop( "checked", response.data.is_active );
            }
            
        });
    });

    $( "#select_all" ).on( "change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
    });

    $(".delete_all").on('click', function(e){
        e.preventDefault();
        accounts_id = [];
        verific_checks_accounts(0);
        if(accounts_id.length) {

            $.confirm({
                title: 'Eliminar cuentas',
                content: 'Realmente quieres eliminar las cuentas selecionadas',
                buttons: {
                    deleteUser: {
                        text: 'Si, eliminar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/accounts/all/deletebyselection',
                                data:{
                                    accountIdArray: accounts_id
                                },
                                success:function(data){
                                    console.log('data', data.messages);
                                    var messsage = 'Se elimino todas las cuentas selecionados';
                                    if (typeof data.messages != undefined) {
                                        messsage = data.messages;
                                    }
                                    $.confirm({
                                        title: 'Eliminar cuentas',
                                        content: messsage,
                                        buttons: {
                                            ok: function () {
                                                table.ajax.reload();
                                                $( "#select_all" ).prop('checked', false);
                                                $("tbody input[type='checkbox']").prop('checked', false);
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
                title: 'Eliminar cuentas',
                content: 'Seleccione las cuentas que deseas eliminar',
            });
        }
    });

    //Activar todas las marcas seleccionas
    $(".active_all").on('click', function(e){
        e.preventDefault();
        accounts_id = [];
        verific_checks_accounts(0);
        console.log ('active all', accounts_id);
        if(accounts_id.length) {
            $.confirm({
                title: 'Activar cuentas',
                content: 'Realmente quieres activar las cuentas selecionadas',
                buttons: {
                    deleteUser: {
                        text: 'Si, activar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/accounts/all/activatebyselection',
                                data:{
                                    accountIdArray: accounts_id
                                },
                                success:function(data){
                                    $.confirm({
                                        title: 'Activar cuentas',
                                        content: 'Se activo todas las cuentas selecionadas',
                                        buttons: {
                                            ok: function () {
                                                table.ajax.reload();
                                                $( "#select_all" ).prop('checked', false);
                                                $("tbody input[type='checkbox']").prop('checked', false);
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
                title: 'Activar cuentas',
                content: 'Seleccione las cuentas que deseas activar',
            });
        }
    });

    // Desactivas todas las marcas seleccionadas
    $(".desactive_all").on('click', function(e){
        e.preventDefault();
        accounts_id = [];
        verific_checks_accounts(0);
        
        if(accounts_id.length) {
            $.confirm({
                title: 'Desactivar cuentas',
                content: 'Realmente quieres desactivar las cuentas selecionadas',
                buttons: {
                    deleteUser: {
                        text: 'Si, desactivar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/accounts/all/deactivatebyselection',
                                data:{
                                    accountIdArray: accounts_id
                                },
                                success:function(data){
                                    $.confirm({
                                        title: 'Desactivar cuentas',
                                        content: 'Se desactivo todas las cuentas selecionadas ',
                                        buttons: {
                                            ok: function () {
                                                $( "#select_all" ).prop('checked', false);
                                                table.ajax.reload();
                                                $("tbody input[type='checkbox']").prop('checked', false);
                                                // $('#brand-table').DataTable().ajax().reload();
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
                title: 'Desactivar cuentas',
                content: 'Seleccione las cuentas que deseas desactivar',
            });
        }
    });
    
    $('#accounts-table').on('click', '.remove ', function() {
        var url = "api/accounts/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        var Jquery = $.Jquery;
        console.log('delete ciuenta', url);
        $.confirm({
            title: 'Delete cuenta?',
            content: 'Realmente quieres eliminar la cuenta',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'delete cuentas',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            success: function(response) {
                                $.confirm({
                                    title: response.status,
                                    content: response.message,
                                    buttons: {
                                        ok: function () {
                                            table.ajax.reload();
                                        }
                                    }
                                });
                                // table.ajax.reload();
                            }
                        });
                    }
                },
                cancelAction: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });

    $('#accounts-table').on('click', '.desactivar ', function() {
        var url = "api/accounts/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/deactivate");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Descativar cuenta?',
            content: 'Realmente quieres desactivar la cuenta',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'desactivar cuenta',
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
                cancelAction: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });

    $('#accounts-table').on('click', '.activar ', function() {
        var url = "api/accounts/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/activate");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Activar cuenta?',
            content: 'Realmente quieres activar la cuenta',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'activar cuenta',
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
                cancelAction: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });
})();