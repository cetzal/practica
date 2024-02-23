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
        let input = '#select_brand';
        let url = '/api/sales/load/serach/brands';
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
        let input = '#select_product';
        let url = '/api/sales/load/search/products';
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
    function loadSearchComboClients() {
        let input = '#select_client';
        let url = '/api/sales/load/search/clients';
        $(input).append('<option value="">Without clients</option>');

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $(input).append('<option value="">Select client</option>');
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
            $(input_product).append('<option value="">Sin productos</option>');
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

    $('#select_brand').on('change', function() {
        let brand_id = $(this).val();
        let url = '/api/sales/productSearch?brand_id='+brand_id;
        let input = '#select_product';
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

    $( "#from_search_sale" ).on("submit", function( event ) {
        event.preventDefault();
        table.ajax.reload();
    });

    $('.clear_form').on('click', function(e){
        $('.form_search').toggleClass('form_search_active');
        window.location.replace('/sales');
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
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
            }
        },
        "order": [],
        'language': {
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
                   return moment(row.date).format('DD/MM/YYYY');
                },
                'targets': [0]
            },
            {
                'render': function(data, type, row, meta){
                   return row.client_name;
                },
                'targets': [1]
            },
            {
                'render': function(data, type, row, meta){
                    return row.total_quantity;
                },
                'targets': [2]
            },
            {
                'render': function(data, type, row, meta){
                    return row.total;
                },
                'targets': [3]
            },
            // {
            //     'render': function(data, type, row, meta) {
            //         let html =  '<a href="#" class="btn bg-success btn-sm open-EditSupplierDialog" data-id="'+row.id+'"  data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></a>';
            //         html +=  '<a class="btn bg-danger m-1 remove btn-sm" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
            //         html +=  '<a href="#" class="btn bg-primary btn-sm redirect-record-log" data-record-id="'+row.id+'" data-record-name="'+row.name+'"><i class="fa fa-eye" aria-hidden="true"></i></a>';
            //         if(row.is_active == 1){
            //             html +=  '<a class="btn m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
            //         }else{
            //             html +=  '<a class="btn m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
            //         }
            //         return html;
                
            //     },
            //     'targets': [7]
            // },
            { targets: [1], className: "text-center"},
            {targets: [0, 1, 2, 3], searchable: false}
        ],
        // 'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
    } );


})();