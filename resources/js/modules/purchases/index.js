(function(){
    $("#purchase-table").DataTable({
        "processing": true,
        "serverSide": true,
        "ajax":{
            url:"/api/purchase",
            dataType: "json",
            type:"GET",
            /*success:function(data){
                console.log(data);
            }*/
        },
        "createdRow": function( row, data, dataIndex ) {
            $(row).addClass('purchase-link');
            $(row).attr('data-purchase', data['purchase']);
        },
        "columns": [
            {"data": "key"},
            {"data": "date"},
            {"data": "supplier"},
            {"data": "Items"},
            {"data": "Total"},
          
        ],
        'language': {
            /*'searchPlaceholder': "{{trans('file.Type date or purchase reference...')}}",*/
            'lengthMenu': '_MENU_',
            "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
            //"search":  '{{trans("file.Search")}}',
            'paginate': {
                    'previous': '<i class="dripicons-chevron-left"></i>',
                    'next': '<i class="dripicons-chevron-right"></i>'
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
                    if(type === 'display'){
                        data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
                    }

                   return data;
                },
                'checkboxes': {
                   'selectRow': true,
                   'selectAllRender': '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>'
                },
                'targets': [0]
            },{
                targets: [1],
                render : function(data, type, row, meta){
                    return row.purchase_date;
                }
            },
            {
                targets: [2],
                render : function(data, type, row, meta){
                    return row.supplier_name;
                }
            },
            {
                targets: [3],
                render : function(data, type, row, meta){
                    return row.qty;
                }
            },
            {
                targets: [4],
                render : function(data, type, row, meta){
                    return row.toital;
                }
            }
        ],
        'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
        
    });
})();