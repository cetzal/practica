(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(document).ready(function() {

        $( "#range_date" ).daterangepicker({
            opens: 'left',
            //maxDate: moment().endOf('month'),
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

        var table = $('#log-data-table').DataTable({
                searching: false,
                bProcessing: true,
                "ajax": {
                    url: "api/log-module/list",
                    "data": function(d) {
                        var frm_data = $('form#from_search_log').serializeArray();
                        // return frm_data;
                        $.each(frm_data, function(key, val) {
                            d[val.name] = val.value;
                        });
                    },
                    type: "GET"
                },
                'language': {
                    // 'lengthMenu': '_MENU_ {{trans("file.records per page")}}',
                    // "info":      '<small>{{trans("file.Showing")}} _START_ - _END_ (_TOTAL_)</small>',
                    // "search":  '{{trans("file.Search")}}',
                    'lengthMenu': '_MENU_',
                    "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
                    "search":  'Search',
                    'paginate': {
                        'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                        'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                    }
                },
                'createdRow': function(row, data, dataIndex) {
                    $(row).attr('data-log-id', data['id']);
                },
                'columnDefs': [
                    {
                        "orderable": false,
                        'targets': [0]
                    },
                    {
                        'render' : function(data, type, row, meta){
                            return row.module_name;
                        },
                        'targets': [0]
                    },
                    {
                        'render' : function(data, type, row, meta){
                            return row.movement_type_name;
                        },
                        'targets': [1],
                    },
                    {
                        'render' : function(data, type, row, meta){
                            return row.user_name;
                        },
                        'targets': [2]
                    },
                    {
                        'render' : function(data, type, row, meta){
                            if (row.movement_date == null) {
                                return '';
                            }
                            return moment(row.movement_date).format('DD/MM/YYYY HH:mm:ss');
                        },
                        'targets': [3]
                    },
                    {
                        'render' : function(data, type, row, meta){
                            // var url_edit = "{{route('products.edit', [':id'])}}";
                            // url_edit = url_edit.replace(':id', row.id);
                            let $html =  '<a href="#" class="btn bg-primary btn-sm open-EditbrandDialog" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#detailLogModal"><i class="fa fa-eye text-white" aria-hidden="true"></i></a>';
                            return $html;
                        },
                        'targets': [4],
                    }
                ]
            }
        );
    });
    $('#log-data-table').on('click', '.open-EditbrandDialog ', function() {
        var url = "api/log-module/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/edit");
        $.get(url, function(data) {
            let details = JSON.parse(data.details);
            let previous_value = details.previous_value;
            let current_value = details.current_value;
            console.log('current value', current_value);
            let html =''
            if (previous_value != null) {
                html='<table>'
                +'<thead><tr><th></th><th>Previous</th><th>Current</th></tr></thead>';
                var tr = '<tbody>';
                let keys_previous = Object.keys(previous_value);
                for (let index = 0; index < keys_previous.length; index++) {
                    if (typeof previous_value[keys_previous[index]] != undefined) {
                        tr+='<tr><td><b>'+keys_previous[index]+'</b></td><td>'+previous_value[keys_previous[index]]+'</td>'+
                        '<td>'+current_value[keys_previous[index]]+'</td></tr>';
                    }
                }
            } else {
                html='<table>'
                +'<thead><tr><th></th><th>Current</th></tr></thead>';
                var tr = '<tbody>';
                let keys_current = Object.keys(current_value);
                for (let index = 0; index < keys_current.length; index++) {
                    if (typeof current_value[keys_current[index]] != undefined) {
                        tr+='<tr><td><b>'+keys_current[index]+'</b></td>'+
                        '<td>'+current_value[keys_current[index]]+'</td></tr>';
                    }
                }
            }
            tr+='</tbody>'
            html+=tr;
            html+='</table>'
            // $("#detail_log").text(data.details);
            $("#detail_log").html(html);
    
            // <thead>
            //     <tr>
            //         <th>{{trans('file.module')}}</th>
            //         <th>{{trans('file.movement_type')}}</th>
            //         <th>{{trans('file.User')}}</th>
            //         <th class="not-exported">{{trans('file.action')}}</th>
            //     </tr>
            // </thead>
            // $('#text').text('Ejemplo con text()');
            // $("input[name='name']").val(data['name']);
            // $("input[name='description']").val(data['description']);
            // $("input[name='brand_id']").val(data['id']);
    
        });
    });
    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        console.log('click a form');
        $('.form_search').toggleClass('form_search_active');
    });
    
    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });
    $( "#from_search_log" ).on( "submit", function( event ) {
        event.preventDefault();
        $('#log-data-table').DataTable().ajax.reload();
    });
    
    $('.clear_form').on('click', function(e){
        $('#from_search_log')[0].reset();
        $('#log-data-table').DataTable().ajax.reload();
    });
})();