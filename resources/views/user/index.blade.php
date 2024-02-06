@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <a href="{{route('user.create')}}" class="btn btn-info"><i class="dripicons-plus"></i> {{trans('file.Add User')}}</a>
        <a href="#" class="btn btn-primary delete_all"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
        <a href="#" class="btn btn-primary active_all"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
        <a href="#" class="btn btn-primary desactive_all"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a>
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">
        <form>
            <div class="row">
                <div class="col">
                    <label for="fisrt_name"> First name</label>
                    <input type="text" class="form-control" placeholder="User name" name="first_name">
                </div>
                <div class="col">
                    <label for="last_name">Last name</label>
                    <input type="text" class="form-control" placeholder="Last name" name="last_name">
                </div>
                <div class="col">
                    <label for="email">Email</label>
                    <input type="text" class="form-control" placeholder="Email" name="email">
                </div>
                <div class="col">
                    <label for="last_name">Usuario alta</label>
                    <input type="text" class="form-control" placeholder="Last name" name="last_name">
                </div>
            </div>
            <div class="row">
                <div class="col">
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
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>status</label>
                        <select class="form-select" aria-label="Default select example">
                            <option selected value="1">Active</option>
                            <option value="2">Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="button" class="btn btn-primary mt-4 filter_data">Filtrar</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form">Limpiar</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">Close</button>
                </div>
            </div>
        </form>
    </div>
    <div class="table-responsive">
        <table id="user-table" class="table table-striped nowrap">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.UserName')}}</th>
                    <th>{{trans('file.UserLastName')}}</th>
                    <th>Imagen</th>
                    <th>{{trans('file.Email')}}</th>
                    <th>{{trans('file.Role')}}</th>
                    <th>{{trans('file.Status')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            <tbody>
               
            </tbody>
        </table>
    </div>
    <div id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog">
          <div class="modal-content">
              {{ Form::open([ 'files' => true, 'id' => 'update_user'] ) }}
            <div class="modal-header">
              <h5 id="exampleModalLabel" class="modal-title"> {{trans('file.Update User')}}</h5>
              <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true"><i class="dripicons-cross"></i></span></button>
            </div>
            <div class="modal-body">
               
                @method('PUT')
                <input type="hidden" name="id" value="" />
                {{-- <input type="hidden" name="user_id"> --}}
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{trans('file.UserName')}} *</strong> </label>
                            <input type="text" name="name" required class="form-control" value="">
                            @if($errors->has('name'))
                            <span>
                                <strong>{{ $errors->first('name') }}</strong>
                            </span>
                            @endif
                        </div>
                        <div class="form-group">
                            <label><strong>{{trans('file.UserLastName')}} *</strong> </label>
                            <input type="text" name="last_name" required class="form-control">
                            @if($errors->has('last_name'))
                           <span>
                               <strong>{{ $errors->first('last_name') }}</strong>
                            </span>
                            @endif
                        </div>
                        <div class="form-group">
                            <label><strong>{{trans('file.Change Password')}}</strong> </label>
                            <div class="input-group">
                                <input type="password" name="password" class="form-control">
                                <div class="input-group-append">
                                    <button id="genbutton" type="button" class="btn btn-default">{{trans('file.Generate')}}</button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mt-3">
                            <label><strong>{{trans('file.Email')}} *</strong></label>
                            <input type="email" name="email" placeholder="example@example.com" required class="form-control" value="">
                            @if($errors->has('email'))
                            <span>
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                            @endif
                        </div>
                        <div class="form-group">
                            <input class="mt-2" type="checkbox" name="is_active" value="1" checked>
                            {{-- @if($lims_user_data->is_active)
                            <input class="mt-2" type="checkbox" name="is_active" value="1" checked>
                            @else
                            <input class="mt-2" type="checkbox" name="is_active" value="1">
                            @endif --}}
                            <label class="mt-2"><strong>{{trans('file.Active')}}</strong></label>
                        </div>
                    </div>
                    <div class="col-md-6">
                       
                        <div class="form-group">
                            <label><strong>{{trans('file.Role')}} *</strong></label>
                            <input type="hidden" name="role_id_hidden" value="">
                            <select name="role_id" required class="selectpicker form-control" data-live-search="true" data-live-search-style="begins" title="Select Role...">
                                <option value="1">ADMIN</option>
                                <option value="2 ">CUSTOMER</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>avatar</strong> </label> <i class="dripicons-question" data-toggle="tooltip" title="{{trans('file.You can upload multiple image. Only .jpeg, .jpg, .png, .gif file can be uploaded. First image will be base image.')}}"></i>
                            <div id="imageUpload" class="dropzone"></div>
                            <span class="validation-msg" id="image-error"></span>
                        </div>
                       
                    </div>                              
                </div>
                                          
                <div class="form-group">       
                    <input type="submit" value="{{trans('file.submit')}}" id="submit-btn" class="btn btn-primary">
                    </div>
                </div>
            {{ Form::close() }}
          </div>
        </div>
      </div>
</section>
@endsection
@section('scripts')
<script type="text/javascript">

    var user_id = [];
    let up_user_id = $("input[name='id']").val();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    
    function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    //dropzone portion
    Dropzone.autoDiscover = false;

    $(".dropzone").sortable({
        items:'.dz-preview',
        cursor: 'grab',
        opacity: 0.5,
        containment: '.dropzone',
        distance: 20,
        tolerance: 'pointer',
        stop: function () {
          var queue = myDropzone.getAcceptedFiles();
          newQueue = [];
          $('#imageUpload .dz-preview .dz-filename [data-dz-name]').each(function (count, el) {           
                var name = el.innerHTML;
                queue.forEach(function(file) {
                    if (file.name === name) {
                        newQueue.push(file);
                    }
                });
          });
          myDropzone.files = newQueue;
        }
    });

    user_id.length = 0;
    $(".delete_all").on('click', function(e){
        e.preventDefault();
        if(user_id.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.user.all_delete")}}',
                data:{
                    userIdArray: user_id
                },
                success:function(data){
                    $.confirm({
                        title: 'Eliminar usuario',
                        content: 'se elimino todo los usuarios selecionados ',
                    });
                    $('#user-table').DataTable().ajax().reload();
                }
            });
        }else{
            $.confirm({
                title: 'Eliminar usuario',
                content: 'Selecciiones los usuario que deseas eliminar',
            });
        }
    });
    $(".active_all").on('click', function(e){
        e.preventDefault();
        if(user_id.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.user.all_active")}}',
                data:{
                    userIdArray: user_id
                },
                success:function(data){
                    $.confirm({
                        title: 'Activar usuario',
                        content: 'se activado todo los usuario selecionados ',
                    });
                    $('#user-table').DataTable().ajax().reload();
                }
            });
        }else{
            $.confirm({
                title: 'Activar usuario',
                content: 'Selecciiones los usuario que deseas activar',
            });
        }
    });
    $(".desactive_all").on('click', function(e){
        e.preventDefault();
        if(user_id.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.user.all_desactive")}}',
                data:{
                    userIdArray: user_id
                },
                success:function(data){
                    $.confirm({
                        title: 'Desactiva usuario',
                        content: 'Se desactivo todo los usuario selecionados ',
                    });
                    $('#user-table').DataTable().ajax().reload();
                }
            });
        }else{
            $.confirm({
                title: 'Desactivar usuario',
                content: 'Selecciiones los usuario que deseas desactivar',
            });
        }
    });

    $('.show_form_search').on('click', function(e){
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    var table = $('#user-table').DataTable( {
        responsive: true,
        autoWidth : true,
        "searching": false,
        "ajax" : "{{route('api.user.list')}}",
        "createdRow": function( row, data, dataIndex ) {
                $(row).addClass('user-link');
                $(row).attr('data-user', JSON.stringify(data));
            },
        'columns': [
            { data: "text", "render": function (data, type, full, meta) {
                        return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
                    }
            },
            { data: 'name' },
            { data: 'last_name' },
            { data: 'picture' , "render": function (data, type, row, meta) {
                var _picture = 'avarat.png';
                    if(row.picture != null){
                        let _pictures = row.picture.split(",");
                        _picture = _pictures[_pictures.length - 1];
                        _picture = escapeHtml(_picture);
                       
                    }
                   
                    return '<img src="{{asset("public/images/user/")}}/'+_picture+'" height="80" width="80">';
                }
            },
            { data: 'email' },
            { data: 'role' , "render": function (data, type, full, meta) {
                        return full.role_id == 1 ? 'ADMIN' : 'CUSTOMER';
                    }
            },
            { data: 'status' , "render": function (data, type, full, meta) {
                        console.log(full.is_active);
                return full.is_active == 1 ? 'Activo' : 'Desactivado';
                }
            },
            { data: 'accion' , "render": function (data, type, row, meta) {
                        
                let $html =  '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="icon-floppy-disk"></i> {{trans('file.edit')}}</button>';
                    $html +=  '<a class="btn bg-danger m-1 remove" data-id="'+row.id+'"><i class="icon-trash"></i> {{trans('file.delete')}}</a>';
                    if(row.is_active == 1){
                        $html +=  '<a class="btn bg-grey m-1 desactivar" data-id="'+row.id+'"><i class="icon-reset"></i> Desactivar</a>';
                    }else{
                        $html +=  '<a class="btn bg-grey m-1 activar" data-id="'+row.id+'"><i class="icon-reset"></i> Activar</a>';
                    }
                    return $html;
                        }
                    },
        ],
        "columnDefs": [
            {
                    "orderable": false,
                    'targets': [0, 3]
            },
                { targets: [1], className: "text-center"},
        ],
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
        
        
        
    } );

  


    $('#user-table').on('click', '.open-EditbrandDialog ', function() {
        var url = "api/user/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        $("input[name='id']").val(id);
        $.get(url, function(data) {
            $("input[name='name']").val(data['name']);
            $("input[name='last_name']").val(data['last_name']);
            $("input[name='email']").val(data['email']);
            $("input[name='role_id']").val(data['role_id']);
            up_user_id = data['id'];
            console.log(up_user_id);
            

        });
    });

    $('#user-table').on('click', '.remove ', function() {
        var url = "api/user/"
        var id = $(this).data('id').toString();
        url = url.concat(id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Delete brand?',
            content: 'Realmente quieres eliminar la marca',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'delete User',
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

    $( "#select_all" ).on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
        user_id = [];
        verific_checks(0);
    });

    $('#user-table').on('click', "tbody input[type='checkbox']", function(e) {
        if (!$(this).is(":checked")) { //If the checkbox is checked
            user_id = [];
        }
        verific_checks(1);
        
    });


    var verific_checks = function(num){
        $(':checkbox:checked').each(function(i){
            i+=num;
            if(i){
                var user_data = $(this).closest('tr').data('user');
                if(typeof(user_data) !== 'undefined'){
                    user_id[i-1] = user_data.id;
                }
            }
        });
    }

    jQuery.validator.setDefaults({
        errorPlacement: function (error, element) {
            if(error.html() == 'Select Category...')
                error.html('This field is required.');
            $(element).closest('div.form-group').find('.validation-msg').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('div.form-group').removeClass('has-success').addClass('has-error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('div.form-group').removeClass('has-error').addClass('has-success');
            $(element).closest('div.form-group').find('.validation-msg').html('');
        }
    });

    var url_user = '{{ route("api.user.update", [":id"]) }}';
    // url_user = url_user.replace(':id', up_user_id);
    // console.log(up_user_id);
    myDropzone = new Dropzone('div#imageUpload', {
        addRemoveLinks: true,
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 1,
        maxFilesize: 12,
        paramName: 'image',
        clickable: true,
        method: 'POST',
        url: url_user,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        renameFile: function(file) {
            var dt = new Date();
            var time = dt.getTime();
            return time + file.name;
        },
        acceptedFiles: ".jpeg,.jpg,.png,.gif",
        init: function () {
            this.on("processing", function(file) {
                up_user_id = $("input[name='id']").val();
                url_user = url_user.replace(':id', up_user_id);
                this.options.url = url_user;
            });
            var myDropzone = this;
            $('#submit-btn').on("click", function (e) {
                e.preventDefault();
                if ( $("#update_user").valid() ) {
                    tinyMCE.triggerSave();
                    if(myDropzone.getAcceptedFiles().length) {
                        myDropzone.processQueue();
                    }
                    else {
                        up_user_id = $("input[name='id']").val();
                        url_user = url_user.replace(':id', up_user_id);
                        console.log(url_user);
                        console.log(up_user_id);
                        $.ajax({
                            type:'POST',
                            url:url_user,
                            data: $("#update_user").serialize(),
                            success:function(response){
                                $.confirm({
                                    title: 'Actualizar usuario',
                                    content: 'El usuario se ha actualizado con exito',
                                });
                                location.href = '../user';
                            },
                            error:function(response) {
                              
                            },
                        });
                    }
                }
            });

            this.on('sending', function (file, xhr, formData) {
                // Append all form inputs to the formData Dropzone will POST
                var data = $("#update_user").serializeArray();
                $.each(data, function (key, el) {
                    formData.append(el.name, el.value);
                });
            });
        },
        error: function (file, response) {
            console.log(response);
        },
        successmultiple: function (file, response) {
            $.confirm({
                title: 'Actualizar usuario',
                content: 'El usuario se ha actualizado con exito',
            });
            location.href = '../user';
            //console.log(file, response);
        },
        completemultiple: function (file, response) {
            console.log(file, response, "completemultiple");
        },
        reset: function () {
            console.log("resetFiles");
            this.removeAllFiles(true);
        }
    });
</script>
@endsection