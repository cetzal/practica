(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    var host = window.location.origin;
    var record_id = $('#log-record-table').data('record-id').toString();
    var module_name = $('#log-record-table').data('module-name').toString()
    
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

        ;
        
        var table = $('#log-record-table').DataTable({
            searching: false,
            bProcessing: true,
            "ajax": {
                url: host + "/api/log-record/"+record_id+"/list?module_name="+module_name,
                "data": function(d) {
                    var frm_data = $('form#form_serach_log_record').serializeArray();
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
                $(row).attr('data-log-record-id', data['id']);
            },
            'columnDefs': [
                {
                    "orderable": false,
                    'targets': [0]
                },
                {
                    'render' : function(data, type, row, meta){
                        return row.movement_type_name;
                    },
                    'targets': [0]
                },
                {
                    'render' : function(data, type, row, meta){
                        return row.user_name;
                    },
                    'targets': [1],
                },
                {
                    'render' : function(data, type, row, meta){
                        return row.movement_date;
                    },
                    'targets': [2]
                },
                {
                    'render' : function(data, type, row, meta){
                        // var url_edit = "{{route('products.edit', [':id'])}}";
                        // url_edit = url_edit.replace(':id', row.id);
                        let $html =  '<a href="#" class="btn bg-primary btn-sm open-EditLogRecordDialog" data-log-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#detailLogRecordModal"><i class="fa fa-eye text-white" aria-hidden="true"></i></a>';
                        return $html;
                    },
                    'targets': [3],
                }
            ]
        }
    );
    });

    $('#log-record-table').on('click', '.open-EditLogRecordDialog ', function() {
        var url = host + "/api/log-record/"
        var id = $(this).data('log-id').toString();
        url = url.concat(record_id).concat("/show").concat('/'+id).concat('?module_name='+module_name);
        $.get(url, function(data) {
            let details = JSON.parse(data.details);
            let previous_value = details.previous_value;
            let current_value = details.current_value;
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
        $('.form_search').toggleClass('form_search_active');
    });
    
    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });
    $( "#form_serach_log_record" ).on( "submit", function( event ) {
        event.preventDefault();
        $('#log-record-table').DataTable().ajax.reload();
    });
    
    $('.clear_form').on('click', function(e){
        $('#form_serach_log_record')[0].reset();
        $('#log-record-table').DataTable().ajax.reload();
    });
})();