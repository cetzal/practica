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
        "createdRow": function( row, data, dataIndex ) {
            $(row).addClass('purchase-link');
            $(row).attr('data-purchase', data['purchase']);
        },
        "columns": [
             ],
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
            ,{
                targets: [0],
                render : function(data, type, row, meta){
                    return row.purchase_date;
                }
            },
            {
                targets: [1],
                render : function(data, type, row, meta){
                    return row.supplier_name;
                }
            },
            {
                targets: [2],
                render : function(data, type, row, meta){
                    return row.qty;
                }
            },
            {
                targets: [3],
                render : function(data, type, row, meta){
                    return row.toital;
                }
            }
        ],
        'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
        
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

    
    $('.clear_form_purchases').on('click', function(e){
        location.reload();
    });
})();