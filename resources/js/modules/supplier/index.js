(function() {
    var supplier_ids = [];
    var module = 'suppliers';
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $( "#range_date" ).daterangepicker({
        maxDate : moment().endOf(),
        showApplyButton: false,
        autoApply: true,
        showInputs: false,
        locale: {
            format: 'DD/MM/YYYY'
        },
        todayHighlight: true,
        autoUpdateInput: false,
    });

    $('input[name="range_date"]').on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('input[name="range_date"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    $( "#select_all" ).on( "change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
    });

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    var table = $('#supplier-table').DataTable( {
        responsive: false,
        autoWidth : false,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax" : {
            "url": "api/suppliers",
            "data": function(d) {
                var frm_data = $('form#from_search_supplier').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
                console.log('frmdata', frm_data);
            }
        },
        "order": [],
        'language': {
            'infoFiltered': ' - filtrado de _MAX_ registros en total',
            'lengthMenu': '_MENU_',
             "info":      ' _START_ - _END_ (_TOTAL_)</small>',
            "search":  '',
            'paginate': {
                'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            }
        },
        'createdRow': function(row, data, dataIndex) {
            $(row).attr('data-supplier-id', data['id']);
        },
        'columnDefs': [
            {
                "orderable": false,
                'targets': [0]
            },
            {
                'render': function(data, type, row, meta){
                    data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
                   return data;
                },
                'targets': [0],
                'checkboxes': {
                   'selectRow': true,
                   'selectAllRender': '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>'
                },
            },
            {
                'render': function(data, type, row, meta){
                   return row.name;
                },
                'targets': [1]
            },
            {
                'render': function(data, type, row, meta){
                   return row.total_brands;
                },
                'targets': [2]
            },
            {
                'render': function(data, type, row, meta){
                    is_active = row.is_active == 1 ? 'Activo' : 'Desactivado';
                    class_text = "text-success";
                    if (row.is_active == 0) {
                        class_text = "text-warning"
                    }
                    data = '<span class="'+ class_text +'">'+ is_active +'</span>'
                    return data;
                },
                'targets': [3]
            },
            {
                'render': function(data, type, row, meta){
                    return row.created_by;
                },
                'targets': [4]
            },
            {
                'render': function(data, type, row, meta){
                    if (row.created_at == null) {
                        return '';
                    }
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
                },
                'targets': [5]
            },
            {
                'render': function(data, type, row, meta){
                    if (row.updated_at == null) {
                        return '';
                    }
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                },
                'targets': [6]
            },
            {
                'render': function(data, type, row, meta) {
                    let html =  '<a href="#" class="btn bg-success btn-sm open-EditSupplierDialog" data-id="'+row.id+'"  data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></a>';
                    html +=  '<a class="btn bg-danger m-1 remove btn-sm" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                    html +=  '<a href="#" class="btn bg-primary btn-sm redirect-record-log" data-record-id="'+row.id+'" data-record-name="'+row.name+'"><i class="fa fa-eye" aria-hidden="true"></i></a>';
                    if(row.is_active == 1){
                        html +=  '<a class="btn m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
                    }else{
                        html +=  '<a class="btn m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
                    }
                    return html;
                
                },
                'targets': [7]
            },
            { targets: [1], className: "text-center"},
            {targets: [0, 1, 2, 3], searchable: false}
        ],
        // 'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
    } );

    $('#supplier-table').on('click', '.redirect-record-log', function(e) {
        e.preventDefault();
        let record_id = $(this).data('record-id').toString();
        let record_name = $(this).data('record-name').toString();
        // window.location.href = window.location.origin +'/log-record/'+record_id+'?record_name='+record_name+'&module_name='+module;
        window.open(window.location.origin +'/log-record/'+record_id+'?record_name='+record_name+'&module_name='+module, '_blank');
    });

    $(".delete_all").on('click', function(e){
        e.preventDefault();
        supplier_ids = [];
        verific_checks_supplier(0);
        console.log('suppliers', supplier_ids);
        if(supplier_ids.length > 0) {
            $.confirm({
                title: 'Eliminar proveedrores',
                content: 'Realmente quieres eliminar los proveedores selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, eliminar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/suppliers/all/deletebyselection',
                                data:{
                                    supplierIdArray: supplier_ids
                                },
                                success:function(data){
                                    console.log('data', data.message);
                                    var messsage = 'Se elimino todo los proveedores selecionados';
                                    if (typeof(data.message) != 'undefined') {
                                        messsage = data.message;
                                    }
                                    $.confirm({
                                        title: 'Eliminar proveedores',
                                        content: messsage,
                                        buttons: {
                                            ok: function () {
                                                table.ajax.reload();
                                                $("table input[type='checkbox']").prop('checked', false);
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
                title: 'Eliminar proveedores',
                content: 'Seleccione los proveedores que deseas eliminar',
            });
        }
    });

    //Activar todas las proveedores seleccionas
    $(".active_all").on('click', function(e){
        e.preventDefault();
        supplier_ids = [];
        verific_checks_supplier(0);
        if(supplier_ids.length > 0) {
            $.confirm({
                title: 'Activar proveedrores',
                content: 'Realmente quieres activar los proveedores selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, activar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/suppliers/all/activatebyselection',
                                data:{
                                    supplierIdArray: supplier_ids
                                },
                                success:function(data){
                                    $.confirm({
                                        title: 'Activar proveedores',
                                        content: 'Se activo todo los proveedores selecionados ',
                                        buttons: {
                                            ok: function () {
                                                table.ajax.reload();
                                                $("table input[type='checkbox']").prop('checked', false);
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
                title: 'Activar proveedores',
                content: 'Seleccione los proveedores que deseas activar',
            });
        }
    });

    // Desactivas todas las prvoeedores seleccionadas
    $(".desactive_all").on('click', function(e){
        e.preventDefault();
        supplier_ids = [];
        verific_checks_supplier(0);
        if(supplier_ids.length > 0) {
            $.confirm({
                title: 'Desactivar proveedrores',
                content: 'Realmente quieres desactivar los proveedores selecionados',
                buttons: {
                    deleteUser: {
                        text: 'Si, desactivar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/suppliers/all/deactivatebyselection',
                                data:{
                                    supplierIdArray: supplier_ids
                                },
                                success:function(data){
                                    $.confirm({
                                        title: 'Desactivar proveedores',
                                        content: 'Se desactivo todas los proveedores selecionados ',
                                        buttons: {
                                            ok: function () {
                                                table.ajax.reload();
                                                $("table input[type='checkbox']").prop('checked', false);
                                                
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
                title: 'Desactivar proveedores',
                content: 'Seleccione los proveedores que deseas desactivar',
            });
        }
    });

    $('#supplier-table').on('click', '.remove ', function() {
        var url = "api/suppliers/"
        var id = $(this).data('id').toString();
        url+=id;
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Delete supplier?',
            content: 'Realmente quieres eliminar el proveedor',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'delete suppliers',
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


    $('#supplier-table').on('click', '.desactivar ', function() {
        var url = "api/suppliers/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/deactivate");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Descativar proveedor?',
            content: 'Realmente quieres desactivar el proveedor',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'desactivar suppliers',
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

    $('#supplier-table').on('click', '.activar ', function() {
        var url = "api/suppliers/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/activate");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Activar brand?',
            content: 'Realmente quieres activar el proveedor',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'activar suppliers',
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

    var verific_checks_supplier = function(num){
        $(':checkbox:checked').each(function(i){
            var supplier_data = $(this).closest('tr').data('supplier-id');
            if (typeof(supplier_data) !== 'undefined') {
                supplier_ids.push(supplier_data);
            }
        });
    }

    $( "#from_search_supplier" ).on("submit", function( event ) {
        event.preventDefault();
        var date_range = $('#range_date').val();
        var type_fecha = $('.brand-date-select').val();

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
        $('#from_search_supplier')[0].reset();
        table.ajax.reload();
    });

    $('#supplier-table').on('click', '.open-EditSupplierDialog ', function() {
        var url = "api/suppliers/"
        var id = $(this).data('id').toString();
        url = url.concat(id);

        $.get(url, function(data) {
          
            $("input[name='name']").val(data['data']['name']);
            $("input[name='supplier_id']").val(data['data']['id']);
            $("input[name='is_active']").prop( "checked", parseInt(data['data']['is_active']) );

        });
    });

    $('#createModal').on('show.bs.modal', function (event) {
        // Encuentra el formulario dentro del modal y limpia los campos
        $(this).find('form')[0].reset();
    });

})();