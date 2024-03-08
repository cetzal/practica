(function(){

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $( "#from_accounts_search" ).on( "submit", function( event ) {
        event.preventDefault();
        var date_range = $('#date_range').val();
        var type_fecha = $('.client-select-date').val();
        if(type_fecha=='' && date_range !== ''){
            $.alert({
                title: 'Filtra datos',
                content:'Selecione un tipo de fecha a consultar',
            });

            return '';
        }

        if(date_range == '' && type_fecha !== ''){
            $.alert({
                title: 'Filtra datos',
                content:'Selecione el rango de fecha',
            });

            return '';
        }

        table.ajax.reload();
    });

    $('.clear_form').on('click', function(e){
        $('#from_accounts_search')[0].reset();
        table.ajax.reload();
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    $('.open-modal-account').on('click', function(e) {
        e.preventDefault();
        $('form#new_accounts')[0].reset();
        // load_combobox("#suppliers_id");
    });


    var table =  $('#accounts-table').DataTable({
        responsive: true,
        autoWidth : true,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax": {
            "url":  'api/accounts',
            "data": function(d) {
                var frm_data = $('form#from_accounts_search').serializeArray();
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
                data: "check", 
                render: function (data, type, full, meta) {
                    return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes checkbox_client"><label></label></div>';
                }
            },
            {
                data: "name", 
                render : function(data, type, row, meta){
                    return row.name;
                }
            },
            {
                data : 'init_balance',
                render : function(data, type, row, meta){
                    return '$ '+parseFloat(row.init_balance).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
            {
                data : 'renueve',
                render : function(data, type, row, meta){
                    return '$ '+parseFloat(row.revenue).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
            {
                data : 'egress',
                render : function(data, type, row, meta){
                    return 0;
                }
            },
            {
                data : 'balance',
                render : function(data, type, row, meta){
                    return '$ '+parseFloat(row.balance).toLocaleString('en-US', {minimumFractionDigits: 2});
                }
            },
            { 
                data: "null", 
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
                data: "null", 
                render : function(data, type, row, meta){
                    return row.created_by;
                }
            },

            {
                data: "null", 
                render: function(data, type, row, meta){                    
                    if (row.created_at == null) {
                        return '';
                    }
                    return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                data: "null", 
                render: function(data, type, row, meta){
                    if (row.updated_at == null) {
                        return '';
                    }
                    return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            {
                data: "null", 
                render: function (data, type, row, meta) {
                        
                    let html =  '<button type="button" class="open-EditAccountDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></button>';
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
        "columnDefs": [
            {
                    "orderable": false,
                    'targets': [0]
            }
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

    $('#accounts-table').on('click', '.open-EditAccountDialog ', function() {
        var url = "api/accounts/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        $("input[name='accounts_id']").val(id);
        $.get(url, function(response) {
            if(response.status == "success"){
                $("input[name='name']").val(response.data.name);
                $("input[name='init_balance']").val(response.data.init_balance);
                $("input[name='is_active']").prop( "checked", response.data.is_active );
            }
            
        });
    });
})();