@extends('template.app') 
@section('content')
<section class="forms">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex align-items-center">
                        <h4>{{trans('file.Add User')}}</h4>
                    </div>
                    <div class="card-body">
                        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
                        {!! Form::open(['method' => 'post', 'files' => true , 'id' => 'new_user']) !!}
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label><strong>{{trans('file.name')}} *</strong> </label>
                                        <input type="text" name="name" required class="form-control">
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
                                        <label><strong>{{trans('file.Password')}} *</strong> </label>
                                        <!-- <div class="input-group">
                                            <input type="password" name="password" id="btn-password" required class="form-control">
                                            <div class="input-group-append">
                                                <button id="genbutton" type="button" class="btn btn-default">{{trans('file.Generate')}}</button>
                                            </div>
                                        </div> -->
                                        <div class="input-group has-validation">
                                            <input type="password" name="password" id="btn-password" required class="form-control">
                                            <div class="input-group-prepend">
                                                <!-- <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div> -->
                                                <button type="button" class="input-group-text show_p" name="show_pass" id="show_pass"><i class="fa fa-eye" aria-hidden="true"></i></button>
                                                <button id="genbutton" type="button" class="input-group-text"><i class="fa fa-unlock-alt" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                        <div class="invalid-feedback order-last"></div>
                                        <!-- <label for="show_pass"><input type="checkbox" name="show_pass" id="show_pass">Show Password</label> -->
                                    </div>
                                    <div class="form-group">
                                        <label><strong>{{trans('file.Email')}} *</strong></label>
                                        <input type="email" name="email" placeholder="example@example.com" required class="form-control">
                                        @if($errors->has('email'))
                                       <span>
                                           <strong>{{ $errors->first('email') }}</strong>
                                        </span>
                                        @endif
                                    </div>
                                    <div class="form-group">
                                        <input class="mt-2" type="checkbox" name="is_active" value="1" checked>
                                        <label class="mt-2"><strong>{{trans('file.Active')}}</strong></label>
                                    </div>
                                    <div class="form-group">
                                        <input type="submit" value="{{trans('file.submit')}}" class="btn btn-primary" id="submit-btn">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label><strong>{{trans('file.Role')}} *</strong></label>
                                        <select name="role_id" required class="selectpicker form-control" data-live-search="true" data-live-search-style="begins" title="Select Role...">
                                          {{-- @foreach($lims_role_list as $role)
                                              <option value="{{$role->id}}">{{$role->name}}</option>
                                          @endforeach --}}
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
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script type="text/javascript">

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

    // jQuery.validator.setDefaults({
    //     errorPlacement: function (error, element) {
    //         $(element).closest('div.form-group').find('.validation-msg').html(error.html());
    //     },
    //     highlight: function (element) {
    //         $(element).closest('div.form-group').removeClass('has-success').addClass('has-error');
    //     },
    //     unhighlight: function (element, errorClass, validClass) {
    //         $(element).closest('div.form-group').removeClass('has-error').addClass('has-success');
    //         $(element).closest('div.form-group').find('.validation-msg').html('');
    //     }
    // });


    $('form#new_user').validate({
        rules:{
            email: {
                required: true,
                email: true
            },
            password : 'required'
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid');
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        // errorPlacement: function ( error, element ) {
        //     // Add the `invalid-feedback` class to the error element
        //     error.addClass("invalid-feedback");
        //     error.insertAfter(element);
        // },
        messages: {
            name:'name is requerid',
            last_name:'last name is requerid',
            password: "password is requerid",
            email: {
                required: "We need your email address to contact you",
                email: "Your email address must be in the format of name@domain.com"
            }
        }
    });

    var url_user = '{{ route("api.user.store") }}';
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
            // this.on("processing", function(file) {
            //     up_user_id = $("input[name='id']").val();
            //     url_user = url_user.replace(':id', up_user_id);
            //     this.options.url = url_user;
            // });
            var myDropzone = this;
            $('#submit-btn').on("click", function (e) {
                e.preventDefault();
                if ( $("#new_user").valid() ) {
                    tinyMCE.triggerSave();
                    if(myDropzone.getAcceptedFiles().length) {
                        myDropzone.processQueue();
                    }
                    else {
                        $.ajax({
                            type:'POST',
                            url:url_user,
                            data: $("#new_user").serialize(),
                            success:function(response){
                                $.confirm({
                                    title: 'Crear usuario',
                                    content: 'El usuario se ha creado con exito',
                                });
                                location.href = '../user';
                            },
                            error:function(response) {
                              
                            },
                        });
                    }
                }else{
                    alert("hola");
                }
            });

            this.on('sending', function (file, xhr, formData) {
                // Append all form inputs to the formData Dropzone will POST
                var data = $("#new_user").serializeArray();
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
                title: 'Agregar usuario',
                content: 'El usuario se ha creado con exito',
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

    $('#show_pass').on("click", function(){
      
        if($(this).hasClass('show_p')) { 
            $(this).removeClass('show_p');
            $(this).addClass('hiden_p');
            $(this).html('<i class="fa fa-eye-slash" aria-hidden="true"></i>');
            $('#btn-password').attr('type', 'text');
        }else{
            $(this).removeClass('hiden_p');
            $(this).addClass('show_p');
            $(this).html('<i class="fa fa-eye" aria-hidden="true"></i>')
            $('#btn-password').attr('type', 'password');
        }
        
        // $(this).is(':checked') ? $('#btn-password').attr('type', 'text') : $('#btn-password').attr('type', 'password')
    })

    // $('.selectpicker').selectpicker({
    //   style: 'btn-link',
    // });
    
    $('#genbutton').on("click", function(){
      $.get("{{url('api/user/genpass')}}", function(data){
        $("input[name='password']").val(data);
      });
    });

    // $( 'form#new_user' ).submit( function(e){
    //     e.preventDefault();
    //     alert("hola");
    //     var data = new FormData( $( 'form#new_user' )[ 0 ] );

    //     $.ajax( {
    //         processData: false,
    //         contentType: false,
    //         data: data,
    //         dataType: 'json',
    //         type: $( this ).attr( 'method' ),
    //         url: "{{url('api/user')}}",
    //         success: function( feedback ){
    //             console.log( "the feedback from your API: " + feedback );
    //         }
    //     });
    // });
</script>
@endsection