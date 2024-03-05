jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return this.flatten().reduce( function ( a, b ) {
        var x = parseFloat(a) || 0;
        var y = parseFloat(b) || 0;
        return x + y
    }, 0 );
} );
(function() {
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
    
    $( "#from_search_inventory" ).on("submit", function( event ) {
        event.preventDefault();
        $("#inventory-table").DataTable().ajax.reload();
    });

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    /**Cargar los combos iniciales para los filtros */
    function loadSearchComboSuppliers() {
        let input = '.selectpicker-suppliers';
        let url = '/api/inventory/load/serach/suppliers';
        $(input).empty();

        $.get(url, function(response) {
            if (response.length) {
                
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    function loadSearchComboBrands() {
        let input = '.selectpicker-brands';
        let url = '/api/inventory/load/serach/brands';
        $(input).empty();
        $.get(url, function(response) {
            if (response.length) {
              
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function loadSearchComboClients() {
        let input = '#select_client';
        let url = '/api/inventory/load/search/clients';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function searchBrandBySupplierId(){
        let supplier_id = $('select[name="supplier_id"]').val();
        let url = '/api/inventory/getbrandSearchById?supplier_id='+supplier_id;
        let input_brand = '.selectpicker-brands';
        $(input_brand).empty();
        if (supplier_id != '') {
           
            $.get(url, function(response) {
                if (response) {
                   
                    $.each(response, function(index, row) {
                        $(input_brand).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        }   
    }

    $('select[name="supplier_id"]').on('change', function(e) {
        e.preventDefault();
        let supplier_id = $(this).val();
        if (supplier_id == "") {
            loadSearchComboSuppliers();
            loadSearchComboBrands();
        } else {
            searchBrandBySupplierId();
        }
    });

    $('#select_type').on('change', function(e) {
        e.preventDefault();
        $('#select_client').attr('disabled', 'disabled');
        if ($(this).val() == "sale") {
            $('#select_client').removeAttr('disabled');
        }
    });

    $('.clear_form_inventory').on('click', function(e){
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboClients();
        $('#select_client').val('');
        $('#select_client').attr('disabled', 'disabled');
        $('#from_search_inventory')[0].reset();
        $('#inventory-table').DataTable().ajax.reload();
    });

    /**End load combo search */
    
    $(document).ready(function() {
        $('#select_client').attr('disabled', 'disabled');
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboClients();

        //config table
        var table = $("#inventory-table").DataTable({
            "searching": false,
            "processing": true,
            "serverSide": true,
            "ajax":{
                url:"/api/inventory/list",
                "data": function(d) {
                    var frm_data = $('form#from_search_inventory').serializeArray();
                    // return frm_data;
                    $.each(frm_data, function(key, val) {
                        d[val.name] = val.value;
                    });
                }
            },
            'columns' : [
                {
                    date : 'icon',
                    render : function(data, type, row, meta){
                        if(typeof(row.client_id) == 'undefined'){
                            return '<div style="color:green"><i class="fa fa-plus" aria-hidden="true"></i></div>';
                        }else{
                            return '<div style="color:red"><i class="fa fa-minus" aria-hidden="true"></i></div>';
                        }
                       
                    }
                },
                {
                    data: 'date',
                    render : function(data, type, row, meta){
                        return moment(row.date).format('DD/MM/YYYY');
                    }
                },
                {
                    data: 'client_name',
                    render : function(data, type, row, meta){
                        return row.client_name;
                    }
                },
                {
                    data: 'product_name',
                    render : function(data, type, row, meta){
                        return row.product_name;
                    }
                },
                {
                    data: 'product_code',
                    render : function(data, type, row, meta){
                        return row.product_code;
                    }
                },
                {
                    data: 'supplier_name',
                    render : function(data, type, row, meta){
                        return row.supplier_name;
                    }
                },
                {
                    data: 'brand_name',
                    render : function(data, type, row, meta){
                        return row.brand_name;
                    }
                },
                {
                    data: 'qty',
                    render : function(data, type, row, meta){
                        if(typeof(row.client_id) == 'undefined'){
                            return row.qty;
                        }else{
                            return row.quantity;
                        }
                       
                    }
                },
                {
                    data: 'total',
                    render : function(data, type, row, meta){
                        return '$ '+parseFloat(row.total).toLocaleString('en-US', {minimumFractionDigits: 2});
                    }
                }
            ],
            // "createdRow": function( row, data, dataIndex ) {
            //     $(row).attr('data-purchase-id', data['id']);
            // },
            'language': {
                'infoFiltered': ' - filtrado de _MAX_ registros en total',
                /*'searchPlaceholder': "{{trans('file.Type date or purchase reference...')}}",*/
                'lengthMenu': '_MENU_',
                "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
                //"search":  '{{trans("file.Search")}}',
                'paginate': {
                    'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                }
            },
            // order:[['1', 'desc']],
            // 'columnDefs': [
            //     {
            //         "orderable": false,
            //         'targets': [0]
            //     },
            //     {
            //         'render': function(data, type, row, meta){
            //             let html =  '<a href="#" class="btn bg-primary btn-sm redirect-purchase-detail" data-purchase-id="'+row.id+'"'+
            //                         'data-purchase-date="'+row.purchase_date+'" data-supplier="'+row.supplier_name+'"><i class="fa fa-list" aria-hidden="true"></i></a>';
            //             return html;
                    
            //         },
            //         'targets': [3]
            //     },
                
            // ],
           
            'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "rowCallback": function( row, data, index ){

            },
            "footerCallback": function (tfoot, data, start, end, display) {
                let total_purchases = 0;
                let total_sales = 0;
                let total = 0;

                let total_purchase_qty = 0;
                let total_sale_qty = 0;
                let total_quantity = 0;
                
                data.forEach(function(value, index){
                    if(typeof(value.client_id) == 'undefined'){
                        total_purchases+=parseFloat(value.total);
                        total_purchase_qty+=parseFloat(value.qty);
                    }else{
                        total_sales+=parseFloat(value.total);
                        total_sale_qty+=parseFloat(value.quantity);
                    }
                });

                total = total_purchases - total_sales;
                if (total_purchases == 0) {
                    total = total_sales;
                }

                total_quantity = total_purchase_qty - total_sale_qty;
                if (total_purchase_qty == 0) {
                    total_quantity = total_sale_qty;
                }

                $('tfoot th').eq(7).html(total_quantity);
                $('tfoot th').eq(8).html('$ '+ parseFloat(total).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>');
            }, 
        });
    });
})();