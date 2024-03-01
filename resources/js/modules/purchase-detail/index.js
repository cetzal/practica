jQuery.fn.dataTable.Api.register( 'sum()', function ( ) {
    return this.flatten().reduce( function ( a, b ) {
        var x = parseFloat(a) || 0;
        var y = parseFloat(b) || 0;
        return x + y
    }, 0 );
} );

(function() {
    $(document).ready(function() {
        var purchase_id = $("#purchase-detail-table").data('purchase').toString();
        var table = $("#purchase-detail-table").DataTable({
            "searching": false,
            "processing": true,
            "serverSide": true,
            "ajax":{
                url:"/api/purchase-details/"+purchase_id,
            },
            'columns' : [
                {
                    data: 'code',
                    render : function(data, type, row, meta){
                        return row.code;
                    }
                },
                {
                    data: 'product_name',
                    render : function(data, type, row, meta){
                        return row.product_name;
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
                        return '$ '+parseFloat(row.total).toLocaleString('en-US', {minimumFractionDigits: 2});
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
                var api = this.api();
                $('tfoot th').eq(3).html( api.column(3, {page:'current'}).data().sum() + '<br>');
                $('tfoot th').eq(4).html('$ '+ parseFloat( api.column(4, {page:'current'}).data().sum()).toLocaleString('en-US', {minimumFractionDigits: 2}) + '<br>');
            },
            drawCallback: function () {
                var api = this.api();
                //datatable_sum(api, false);
            }
            
        });
    });
})();