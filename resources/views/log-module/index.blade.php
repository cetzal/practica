@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i><i class="fa fa-pencil" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_search">
            <div class="row">
                <div class="col">
                    <label for="code_prod">Module</label>
                    <input type="text" class="form-control" placeholder="Module" name="search_module">
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Movement type</label>
                        <select class="form-select" name="select_movement">
                            <option selected value="">Seleccione</option>
                            <option value="created">Creacion</option>
                            <option value="updated">Actualizacion</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>Seleccione fecha</label>
                        <select class="form-select" name="select_date">
                            <option selected value="">Seleccione</option>
                            <option value="created_at">Fecha creacion</option>
                            <option value="updated_at">Fecha actualizacion</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Fecha inicio y fin</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="date_range" id="date_range" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>status</label>
                        <select class="form-select" name="prod_status">
                            <option selected value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data">Filtrar</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form">Limpiar</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">Close</button>
                </div>
            </div> -->
        </form>
    </div>

    <div class="table-responsive">
        <table id="log-data-table" class="table" style="width:100%">
            <thead>
                <tr>
                    <th>{{trans('file.module')}}</th>
                    <th>{{trans('file.movement_type')}}</th>
                    <th>{{trans('file.User')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            
        </table>
    </div>
</section>

<div id="detailLogModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
  <div role="document" class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="exampleModalLabel" class="modal-title"> {{trans('file.detail_log')}}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
      </div>
      <div class="modal-body">

      <div id="detail_log">

      </div>
    </div>
  </div>
</div>
@endsection
@section('scripts')
<script type="text/javascript">
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(document).ready(function() {
        var table = $('#log-data-table').DataTable({
                searching: false,
                bProcessing: true,
                "ajax": {
                    url: "{{route('api.logs.list')}}",
                    "data": function(d) {
                        var frm_data = $('form#from_search').serializeArray();
                        // return frm_data;
                        $.each(frm_data, function(key, val) {
                            d[val.name] = val.value;
                        });
                    },
                    type: "GET"
                },
                'language': {
                    'lengthMenu': '_MENU_ {{trans("file.records per page")}}',
                    "info":      '<small>{{trans("file.Showing")}} _START_ - _END_ (_TOTAL_)</small>',
                    "search":  '{{trans("file.Search")}}',
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
                            return row.module;
                        },
                        'targets': [0]
                    },
                    {
                        'render' : function(data, type, row, meta){
                            return row.movement_type;
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
                            // var url_edit = "{{route('products.edit', [':id'])}}";
                            // url_edit = url_edit.replace(':id', row.id);
                            let $html =  '<a href="#" class="btn bg-primary btn-sm open-EditbrandDialog" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#detailLogModal"><i class="fa fa-eye text-white" aria-hidden="true"></i></a>';
                            return $html;
                        },
                        'targets': [3],
                    }
                ]
            }
        );
    });
    $('#log-data-table').on('click', '.open-EditbrandDialog ', function() {
        var url = "api/log-module/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/edit");
        console.log('id', id, url);
        $.get(url, function(data) {
            var details = JSON.parse(data.details);
            var previous_value = details.previous_value;
            var current_value = details.current_value;
            var keys_previous = Object.keys(previous_value);
            
            var html='<table>'+
                      +'<thead><tr><th></th><th>Previous</th><th>Current</th></tr></thead>';
                      var tr = '<tbody>';
                      for (let index = 0; index < keys_previous.length; index++) {
                        if (typeof previous_value[keys_previous[index]] != undefined) {
                            tr+='<tr><td>'+keys_previous[index]+'</td><td>'+previous_value[keys_previous[index]]+'</td>'+
                            '<td>'+current_value[keys_previous[index]]+'</td></tr>';
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
    $( "#from_search" ).on( "submit", function( event ) {
        event.preventDefault();
        $('#log-table').DataTable().ajax.reload();
    });

    $('.clear_form').on('click', function(e){
        $('#from_search')[0].reset();
        $('#log-table').DataTable().ajax.reload();
    });
</script>
@endsection