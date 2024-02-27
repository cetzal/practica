jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return this.flatten().reduce( function ( a, b ) {
        var x = parseFloat(a) || 0;
        var y = parseFloat(b) || 0;
        return x + y
    }, 0 );
} );
(function(){

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

    var table = $("#purchase-table").DataTable({
        "searching": false,
        "processing": true,
        "serverSide": true,
        "ajax":{
            url:"/api/purchase/list",
            "data": function(d) {
                var frm_data = $('form#from_search_purchase').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
                console.log('frmdata', frm_data);
            }
        },
        'columns' : [
           
            {
                data: 'purchase_date',
                render : function(data, type, row, meta){
                    return row.purchase_date;
                }
            },
            {
                data: 'purchase_date',
                render : function(data, type, row, meta){
                    return row.product_name;
                }
            },
            {
                data: 'code',
                render : function(data, type, row, meta){
                    return row.code;
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
                    return row.qty;
                }
            },
            {
                data: 'total',
                render : function(data, type, row, meta){
                    return row.total;
                }
            }
        ],
        "createdRow": function( row, data, dataIndex ) {
            $(row).addClass('purchase-link');
            $(row).attr('data-purchase', data['purchase']);
        },
        
        'language': {
            /*'searchPlaceholder': "{{trans('file.Type date or purchase reference...')}}",*/
            'lengthMenu': '_MENU_',
            "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
            //"search":  '{{trans("file.Search")}}',
            'paginate': {
                'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            }
        },
        order:[['1', 'desc']],
        'columnDefs': [
            {
                "orderable": false,
                'targets': [0]
            }
            
        ],
       
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "footerCallback": function (tfoot, data, start, end, display) {
            var api = this.api(),
            columns = [6]; // Add columns here

        for (var i = 0; i < columns.length; i++) {
            
            $('tfoot th').eq(columns[i]).html( api.column(columns[i], {page:'current'}).data().sum() + '<br>');
           
        }
        },
        drawCallback: function () {
            var api = this.api();
            //datatable_sum(api, false);
        }
        
    });

    $('.clear_form_purchases').on('click', function(e){
        $('#from_search_purchase')[0].reset();
        $('#product-data-table').DataTable().ajax.reload();
    });

    $( "#from_search_purchase" ).on("submit", function( event ) {
        event.preventDefault();
        table.ajax.reload();
    });

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });


    function loadSearchComboSuppliers() {
        let input = '.selectpicker-suppliers';
        let url = '/api/purchase/load/serach/suppliers';
        $(input).empty();
        $(input).append('<option value="">Witout suppliers</option>');

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $(input).append('<option value="">Select supplier</option>');
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    function loadSearchComboBrands() {
        let input = '.selectpicker-brands';
        let url = '/api/purchase/load/serach/brands';
        $(input).empty();
        $(input).append('<option value="">Non-brands</option>');

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $(input).append('<option value="">Select brand</option>');
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function loadSearchComboProducts() {
        let input = '.selectpicker-product';
        let url = '/api/purchase/load/search/products';
        $(input).empty();
        $(input).append('<option value="">Without products</option>');

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $(input).append('<option value="">Select product</option>');
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function loadStockAlert(){
        let url = '/api/purchase/getStockAlert';
        $.get(url, function(response) {
            if (response.length) {

                $(".alert-stock").show();
                $("#show-product-dilay").data('alerstock', JSON.stringify(response))
                
            }
        })

    }

    function searchBrandBySupplierId(){
        let supplier_id = $('select[name="supplier_id"]').val();
        let url = '/api/purchase/getbrandSearchById?supplier_id='+supplier_id;
        let input_brand = '.selectpicker-brands';
        let input_product = '.selectpicker-product';

        if (supplier_id != '') {
            $(input_product).empty();
            $(input_product).append('<option value="">Witout product</option>');
            $.get(url, function(response) {
                if (response) {
                    // $(input).find('option').get(0).remove();
                    $(input_brand).find('option').remove().end();
                    $(input_brand).append('<option value="">Select brand</option>');
                    $.each(response, function(index, row) {
                        $(input_brand).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        }   
    }

    function searchProductBySupplierid(){
        let brand_id = $('select[name="brand_id"]').val();
        let supplier_id = $('select[name="supplier_id"]').val();

        let url = '/api/purchase/productSearch?brand_id='+brand_id+'&supplier_id='+supplier_id;
        let input = '.selectpicker-product';
        $.get(url, function(response) {
            if (response) {
                // $(input).find('option').get(0).remove();
                $(input).find('option').remove().end();
                $(input).append('<option value="">Select product</option>');
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    $('select[name="supplier_id"]').on('change', function(e) {
        e.preventDefault();
        let supplier_id = $(this).val();
        if(supplier_id == ""){
            loadSearchComboSuppliers();
            loadSearchComboBrands();
            loadSearchComboProducts();
        }else{
            searchBrandBySupplierId();
            searchProductBySupplierid();
        }
        
       
    });

    $('select[name="brand_id"]').on('change', function(e) {
        searchProductBySupplierid();
    });
    // no puedes comprar menos del punto de reorden qty_alert

    $("#show-product-dilay").on('click', function(e){
        e.preventDefault();
        let response = $(this).data('alerstock');
        response = JSON.parse(response);
        let message = '<ul>'
        $.each(response,function(index, row){
            message+='<li> El producto <b>"' +row.name+ '"</b> cuenta con la cantidad stock minimo de <b>'+row.stock_min+'</b> de la marca <b>"'+ row.brand_name +'"</b>.</li>';
        });

        message+='</ul>'

        $.alert({
            title: 'Alerta de stock',
            content: message,
        });
    });


    $(document).ready(function(){
        loadStockAlert();
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboProducts();
    });
})();