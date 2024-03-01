jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return this.flatten().reduce( function ( a, b ) {
        var x = parseFloat(a) || 0;
        var y = parseFloat(b) || 0;
        return x + y
    }, 0 );
} );
(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var module = 'sales';
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

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    function loadSearchComboSuppliers() {
        let input = '#select_supplier';
        let url = '/api/sales/load/serach/suppliers';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    function loadSearchComboBrands() {
        let input = '#select_brand';
        let url = '/api/sales/load/serach/brands';
        let select_supplier = $('#select_supplier').val();

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function loadSearchComboProducts() {
        let input = '#select_product';
        let url = '/api/sales/load/search/products';
        let select_supplier = $('#select_supplier').val();
        if (select_supplier != '' && select_supplier != null) {
            url +='?supplier_id='+ select_supplier;
        }
        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    function loadSearchComboClients() {
        let input = '#select_client';
        let url = '/api/sales/load/search/clients';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    $(document).ready(function() {
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboProducts();
        loadSearchComboClients();
    });

    $('#select_supplier').on('change', function() {
        let supplier_id = $(this).val();
        let url = '/api/sales/brandSearch?supplier_id='+supplier_id;
        let input_brand = '#select_brand';
        let input_product = '#select_product';
        if (supplier_id != '') {
            $(input_product).find('option').remove().end();
            loadSearchComboProducts();
            $.get(url, function(response) {
                if (response) {
                    $(input_brand).find('option').remove().end();
                    $.each(response, function(index, row) {
                        $(input_brand).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        } else if(supplier_id == '') {
            loadSearchComboBrands();
            loadSearchComboProducts();
        }
    });

    $('#select_brand').on('change', function() {
        let brand_id = $(this).val();
        let url = '/api/sales/productSearch?brand_id='+brand_id;
        let input = '#select_product';
        if (brand_id != '') {
            $.get(url, function(response) {
                if (response) {
                    $(input).find('option').remove().end();
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        } else if(brand_id == '') {
            loadSearchComboProducts();
        }
    });

    $( "#from_search_sale" ).on("submit", function( event ) {
        event.preventDefault();
        table.ajax.reload();
    });

    $('.clear_form').on('click', function(e){
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboProducts();
        loadSearchComboClients();
        $("input[name='code_prod']").val('');
        $("input[name='name_prod']").val('');
        $("select[name='supplier_id']").val('');
        $("select[name='brand_id']").val('');
        $("select[name='product_id']").val('');
        $("select[name='client_id']").val('');
        $("input[name='range_date']").val('');
        $('#sale-table').DataTable().ajax.reload();
    });
    
    var table = $('#sale-table').DataTable( {
        responsive: false,
        autoWidth : false,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax" : {
            "url": "api/sales/list",
            "data": function(d) {
                var frm_data = $('form#from_search_sale').serializeArray();
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
            $(row).attr('data-sale-id', data['id']);
        },
        'columns': [
            {
                data: 'sale_date',
                render: function(data, type, row, meta){
                   return moment(row.sale_date).format('DD/MM/YYYY');
                }
            },
            {
                data: 'client_name',
                render: function(data, type, row, meta){
                   return row.client_name;
                }
            },
            {
                data: 'total',
                render: function(data, type, row, meta){
                    return '$ '+parseFloat(row.total).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
        ],
        'columnDefs': [
            {
                "orderable": false,
                'targets': [0]
            },
            {
                'render': function(data, type, row, meta){
                    let html =  '<a href="#" class="btn bg-primary btn-sm redirect-sale-detail" data-sale-id="'+row.id+'"'+
                    'data-sale-date="'+row.sale_date+'" data-client="'+row.client_name+'"><i class="fa fa-list" aria-hidden="true"></i></a>';
                    return html;
                
                },
                'targets': [3]
            },
        ],
        "footerCallback": function (tfoot, data, start, end, display) {
            var api = this.api();
            $('tfoot th').eq(2).html( 
                '$ ' + parseFloat(api.column(2, {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>'
            );
        },
        // 'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
    } );

    $('#sale-table').on('click', '.redirect-sale-detail', function(e) {
        e.preventDefault();
        let sale_id = $(this).data('sale-id').toString();
        let sale_date = $(this).data('sale-date').toString();
        let client = $(this).data('client').toString();
        window.open(window.location.origin +'/sale-details/'+sale_id+'?sale_date='+sale_date+'&client='+client, '_blank');
    });
})();