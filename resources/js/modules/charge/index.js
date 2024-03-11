(function() {
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

    //Cargar combos iniciales
    function loadSearchComboClients() {
        let input = '#select_client';
        let url = '/api/charges/load/search/clients';

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
        let input = '#select_account';
        let url = '/api/charges/load/search/accounts';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    //End comobos iniciales

    $(document).ready(function() {
        // loadSearchComboClients();
        loadSearchComboAccounts();
    });

    var table = $('#charge-table').DataTable( {
        responsive: false,
        autoWidth : false,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax" : {
            "url": "api/charges/list",
            "data": function(d) {
                var frm_data = $('form#from_search_charge').serializeArray();
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
                data: 'account',
                render: function(data, type, row, meta){
                   return row.account_name;
                }
            },
            // {
            //     data: 'client_name',
            //     render: function(data, type, row, meta){
            //        return row.client_name;
            //     }
            // },
            {
                data: 'charge_date',
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
                'targets': [0]
            },
            {
                'render': function(data, type, row, meta){
                    let html =  '<a href="#" class="btn bg-primary btn-sm redirect-charge-detail" data-charge-id="'+row.id+'"'+
                    'data-charge-date="'+row.charge_date+'"><i class="fa fa-list" aria-hidden="true"></i></a>';
                    return html;
                
                },
                'targets': [3]
            },
        ],
        "footerCallback": function (tfoot, data, start, end, display) {
            var api = this.api();
            // $('tfoot th').eq(2).html( 
            //     '$ ' + parseFloat(api.column(2, {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>'
            // );
        },
        // 'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
    } );

    $( "#from_search_charge" ).on("submit", function( event ) {
        event.preventDefault();
        table.ajax.reload();
    });

    $('.clear_form').on('click', function(e){
        loadSearchComboClients();
        $("select[name='account_id']").val('');
        $("input[name='range_date']").val('');
        $('#charge-table').DataTable().ajax.reload();
    });

    $('#charge-table').on('click', '.redirect-charge-detail', function(e) {
        e.preventDefault();
        let charge_id = $(this).data('charge-id').toString();
        let charge_date = $(this).data('charge-date').toString();
        window.open(window.location.origin +'/charges/'+charge_id+'/details?charge_date='+charge_date, '_blank');
    });
})();