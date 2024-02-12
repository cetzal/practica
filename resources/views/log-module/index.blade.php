@extends('template.app') 
@section('content')
<section>
<div class="container-fluid mb-2">
            <a href="#" class="btn btn-primary delete_all"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
            <a href="#" class="btn btn-primary active_all"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
            <a href="#" class="btn btn-primary desactive_all"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a>
            <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i><i class="fa fa-pencil" aria-hidden="true"></i></a>
        </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_search">
            <div class="row">
                <div class="col">
                    <label for="code_prod">Code</label>
                    <input type="text" class="form-control" placeholder="Code" name="code_prod">
                </div>
                <div class="col">
                    <label for="name_rod">Name</label>
                    <input type="text" class="form-control" placeholder="Name" name="name_prod">
                </div>
                <div class="col">
                    <label for="brand_prod">Brand</label>
                    <input type="text" class="form-control" placeholder="Brand" name="brand_prod">
                </div>
                <div class="col">
                    <label for="last_name">Usuario alta</label>
                    <input type="text" class="form-control" placeholder="User" name="user_created">
                </div>
            </div>
            <div class="row">
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
                <!-- <div class="col">
                    <div class="form-group">
                        <label>Fecha alta</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="date_create" id="date_create" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Fecha modificacion</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="date_update" id="date_update" class="form-control" />
                        </div>
                    </div>
                </div> -->
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
            </div>
        </form>
    </div>

    <div class="table-responsive">
        <table id="log-table" class="table" style="width: 100%">
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
@endsection
@section('scripts')
<script type="text/javascript">
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    // $(document).ready(function() {
        var table = $('#log-table').DataTable({
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
                        'targets': [0],
                        'render' : function(data, type, row, meta){
                            return row.module;
                        }
                    },
                    {
                        'targets': [1],
                        'render' : function(data, type, row, meta){
                            return row.movement_type;
                        }
                    },
                    {
                        'targets': [0],
                        'render' : function(data, type, row, meta){
                            return row.user_name;
                        }
                    },
                    {
                        'targets': [4],
                        'render' : function(data, type, row, meta){
                            var url_edit = "{{route('products.edit', [':id'])}}";
                            url_edit = url_edit.replace(':id', row.id);
                            let $html =  '<a href="'+url_edit+'" class="btn bg-success btn-sm" data-id="'+row.id+'"><i class="fa fa-eye" aria-hidden="true"></i></a>';
                            // $html +=  '<a class="btn bg-danger m-1 remove btn-sm" data-id="'+row.id+'"><i class="fa fa-trash" aria-hidden="true"></i></a>';
                            // if(row.is_active == 1){
                            //     $html +=  '<a class="btn bg-grey m-1 desactivar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
                            // }else{
                            //     $html +=  '<a class="btn bg-grey m-1 activar btn-sm" data-id="'+row.id+'"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
                            // }
                            //$html += '<a class="btn bs-info m-1 view"><i class="fa fa-info-circle" aria-hidden="true"></i></a>';
                            return $html;
                        }
                    }
                ]
            }
        );
    // });

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