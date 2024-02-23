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
        "createdRow": function( row, data, dataIndex ) {
            $(row).addClass('purchase-link');
            $(row).attr('data-purchase', data['purchase']);
        },
        "columns": [
             ],
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
            ,{
                targets: [0],
                render : function(data, type, row, meta){
                    return row.purchase_date;
                }
            },
            {
                targets: [1],
                render : function(data, type, row, meta){
                    return row.supplier_name;
                }
            },
            {
                targets: [2],
                render : function(data, type, row, meta){
                    return row.qty;
                }
            },
            {
                targets: [3],
                render : function(data, type, row, meta){
                    return row.toital;
                }
            }
        ],
        'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
        
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

    
    $('.clear_form_purchases').on('click', function(e){
        location.reload();
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
                let message = '<ul>'
                $.each(response,function(index, row){
                    message+='<li> El producto <b>"' +row.name+ '"</b> cuenta con la cantidad stock minimo de <b>'+row.stock_min+'</b> de la marca <b>"'+ row.brand_name +'"</b>.</li>';
                });

                message+='</ul>'

                $.alert({
                    title: 'Alerta de stock',
                    content: message,
                });
            }
        })

    }

    $('select[name="supplier_id"]').on('change', function(e) {
        e.preventDefault();
        let supplier_id = $(this).val();
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
    });

    $('select[name="brand_id"]').on('change', function(e) {
        let brand_id = $(this).val();
        let url = '/api/purchase/productSearch?brand_id='+brand_id;
        let input = '.selectpicker-product';
        if (brand_id != '') {
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
    });


    $(document).ready(function(){
        loadStockAlert();
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboProducts();
    });
})();