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
                    return moment(row.purcharse_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
                }
            },
            {
                data: 'supplier_name',
                render : function(data, type, row, meta){
                    return row.supplier_name;
                }
            },
            {
                data: 'total',
                render : function(data, type, row, meta){
                    return '$ '+parseFloat(row.total).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            }
        ],
        "createdRow": function( row, data, dataIndex ) {
            $(row).attr('data-purchase-id', data['id']);
        },
        //"sInfoFiltered":   "(filtrado de _MX_ en total)",
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
        order:[['1', 'desc']],
        'columnDefs': [
            {
                "orderable": false,
                'targets': [0]
            },
            {
                'render': function(data, type, row, meta){
                    let html =  '<a href="#" class="btn bg-primary btn-sm redirect-purchase-detail" data-purchase-id="'+row.id+'"'+
                                'data-purchase-date="'+row.purchase_date+'" data-supplier="'+row.supplier_name+'"><i class="fa fa-list" aria-hidden="true"></i></a>';
                    return html;
                
                },
                'targets': [3]
            },
            
        ],
       
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "footerCallback": function (tfoot, data, start, end, display) {
            var api = this.api();
            // $('tfoot th').eq(5).html( api.column(5, {page:'current'}).data().sum() + '<br>');
            $('tfoot th').eq(2).html('$ '+ parseFloat( api.column(2, {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>');

       
        },
        drawCallback: function () {
            var api = this.api();
            //datatable_sum(api, false);
        }
        
    });

    $('.clear_form_purchases').on('click', function(e){
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboProducts();
        $('#from_search_purchase')[0].reset();
        $('#purchase-table').DataTable().ajax.reload();
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
        let url = '/api/purchase/load/serach/brands';
        $(input).empty();
        $.get(url, function(response) {
            if (response.length) {
              
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
        $.get(url, function(response) {
            if (response.length) {
               
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

    function searchProductBySupplierid(){
        let brand_id = $('select[name="brand_id"]').val();
        let supplier_id = $('select[name="supplier_id"]').val();

        if(typeof(brand_id) === 'object'){
            brand_id = '';
        }
        
        let url = '/api/purchase/productSearch?brand_id='+brand_id+'&supplier_id='+supplier_id;
        let input = '.selectpicker-product';
        $(input).empty();
        $.get(url, function(response) {
            if (response) {
                // $(input).find('option').get(0).remove();
               
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

    $('#purchase-table').on('click', '.redirect-purchase-detail', function(e) {
        e.preventDefault();
        let purchase_id = $(this).data('purchase-id').toString();
        let purchase_date = $(this).data('purchase-date').toString();
        let supplier = $(this).data('supplier').toString();
        window.open(window.location.origin +'/purchase-details/'+purchase_id+'?purchase_date='+purchase_date+'&supplier='+supplier, '_blank');
    });

    $(document).ready(function(){
        loadStockAlert();
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboProducts();
    });
})();