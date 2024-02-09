@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#createModal"><i class="dripicons-plus"></i> {{trans('file.Add Brand')}} </button>&nbsp;
        <a href="#" class="btn btn-danger delete_all"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
        <a href="#" class="btn btn-success active_all"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
        <a href="#" class="btn btn-warning desactive_all"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a>
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_brand_search">
            <div class="row">
                <div class="col">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" placeholder="Brand name" name="name">
                </div>
                <div class="col">
                    <label for="created_by">Created by</label>
                    <input type="text" class="form-control" placeholder="Last name" name="created_by">
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>status</label>
                        <select class="form-select" name="status">
                            <option selected value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
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
                        <label>Rango de fecha</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="range_date" id="range_date" class="form-control" />
                        </div>
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
        <table id="brand-table" class="table table-striped nowrap">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.Brand')}}</th>
                    <th>{{trans('file.Description')}}</th>
                    <th>{{trans('file.Status')}}</th>
                    <th>{{trans('file.CreatedBy')}}</th>
                    <th>{{trans('file.CreatedAt')}}</th>
                    <th>{{trans('file.UpdatedAt')}}</th>
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
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
        </div>
        <div class="modal-body">
          <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
            <div class="form-group">
                <label>{{trans('file.name')}} *</label>
                <input type="text" name="name" required class="form-control" value="" placeholder="Type brand name...">
                @if($errors->has('name'))
                <span>
                    <strong>{{ $errors->first('name') }}</strong>
                </span>
                @endif
            </div>
            <div class="form-group">
                <label>{{trans('file.Description')}} *</label>
                <input type="text" name="description" required class="form-control" value="" placeholder="Type brand description...">
                @if($errors->has('description'))
                <span>
                    <strong>{{ $errors->first('description') }}</strong>
                </span>
                @endif
            </div>
            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <input type="submit" value="{{trans('file.submit')}}" class="btn btn-primary">
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
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
      </div>
      <div class="modal-body">
        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
          <div class="form-group">
            <label>{{trans('file.Title')}} *</label>
            <input type="text" name="name" required class="form-control" value="" placeholder="Type brand name...">
            @if($errors->has('name'))
                <span>
                    <strong>{{ $errors->first('name') }}</strong>
                </span>
            @endif
        </div>
        <input type="hidden" name="brand_id">
        <div class="form-group">
            <label>{{trans('file.Description')}} *</label>
            <input type="text" name="description" required class="form-control" value="" placeholder="Type brand description...">
            @if($errors->has('description'))
                <span>
                    <strong>{{ $errors->first('description') }}</strong>
                </span>
            @endif
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

    $( "#range_date" ).daterangepicker({
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

    brand_ids = [];
    //Eliminar todas las marcas
    

    $( "#select_all" ).on( "change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
    });

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    var table = $('#brand-table').DataTable( {
        responsive: true,
        autoWidth : true,
        serverSide: true,
        "searching": false,
        "bProcessing": true,
        "ajax" : {
            "url": "{{route('api.brand.list')}}",
            "data": function(d) {
                var frm_data = $('form#from_brand_search').serializeArray();
                // return frm_data;
                $.each(frm_data, function(key, val) {
                    d[val.name] = val.value;
                });

                console.log('form_data', frm_data);
            }
        },
        "order": [],
        'language': {
            'lengthMenu': '_MENU_ {{trans("file.records per page")}}',
             "info":      '<small>{{trans("file.Showing")}} _START_ - _END_ (_TOTAL_)</small>',
            "search":  '{{trans("file.Search")}}',
            'paginate': {
                'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
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
        'createdRow': function(row, data, dataIndex) {
            $(row).attr('data-branch-id', data['id']);
        },
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
                    return row.is_active == 1 ? 'Activo' : 'suspendido';
                },
                'targets': [3]
            },
            {
                'render': function(data, type, row, meta){
                    return row.created_by;
                },
                'targets': [4]
            },
            {
                'render': function(data, type, row, meta){
                    return moment(row.created_at).format('MM/DD/YYYY HH:mm:ss');
                },
                'targets': [5]
            },
            {
                'render': function(data, type, row, meta){
                    return moment(row.updated_at).format('MM/DD/YYYY HH:mm:ss');
                },
                'targets': [6]
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
                'targets': [7]
            },
            { targets: [1], className: "text-center"},
            {targets: [0, 1, 2, 3], searchable: false}
        ],
        // 'select': { style: 'multi',  selector: 'td:first-child'},
        'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
       
    } );

    $(".delete_all").on('click', function(e){
        e.preventDefault();
        brand_ids = [];
        verific_checks(0);
        if(brand_ids.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.brand.all_delete")}}',
                data:{
                    brandIdArray: brand_ids
                },
                success:function(data){
                    $.confirm({
                        title: 'Eliminar marcas',
                        content: 'se elimino todo las marcas selecionados',
                        buttons: {
                            ok: function () {
                                table.ajax.reload();
                                $("tbody input[type='checkbox']").prop('checked', false);
                            }
                        }
                    });
                }
            });
        }else{
            $.confirm({
                title: 'Eliminar marcas',
                content: 'Seleccione las marcas que deseas eliminar',
            });
        }
    });

    //Activar todas las marcas seleccionas
    $(".active_all").on('click', function(e){
        e.preventDefault();
        brand_ids = [];
        verific_checks(0);
        if(brand_ids.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.brand.all_active")}}',
                data:{
                    brandIdArray: brand_ids
                },
                success:function(data){
                    $.confirm({
                        title: 'Activar marcas',
                        content: 'Se activo todo las marcas selecionados ',
                        buttons: {
                            ok: function () {
                                console.log('activar todas las marcas');
                                table.ajax.reload();
                                $("tbody input[type='checkbox']").prop('checked', false);
                            }
                        }
                    });
                }
            });
        }else{
            $.confirm({
                title: 'Activar marcas',
                content: 'Seleccione los marcas que deseas activar',
            });
        }
    });

    // Desactivas todas las marcas seleccionadas
    $(".desactive_all").on('click', function(e){
        e.preventDefault();
        brand_ids = [];
        verific_checks(0);
        if(brand_ids.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.brand.all_desactive")}}',
                data:{
                    brandIdArray: brand_ids
                },
                success:function(data){
                    $.confirm({
                        title: 'Desactivar marcas',
                        content: 'Se desactivo todas los marcas selecionados ',
                        buttons: {
                            ok: function () {
                                console.log('desactivar todas las marcas');
                                table.ajax.reload();
                                $("tbody input[type='checkbox']").prop('checked', false);
                                // $('#brand-table').DataTable().ajax().reload();
                            }
                            // cancel: function () {
                            //     $.alert('Canceled!');
                            // },
                            // somethingElse: {
                            //     text: 'Something else',
                            //     btnClass: 'btn-blue',
                            //     keys: ['enter', 'shift'],
                            //     action: function(){
                            //         $.alert('Something else?');
                            //     }
                            // }
                        }
                    });
                    
                }
            });
        }else{
            $.confirm({
                title: 'Desactivar marcas',
                content: 'Seleccione lass marcas que deseas desactivar',
            });
        }
    });

    var verific_checks = function(num){
        $(':checkbox:checked').each(function(i){
            i+=num;
            if(i){
                var brand_data = $(this).closest('tr').data('branch-id');
                console.log(brand_data);
                brand_ids[i-1] = brand_data;
            }
        });
    }

    $( "#from_brand_search" ).on( "submit", function( event ) {
        event.preventDefault();
        table.ajax.reload();
    });

    $('.clear_form').on('click', function(e){
        $('#from_brand_search')[0].reset();
        table.ajax.reload();
    });

    $('#brand-table').on('click', '.open-EditbrandDialog ', function() {
        var url = "api/brand/"
        var id = $(this).data('id').toString();
        url = url.concat(id).concat("/edit");

        $.get(url, function(data) {
            $("input[name='name']").val(data['name']);
            $("input[name='description']").val(data['description']);
            $("input[name='brand_id']").val(data['id']);

        });
    });

    $('#brand-table').on('click', '.remove ', function() {
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


    $('#brand-table').on('click', '.desactivar ', function() {
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

    $('#brand-table').on('click', '.activar ', function() {
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

    $('form#new_brand').validate({
        rules:{
            name: 'required',
            description : 'required'
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid');
        },
        errorPlacement: function ( error, element ) {
            // Add the `invalid-feedback` class to the error element
            error.addClass("invalid-feedback" );
            error.insertAfter(element);
        },
        messages: {
            name: "El nombre es requerido",
            description: "La descripcion es requerido"
        }
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
                // $("#createModal").hide();
            }
        });
    });

    $('form#update_brand').validate({
        rules:{
            name: 'required',
            description : 'required'
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid');
        },
        errorPlacement: function ( error, element ) {
            // Add the `invalid-feedback` class to the error element
            error.addClass("invalid-feedback" );
            error.insertAfter(element);
        },
        messages: {
            name: "El nombre es requerido",
            description: "La descripcion es requerido"
        }
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
                $('#editModal').modal('hide');
                $('#editModal').modal({backdrop: false});
                $('.modal-backdrop').remove();
                $.confirm({
                    title: response.status,
                    content: response.message,
                });
            }
        });
    });
   
</script>
@endsection