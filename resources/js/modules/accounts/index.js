(function(){
    var table =  $('#clients-data-table').DataTable({
        responsive: true,
        autoWidth : true,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax": {
            "url":  'api/accounts',
            "data": function(d) {
                var frm_data = $('form#from_search_client').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });
            }
        },
        "createdRow": function( row, data, dataIndex ) {
                $(row).addClass('client-link');
                $(row).attr('data-client', JSON.stringify(data));
        },
        'columns': [
            { 
                data: "text", "render": function (data, type, full, meta) {
                        return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes checkbox_client"><label></label></div>';
                    }
            }
        ],
        "columnDefs": [
            {
                    "orderable": false,
                    'targets': [0]
            },
            {
                targets : [1],
                render : function(data, type, row, meta){
                    return row.name;
                }
            },
            { 
                targets : [2],
                render: function (data, type, row, meta) {
                    var is_active = row.is_active == 1 ? 'Activo' : 'Desactivado';
                    var class_text = "text-success";
                    if (row.is_active == 0) {
                        class_text = "text-warning";
                    }
                    data = '<span class="'+ class_text +'">'+ is_active +'</span>';
                    return data;
                }
            },

            {
                targets : [3],
                render : function(data, type, row, meta){
                    return row.created_by;
                }
            },

            {
                targets : [4],
                render: function(data, type, row, meta){                    
                    if (row.created_at == null) {
                        return '';
                    }
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                targets : [5],
                render: function(data, type, row, meta){
                    if (row.updated_at == null) {
                        return '';
                    }
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                targets : [6],
                render: function (data, type, row, meta) {
                        
                    let html =  '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></button>';
                    html +=  '<a class="btn bg-danger m-1 remove" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                    html +=  '<a href="#" class="btn bg-primary btn-sm redirect-record-log" data-record-id="'+row.id+'" data-record-name="'+row.name+'"><i class="fa fa-eye" aria-hidden="true"></i></a>';
                    if(row.is_active == 1){
                        html +=  '<a class="btn bg-grey m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
                    }else{
                        html +=  '<a class="btn bg-grey m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
                    }
                    
                    return html;
                 }
            },
        ],
        "order": [],
        'language': {
            'infoFiltered': ' - filtrado de _MAX_ registros en total',
            'lengthMenu': '_MENU_',
            "info":      '<small> _START_ - _END_ (_TOTAL_)</small>',
            "search":  '',
            'paginate': {
                    'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            }
        }, 
    });
})();