(function() {
    var brand_ids = [];
    var module = 'brands';
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

    brand_ids = [];
    //Eliminar todas las marcas
    

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

    var table = $('#brand-table').DataTable( {
        responsive: false,
        autoWidth : false,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax" : {
            "url": "api/brand",
            "data": function(d) {
                var frm_data = $('form#from_brand_search').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
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
            $(row).attr('data-branch-id', data['id']);
        },
        'columnDefs': [
            {
                "orderable": false,
                'render': function(data, type, row, meta){
                    data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
                   return data;
                },
                'targets': [0],
                'checkboxes': {
                   'selectRow': true,
                   'selectAllRender': '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>'
                },
            },{
                'render': function(data, type, row, meta){
                   return row.name;
                },
                'targets': [1]
            },
            {
                'width': '100px',
                'render': function(data, type, row, meta){
                    let html = '<p class="text_ellipsis" style="width:250px;">'+row.description+'</p>';
                   return html;
                },
                'targets': [2]
            },
            {
                targets: [3],
                render : function(data, type, row, meta){
                    return row.supplier_name;
                }
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
                'targets': [4]
            },
            {
                'render': function(data, type, row, meta){
                    return row.created_by;
                },
                'targets': [5]
            },
            {
                'render': function(data, type, row, meta){
                    if (row.created_at == null) {
                        return '';
                    }
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
                },
                'targets': [6]
            },
            {
                'render': function(data, type, row, meta){
                    if (row.updated_at == null) {
                        return '';
                    }
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                },
                'targets': [7]
            },
            {
                'render': function(data, type, row, meta){
                    // let $html =  '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></button>';
                    let html =  '<a href="#" class="btn bg-success btn-sm open-EditbrandDialog" data-id="'+row.id+'" data-supplier-hiden="'+row.supplier_id+'"  data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></a>';
                    html +=  '<a class="btn bg-danger m-1 remove btn-sm" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                    html +=  '<a href="#" class="btn bg-primary btn-sm redirect-record-log" data-record-id="'+row.id+'" data-record-name="'+row.name+'"><i class="fa fa-eye" aria-hidden="true"></i></a>';

                    if(row.is_active == 1){
                        html +=  '<a class="btn m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
                    }else{
                        html +=  '<a class="btn m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
                    }



                    
                    // let html =  '<a href="'+url_edit+'" class="btn bg-success btn-sm open-EditbrandDialog" data-id="'+row.id+'"><i class="fa fa-edit" aria-hidden="true"></i></a>';
                    // let html =  '<a href="'+url_edit+'" class="btn bg-success btn-sm " data-id="'+row.id+'"><i class="fa fa-edit" aria-hidden="true"></i></a>';
                    return html;
                
                },
                'targets': [8]
            },
            { targets: [1], className: "text-center"},
            {targets: [0, 1, 2, 3], searchable: false}
        ],
        // 'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
    } );

    $(".delete_all").on('click', function(e){
        e.preventDefault();
        brand_ids = [];
        verific_checks(0);
        console.log('brand_is', brand_ids);
        if(brand_ids.length) {
            $.ajax({
                type:'PUT',
                url:'api/brand/all/deletebyselection',
                data:{
                    brandIdArray: brand_ids
                },
                success:function(data){
                    console.log('data', data.messages);
                    var messsage = 'se elimino todo las marcas selecionados';
                    if (typeof data.messages != undefined) {
                        messsage = data.messages;
                    }
                    $.confirm({
                        title: 'Eliminar marcas',
                        content: messsage,
                        buttons: {
                            ok: function () {
                                table.ajax.reload();
                                $("tbody input[type='checkbox']").prop('checked', false);
                            }
                        }
                    });
                }
            });
        }else{
            $.alert({
                title: 'Eliminar marcas',
                content: 'Seleccione las marcas que deseas eliminar',
            });
        }
    });

    //Activar todas las marcas seleccionas
    $(".active_all").on('click', function(e){
        e.preventDefault();
        brand_ids = [];
        verific_checks(0);
        if(brand_ids.length) {
            $.ajax({
                type:'PUT',
                url:'api/brand/all/activatebyselection',
                data:{
                    brandIdArray: brand_ids
                },
                success:function(data){
                    $.confirm({
                        title: 'Activar marcas',
                        content: 'Se activo todo las marcas selecionados ',
                        buttons: {
                            ok: function () {
                                table.ajax.reload();
                                $("tbody input[type='checkbox']").prop('checked', false);
                            }
                        }
                    });
                }
            });
        }else{
            $.alert({
                title: 'Activar marcas',
                content: 'Seleccione los marcas que deseas activar',
            });
        }
    });

    // Desactivas todas las marcas seleccionadas
    $(".desactive_all").on('click', function(e){
        e.preventDefault();
        brand_ids = [];
        verific_checks(0);
        console.log('brands ids', brand_ids);
        if(brand_ids.length) {
            $.ajax({
                type:'PUT',
                url:'api/brand/all/deactivatebyselection',
                data:{
                    brandIdArray: brand_ids
                },
                success:function(data){
                    $.confirm({
                        title: 'Desactivar marcas',
                        content: 'Se desactivo todas los marcas selecionados ',
                        buttons: {
                            ok: function () {
                                table.ajax.reload();
                                $("tbody input[type='checkbox']").prop('checked', false);
                                // $('#brand-table').DataTable().ajax().reload();
                            }
                        }
                    });
                    
                }
            });
        }else{
            $.alert({
                title: 'Desactivar marcas',
                content: 'Seleccione lass marcas que deseas desactivar',
            });
        }
    });
    var verific_checks = function(num){
        $(':checkbox:checked').each(function(i){
            var brand_data = $(this).closest('tr').data('branch-id');
            if (typeof(brand_data) != "undefined") {
                brand_ids.push(brand_data);
            }
        });
    }

    $( "#from_brand_search" ).on("submit", function( event ) {
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
        $('#from_brand_search')[0].reset();
        table.ajax.reload();
    });

    $('#brand-table').on('click', '.open-EditbrandDialog ', function(e) {
       e.preventDefault();
        $('#update_brand')[0].reset();
        $('#suppliersup_id').empty();
        load_combobox_edit("#suppliersup_id");
        let url = "api/brand/"
        let id = $(this).data('id').toString();
        let supplier_id = $(this).data('supplier-hiden');
        $('input[name="supplier_hidden"]').val(supplier_id);
        url = url.concat(id).concat("/edit");

        $.get(url, function(data) {
            $("input[name='name']").val(data['name']);
            $("textarea[name='description']").val(data['description']);
            $("input[name='brand_id']").val(data['id']);
            $('#suppliersup_id option[value="'+data['supplier_id']+'"]').prop('selected', true);
            $("input[name='is_active']").prop( "checked", parseInt(data['is_active']) );
        });

    });

    $('#brand-table').on('click', '.redirect-record-log', function(e) {
        e.preventDefault();
        let record_id = $(this).data('record-id').toString();
        let record_name = $(this).data('record-name').toString();
        window.open(window.location.origin +'/log-record/'+record_id+'?record_name='+record_name+'&module_name='+module, '_blank');
    });

    $('#brand-table').on('click', '.remove ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/delete");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Delete brand?',
            content: 'Realmente quieres eliminar la marca',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'delete brands',
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


    $('#brand-table').on('click', '.desactivar ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/deactivate");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Descativar marca?',
            content: 'Realmente quieres desactivar la marca',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'desactivar brands',
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

    $('#brand-table').on('click', '.activar ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/activate");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Activar brand?',
            content: 'Realmente quieres activar la marca',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'activar brands',
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

    //Cerrar los modales de update or create
    $('.bt-close-modal').on('click', function(e){
        $("input[name='name']").val('');
        $("textarea[name='description']").val('');
        $('#suppliers_id').empty();
        $('form#new_brand')[0].reset();
        $('form#update_brand')[0].reset();
        $("form#new_brand").find("#btn-password").removeClass('is-invalid');
        $("form#new_brand").find("#btn-password").attr('aria-invalid', false);
        $("form#update_brand").find("#btn-password-up").removeClass('is-invalid');
        $("form#update_brand").find("#btn-password-up").attr('aria-invalid', false);
    });
    $('.btn-close-modal').on('click', function(e){
        $("input[name='name']").val('');
        $("textarea[name='description']").val('');
        $('#suppliers_id').empty();
        $('form#new_brand')[0].reset();
        $('form#update_brand')[0].reset();
        $("form#new_brand").find("#btn-password").removeClass('is-invalid');
        $("form#new_brand").find("#btn-password").attr('aria-invalid', false);
        $("form#update_brand").find("#btn-password-up").removeClass('is-invalid');
        $("form#update_brand").find("#btn-password-up").attr('aria-invalid', false);
    });

    // $('#createModal').on('show.bs.modal', function (event) {
        
    //     // Encuentra el formulario dentro del modal y limpia los campos
    //     $(this).find('form')[0].reset();
    //     load_combobox("#suppliers_id");
    // });

    // $(document).on('show.bs.modal','#createModal', function (event) {
    //     event.preventDefault();
    //     $(this).find('form')[0].reset();
    //     load_combobox("#suppliers_id");
    // });

    $('.open-modal-brand').on('click', function(e){
        e.preventDefault();
        $('form#new_brand')[0].reset();
        load_combobox("#suppliers_id");
    });

    var load_combobox = function(input){       
        
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            type: "GET",
            url: 'api/suppliers/all/combobox',
            success: function( response ){
                if(response.length != 0){
                    $(input).empty();
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
              }
            },
            error: function(xhr, textStatus, error){
              
            }
        });
    };

    var load_combobox_edit = function(input){       
        $(input).append('<option value="">Without brands</option>');
        let supplier_id_hidden = $('input[name="supplier_hidden"]').val();
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            type: "GET",
            url: 'api/brand/load/edit/suppliers',
            success: function( response ){
                if(response.length != 0){
                    $(input).empty();
                    $(input).append('<option value="">Select supplier</option>');
                    $.each(response, function(index, row) {
                        if(row.is_active == 0){
                            $(input).append('<option value="' + row.id + '" disabled>' + row.name + '</option>');
                        }else{
                            $(input).append('<option value="' + row.id + '">' + row.name + '</option>');
                        }
                        
                    }); 
                    $(input).val(supplier_id_hidden);
                   
              }
            },
            error: function(xhr, textStatus, error){
              
            }
        });
    };

    var load_combobox_filter = function(input){
        $(input).append('<option value="">Without products</option>');
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            type: "GET",
            url: '/api/brand/load/serach/suppliers',
            success: function( response ){
                if(response.length != 0){
                    $(input).empty();
                    $(input).append('<option value="">Select a brand</option>');
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
              }
            },
            error: function(xhr, textStatus, error){
              
            }
        });
    };

    $(document).ready(function() {
        load_combobox_filter(".selectpicker-suppliers");
    });
   

})();