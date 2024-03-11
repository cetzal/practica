jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return this.flatten().reduce( function ( a, b ) {
        var x = parseFloat(a) || 0;
        var y = parseFloat(b) || 0;
        return x + y
    }, 0 );
} );
$(document).ready(function() {
    var payments_id = $("#payments-detail-table").data('payments').toString();
    var table = $('#payments-detail-table').DataTable( {
        responsive: false,
        autoWidth : false,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax" : {
            "url": "/api/payments/details/"+payments_id,
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
        'columns': [
            {
                data: 'account_name',
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
                data: 'amount',
                render: function(data, type, row, meta){
                    return '$ '+parseFloat(row.amount).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            }
        ],
        'columnDefs': [
            {
                "orderable": false,
                'targets': [0,1,2]
            }
        ],
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
        footerCallback: function (tfoot, data, start, end, display) {
            var api = this.api();
            $('tfoot th').eq(2).html('$ '+ parseFloat( api.column(2, {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>');
        },
    } );
});