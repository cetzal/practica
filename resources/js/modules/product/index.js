(function() {
    var qty = [];
    var htmltext;
    var slidertext;
    var product_id = [];
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    //$("a.sub-btn").siblings().attr('aria-expanded','true');

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    $( "#date_range" ).daterangepicker({
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

    $( "#date_update" ).daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        },
        todayHighlight: true,
        autoUpdateInput: false,
    });

    $('input[name="date_range"]').on('apply.daterangepicker', function(ev, picker) {
        var type_fecha = $('.form-select').val();
        if(type_fecha==''){
            $.alert({
                title: 'Filtra datos',
                content:'Selecrione un tipo de fecha a consultar',
            });
        }
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

    //product_id.length = 0;
    $(".delete_all_prod").on('click', function(e){
        e.preventDefault();
        if(product_id.length) {
            $.confirm({
                title: 'Eliminar producto',
                content: 'Realmente quieres eliminar los producto selecionados?',
                buttons: {
                    deleteUser: {
                        text: 'Si, eliminar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/product/all/deletebyselection',
                                data:{
                                    productIdArray: product_id
                                },
                                success:function(data){
                                    $.alert({
                                        title: 'Eliminat productos',
                                        content: 'se elimino todo los productos selecionados ',
                                    });
                                    $( "#select_all" ).prop('checked', false);
                                    $('#product-data-table').DataTable().ajax.reload();
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
                title: 'Eliminat productos',
                content: 'Selecciones los productos que deseas eliminar',
            });
        }
    });
    $(".active_all_prod").on('click', function(e){
        e.preventDefault();
        if(product_id.length) {
            $.confirm({
                title: 'Activar producto',
                content: 'Realmente quieres activar los productos selecionados?',
                buttons: {
                    deleteUser: {
                        text: 'Si, Activar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/product/all/activatebyselection',
                                data:{
                                    productIdArray: product_id
                                },
                                success:function(data){
                                    $.alert({
                                        title: 'Activar productos',
                                        content: 'se activado todo los productos selecionados ',
                                    });
                                    $( "#select_all" ).prop('checked', false);
                                    $('#product-data-table').DataTable().ajax.reload();
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
                title: 'Activar productos',
                content: 'Selecciones los productos que deseas activar',
            });
        }
    });
    $(".desactive_all_prod").on('click', function(e){
        e.preventDefault();
        if(product_id.length) {
            $.confirm({
                title: 'Desactivar producto',
                content: 'Realmente quieres desactivar los productos selecionados?',
                buttons: {
                    deleteUser: {
                        text: 'Si, Desactivar',
                        action: function () {
                            $.ajax({
                                type:'PUT',
                                url:'api/product/all/deactivatebyselection',
                                data:{
                                    productIdArray: product_id
                                },
                                success:function(data){
                                    $.alert({
                                        title: 'Desactiva productos',
                                        content: 'Se desactivo todo los productos selecionados ',
                                    });
                                    $( "#select_all" ).prop('checked', false);
                                    $('#product-data-table').DataTable().ajax.reload();
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
                title: 'Desactivar productos',
                content: 'Selecciones los productos que deseas desactivar',
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

    $( "#product-data-table #select_all" ).on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
        product_id = [];
        verific_checks_prod(0);
    });

    $('#product-data-table').on('click', "tbody input[type='checkbox']", function(e) {
        if (!$(this).is(":checked")) { //If the checkbox is checked
            product_id = [];
        }
        verific_checks_prod(1);
        
    });

    var verific_checks_prod = function(num){
        $(':checkbox:checked').each(function(i){
            i+=num;
            if(i){
                var product_data = $(this).closest('tr').data('product');
                console.log(product_data);
                product_id[i-1] = product_data.id;
            }
        });
    }
    $(document).on("click", "tr.product-link td:not(:first-child, :last-child)", function() {
        productDetails( $(this).parent().data('product'), $(this).parent().data('imagedata') );        
    });

    $(document).on("click", ".view", function(){
        var product = $(this).parent().parent().parent().parent().parent().data('product');
        var imagedata = $(this).parent().parent().parent().parent().parent().data('imagedata');
        productDetails(product, imagedata);
    });

    $('#product-data-table').on('click', '.remove', function() {
        var url = "api/product/:id/delete";
        var id = $(this).data('id').toString();
        // url = url.concat(id).concat("/delete");
        url = url.replace(':id', id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Eliminar producto?',
            content: 'Realmente quieres eliminar el producto',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'Eliminar producto',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            success: function(response) {
                                $.alert({
                                    title: response.status,
                                    content: response.message,
                                });
                                $('#product-data-table').DataTable().ajax.reload();
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


    $('#product-data-table').on('click', '.desactivar', function() {
        var url = "api/product/:id/deactivate";
        var id = $(this).data('id').toString();
        url = url.replace(':id', id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Desactivar producto',
            content: 'Realmente quieres desactivar el producto',
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
                                $('#product-data-table').DataTable().ajax.reload();
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

    $('#product-data-table').on('click', '.activar', function() {
        var url = "api/product/:id/activate";
        var id = $(this).data('id').toString();
        url = url.replace(':id', id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Activar producto',
            content: 'Realmente quieres activar el producto',
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
                                $('#product-data-table').DataTable().ajax.reload();
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

    $(document).ready(function() {
        var table = $('#product-data-table').DataTable( {
            responsive: true,
            "searching": false,
            "bProcessing": true,
            fixedHeader: {
                header: true,
                footer: true
            },
            fixedColumns: {
                left: 1,
                right: 1
            },
            scrollCollapse: true,
            scrollX: true,
            scrollY: 300,
            "processing": true,
            "serverSide": true,
            "ajax":{
                url:"api/product/list",
                "data": function(d) {
                    var frm_data = $('form#from_search_prod').serializeArray();
                    // return frm_data;
                    $.each(frm_data, function(key, val) {
                        d[val.name] = val.value;
                    });
                },
                type:"GET"
            },
            "createdRow": function( row, data, dataIndex ) {
                $(row).addClass('product-link');
                $(row).attr('data-product', JSON.stringify(data));
                // $(row).attr('data-product', data['product']);
                // $(row).attr('data-imagedata', data['imagedata']);
            },
            "columns": [
                {"data": "id"},
                {"data": "picture"},
                {"data": "name"},
                {"data": "code"},
                {"data": "supplier_name"},
                {"data": "brand_name"},
                {"data": "category_name"},
                {"data": "qty"},
                {"data": "unit_name"},
                {"data": "price"},
                {"data": "status"},
                {"data": "created_at"},
                {"data": "updated_at"},
                //{"data": "options"},
            ],
            'language': {
                
                'lengthMenu': '_MENU_',
                "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
                "search":  '{{trans("file.Search")}}',
                'paginate': {
                    'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                }
            },
            order:[['2', 'asc']],
            'columnDefs': [
                {
                    "orderable": false,
                    'targets': [0, 1, 12]
                },
                {
                    'render': function(data, type, row, meta){
                        if(type === 'display'){
                            data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
                        }

                       return data;
                    },
                    'checkboxes': {
                       'selectRow': true,
                       'selectAllRender': '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>'
                    },
                    'targets': [0]
                },
                {
                    'targets' : [1],
                    'render' : function(data, type, row, meta){
                        var _picture = 'avarat.png';
                        if(row.picture != null){
                            let _pictures = row.picture.split(",");
                            _picture = _pictures[_pictures.length - 1];
                            _picture = escapeHtml(_picture);
                        
                        }
                        return '<img src="public/images/product/'+_picture+'" height="80" width="80">';;
                    }
                },
                {
                    'targets':[10],
                    'render' : function(data, type, row, meta){
                        //return row.is_active == 1 ? 'Activo' : 'Desactivado';

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
                    'targets':[11],
                    'render' : function(data, type, row, meta){
                        if (row.created_at == null) {
                            return '';
                        }
                        return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
                    }
                },
                {
                    'targets':[12],
                    'render' : function(data, type, row, meta){
                        if (row.updated_at == null) {
                            return '';
                        }
                        return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                    }
                },
                {
                    'targets': [13],
                    'render' : function(data, type, row, meta){
                        var url_edit = "product/:id/edit";
                        url_edit = url_edit.replace(':id', row.id);
                        let $html =  '<a href="'+url_edit+'" class="btn bg-success btn-sm" data-id="'+row.id+'"><i class="fa fa-edit" aria-hidden="true"></i></a>';
                        $html +=  '<a class="btn bg-danger m-1 remove btn-sm" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                        if(row.is_active == 1){
                            $html +=  '<a class="btn bg-grey m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
                        }else{
                            $html +=  '<a class="btn bg-grey m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
                        }
                        //$html += '<a class="btn bs-info m-1 view"><i class="fa fa-info-circle" aria-hidden="true"></i></a>';
                        return $html;
                    }
                }
            ],
            'select': { style: 'multi', selector: 'td:first-child'},
            'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
            
        } );

    } );


    $( "#from_search_prod" ).on( "submit", function( event ) {
        event.preventDefault();
        var date_range = $('#date_range').val();
        var type_fecha = $('.product-select-date').val();
        console.log(type_fecha);
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
        $('#product-data-table').DataTable().ajax.reload();
    });

    $('.clear_form_prod').on('click', function(e){
        $('#from_search_prod')[0].reset();
        $('#product-data-table').DataTable().ajax.reload();
    });
})();