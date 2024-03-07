(function() {
    $(document).ready(function() {
        var charge_id = $("#charge-detail-table").data('charge').toString();
        var table = $('#charge-detail-table').DataTable( {
            responsive: false,
            autoWidth : false,
            serverSide: true,
            "searching": false,
            "bProcessing": true,
            "ajax" : {
                "url": "/api/charges/details/"+charge_id,
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
                    data: 'client_name',
                    render: function(data, type, row, meta){
                        return row.client_name;
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
                    'targets': [0]
                }
            ],
            "footerCallback": function (tfoot, data, start, end, display) {
                // var api = this.api(),
                // columns = [4]
                // column_currencies = [5]; // Add columns here

                // for (var i = 0; i < columns.length; i++) {
                    
                //     $('tfoot th').eq(columns[i]).html( api.column(columns[i], {page:'current'}).data().sum() + '<br>');
                
                // }

                // for (var i = 0; i < column_currencies.length; i++) {
                    
                //     $('tfoot th').eq(column_currencies[i]).html( 
                //         '$ ' + parseFloat(api.column(column_currencies[i], {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>'
                //     );
                
                // }
            },
            // 'select': { style: 'multi',  selector: 'td:first-child'},
            'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
        
        } );
    });
})();