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

    function loadSearchComboSuppliers() {
        let input = 'select[name="supplier_id"]';
        let url = '/api/payments/load/search/suppliers';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    
    function loadSearchComboAccounts() {
        let input = 'select[name="account_id"]';
        let url = '/api/payments/load/search/accounts';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    var table = $('#table-payments').DataTable( {
        responsive: false,
        autoWidth : false,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax" : {
            "url": "api/payments",
            "data": function(d) {
                var frm_data = $('form#from_search_payments').serializeArray();
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
            $(row).attr('data-payments-id', data['id']);
        },
        'columns': [
            {
                data: 'account',
                render: function(data, type, row, meta){
                   return row.account_name;
                }
            },
            {
                data: 'supplier_name',
                render: function(data, type, row, meta){
                   return row.supplier_name;
                }
            },
            {
                data: 'paid_date',
                render: function(data, type, row, meta){
                   return moment(row.charge_date).format('DD/MM/YYYY');
                }
            },
            {
                data: 'amount',
                render: function(data, type, row, meta){
                    return '$ '+parseFloat(row.amount).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
        ],
        'columnDefs': [
            {
                "orderable": false,
                'targets': [0,1,2,3,4]
            },
            {
                'targets': [4],
                'render': function(data, type, row, meta){
                    let html =  '<a href="#" class="btn bg-primary btn-sm redirect-payments-detail" data-payments-id="'+row.id+'"'+
                    'data-paid-date="'+row.paid_date+'"><i class="fa fa-list" aria-hidden="true"></i></a>';
                    return html;
                
                }
                
            },
        ],
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "footerCallback": function (tfoot, data, start, end, display) {
            var api = this.api();
            // $('tfoot th').eq(5).html( api.column(5, {page:'current'}).data().sum() + '<br>');
            $('tfoot th').eq(3).html('$ '+ parseFloat( api.column(3, {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>');
        },
       
    } );

    $( "#from_search_payments" ).on("submit", function( event ) {
        event.preventDefault();
        table.ajax.reload();
    });

    $('.clear_form').on('click', function(e){
       // loadSearchComboClients();
        $("select[name='account_id']").val('');
        $("select[name='supplier_id']").val('');
        $("input[name='range_date']").val('');
        table.ajax.reload();
    });

    $('#table-payments').on('click', '.redirect-payments-detail', function(e) {
        e.preventDefault();
        let payments_id = $(this).data('payments-id').toString();
        let paid_date = $(this).data('paid-date').toString();
        window.open(window.location.origin +'/payments/'+payments_id+'/details?paid_date='+paid_date, '_blank');
    });

    $(document).ready(function(){
        loadSearchComboAccounts();
        loadSearchComboSuppliers();
    });
})();