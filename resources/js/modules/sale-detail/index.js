jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return this.flatten().reduce( function ( a, b ) {
        var x = parseFloat(a) || 0;
        var y = parseFloat(b) || 0;
        return x + y
    }, 0 );
} );

(function() {
    $(document).ready(function() {
        var sale_id = $("#sale-detail-table").data('sale').toString();
        var table = $('#sale-detail-table').DataTable( {
            responsive: false,
            autoWidth : false,
            serverSide: true,
            "searching": false,
            "bProcessing": true,
            "ajax" : {
                "url": "/api/sale-details/"+sale_id,
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
                    data: 'product_code',
                    render: function(data, type, row, meta){
                        return row.product_code;
                    }
                },
                {
                    data: 'product_name',
                    render: function(data, type, row, meta){
                        return row.product_name;
                    }
                },
                {
                    data: 'supplier_name',
                    render: function(data, type, row, meta){
                        return row.supplier_name;
                    }
                },
                {
                    data: 'brand_name',
                    render: function(data, type, row, meta){
                        return row.brand_name;
                    }
                },
                {
                    data: 'quantity',
                    render: function(data, type, row, meta){
                        return row.quantity;
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
                }
            ],
            "footerCallback": function (tfoot, data, start, end, display) {
                var api = this.api(),
                columns = [4]
                column_currencies = [5]; // Add columns here

                for (var i = 0; i < columns.length; i++) {
                    
                    $('tfoot th').eq(columns[i]).html( api.column(columns[i], {page:'current'}).data().sum() + '<br>');
                
                }

                for (var i = 0; i < column_currencies.length; i++) {
                    
                    $('tfoot th').eq(column_currencies[i]).html( 
                        '$ ' + parseFloat(api.column(column_currencies[i], {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>'
                    );
                
                }
            },
            // 'select': { style: 'multi',  selector: 'td:first-child'},
            'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
        
        } );
    });
})();