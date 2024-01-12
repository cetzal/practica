@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid">
        <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#createModal"><i class="dripicons-plus"></i> {{trans('file.Add Brand')}} </button>&nbsp;
    </div>
    <div class="table-responsive">
        <table id="biller-table" class="table">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.Brand')}}</th>
                    <th>{{trans('file.Description')}}</th>
                    <th>{{trans('file.Status')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            <tbody>
              
            </tbody>
        </table>
    </div>
</section>

<div id="createModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog">
      <div class="modal-content">
        {!! Form::open([ 'route' => 'api.brand.store', 'method' => 'post', 'files' => true, 'id'=> 'new_brand']) !!}
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">{{trans('file.Add Brand')}}</h5>
          <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true"><i class="dripicons-cross"></i></span></button>
        </div>
        <div class="modal-body">
          <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
            <div class="form-group">
                <label>{{trans('file.name')}} *</label>
                {{Form::text('name',null,array('required' => 'required', 'class' => 'form-control', 'placeholder' => 'Type brand name...'))}}
            </div>
            <div class="form-group">
                <label>{{trans('file.Description')}} *</label>
                {{Form::text('description',null,array('required' => 'required', 'class' => 'form-control', 'placeholder' => 'Type brand description...'))}}
            </div>
            <div class="form-group">       
              <input type="submit" value="{{trans('file.submit')}}" class="btn btn-primary">
            </div>
        </div>
        {{ Form::close() }}
      </div>
    </div>
</div>

<div id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
  <div role="document" class="modal-dialog">
    <div class="modal-content">
        {{ Form::open([ 'route' => ['api.brand.update', 1], 'method' => 'PUT', 'files' => true, 'id'=> 'update_brand'] ) }}
      <div class="modal-header">
        <h5 id="exampleModalLabel" class="modal-title"> {{trans('file.Update Brand')}}</h5>
        <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true"><i class="dripicons-cross"></i></span></button>
      </div>
      <div class="modal-body">
        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
          <div class="form-group">
            <label>{{trans('file.Title')}} *</label>
            {{Form::text('name',null, array('required' => 'required', 'class' => 'form-control'))}}
        </div>
        <input type="hidden" name="brand_id">
        <div class="form-group">
            <label>{{trans('file.Description')}} *</label>
            {{Form::text('description',null, array('required' => 'required', 'class' => 'form-control'))}}
        </div>
        <div class="form-group">       
            <input type="submit" value="{{trans('file.submit')}}" class="btn btn-primary">
          </div>
        </div>
      {{ Form::close() }}
    </div>
  </div>
</div>
@endsection
@section('scripts')
<script type="text/javascript">

    var brand_id = [];
    
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $( "#select_all" ).on( "change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
    });

    var table = $('#biller-table').DataTable( {
        "ajax" : "{{route('api.brand.list')}}",
        "order": [],
        'language': {
            'lengthMenu': '_MENU_ {{trans("file.records per page")}}',
             "info":      '<small>{{trans("file.Showing")}} _START_ - _END_ (_TOTAL_)</small>',
            "search":  '{{trans("file.Search")}}',
            'paginate': {
                    'previous': '<i class="dripicons-chevron-left"></i>',
                    'next': '<i class="dripicons-chevron-right"></i>'
            }
        },
        // 'columns': [
        //     { 
        //         data: "", "render": function (data, type, full, meta) {
        //             return data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
        //         }
        //     },
        //     { data: 'name' },
        //     { data: 'description' },
        //     { data: 'accion' , "render": function (data, type, full, meta) {
                        
        //         let $html =  '<a class="btn bg-success m-1 update" data-id="'+data+'"><i class="icon-floppy-disk"></i> Update</a>';
        //             $html +=  '<a class="btn bg-danger m-1 remove" data-id="'+data+'"><i class="icon-trash"></i> Delete</a>';
        //             $html +=  '<a class="btn bg-grey m-1 reset" data-id="'+data+'"><i class="icon-reset"></i> Reset</a>';
        //             return $html;
        //         }
        //     },
        // ],
        'columnDefs': [
            {
                "orderable": false,
                'targets': [0]
            },
            {
                'render': function(data, type, row, meta){
                    data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
                   return data;
                },
                'targets': [0],
                'checkboxes': {
                   'selectRow': true,
                   'selectAllRender': '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>'
                },
            },{
                'render': function(data, type, row, meta){
                   return row.name;
                },
                'targets': [1]
            },
            {
                'render': function(data, type, row, meta){
                   return row.description;
                },
                'targets': [2]
            },
            {
                'render': function(data, type, row, meta){
                    return row.is_active == 1 ? 'Activo' : 'suspendiso';
                },
                'targets': [3]
            },
            {
                'render': function(data, type, row, meta){
                    let $html =  '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="icon-floppy-disk"></i> {{trans('file.edit')}}</button>';
                    $html +=  '<a class="btn bg-danger m-1 remove" data-id="'+row.id+'"><i class="icon-trash"></i> {{trans('file.delete')}}</a>';
                    if(row.is_active == 1){
                        $html +=  '<a class="btn bg-grey m-1 desactivar" data-id="'+row.id+'"><i class="icon-reset"></i> Desactivar</a>';
                    }else{
                        $html +=  '<a class="btn bg-grey m-1 activar" data-id="'+row.id+'"><i class="icon-reset"></i> Activar</a>';
                    }
                    return $html;
                
                },
                'targets': [4]
            }
        ],
        'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
    } );

    $('#biller-table').on('click', '.open-EditbrandDialog ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/edit");

        $.get(url, function(data) {
            $("input[name='name']").val(data['name']);
            $("input[name='description']").val(data['description']);
            $("input[name='brand_id']").val(data['id']);

        });
    });

    $('#biller-table').on('click', '.remove ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/delete");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Delete brand?',
            content: 'Realmente quieres eliminar la marca',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'delete brands',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            success: function(response) {
                                $.confirm({
                                    title: response.status,
                                    content: response.message,
                                });
                                table.ajax.reload();
                            }
                        });
                    }
                },
                cancelAction: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });


    $('#biller-table').on('click', '.desactivar ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/desactivar");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Descativar marca?',
            content: 'Realmente quieres desactivar la marca',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'desactivar brands',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'PUT',
                            success: function(response) {
                                $.confirm({
                                    title: response.status,
                                    content: response.message,
                                });
                                table.ajax.reload();
                            }
                        });
                    }
                },
                cancelAction: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });

    $('#biller-table').on('click', '.activar ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/activar");
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Activar brand?',
            content: 'Realmente quieres activar la marca',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'activar brands',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'PUT',
                            success: function(response) {
                                $.confirm({
                                    title: response.status,
                                    content: response.message,
                                });
                                table.ajax.reload();
                            }
                        });
                    }
                },
                cancelAction: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });

    $( 'form#new_brand' ).submit( function(e){
        e.preventDefault();
        
        // var data = $(this);
        var data = new FormData( $( 'form#new_brand' )[ 0 ] );
        var actionUrl = $(this).attr('action');
        var method = $( this ).attr( 'method' );
        
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            data: data,
            type: $( this ).attr( 'method' ),
            url: actionUrl,
            success: function( response ){
                table.ajax.reload();
                $.confirm({
                    title: response.status,
                    content: response.message,
                });
            }
        });
    });

    $( 'form#update_brand' ).submit( function(e){
        e.preventDefault();
        
        // var data = $(this);
        var data = new FormData( $( 'form#update_brand' )[ 0 ] );
        var actionUrl = $(this).attr('action');
        var method = $( this ).attr( 'method' );
        
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            data: data,
            type: $( this ).attr( 'method' ),
            url: actionUrl,
            success: function( response ){
                table.ajax.reload();
                $.confirm({
                    title: response.status,
                    content: response.message,
                });
            }
        });
    });
   
</script>
@endsection