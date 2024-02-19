(function() {
    var url_path_user = 'api/user';
    $('form#new_user').validate({
        rules:{
            email: {
                required: true,
                email: true
            },
            password : {
                required : true,
            }
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
        messages: {
            name:'name is requerid',
            last_name:'last name is requerid',
            password: {
                required : "password is requerid",
                
            },
            email: {
                required: "We need your email address to contact you",
                email: "Your email address must be in the format of name@domain.com"
            }
        }
    });

    $('#btn-password').bind("keyup", function(){
        ValidatePassword('#btn-password','#new_user');
    });

    var url_user = url_path_user + '';
    // url_user = url_user.replace(':id', up_user_id);
    // console.log(up_user_id);
    var myDropzone1 = new Dropzone('div#imageUploadNewUser', {
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
            var myDropzone = this;
            $('#submit-btn-create').on("click", function (e) {
                e.preventDefault();
                if ( $("#new_user").valid() && checked_validpass('#btn-password','#new_user')) {
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
                                    buttons: {
                                        ok: function () {
                                            $("input[name='id']").val('');
                                            $("input[name='name']").val('');
                                            $("input[name='last_name']").val('');
                                            $("input[name='email']").val('');
                                            $('.btn-close-modal').trigger('click');
                                            $('#user-table').DataTable().ajax.reload();
                                        }
                                    }
                                });
                              
                            },
                            error:function(response) {
                                if (response.status == 422) {
                                    let message = ''
                                    $.each(response.responseJSON.errors,function(field_name,error){
                                        message+='<b>'+field_name+'</b>: '+response.responseJSON.errors[field_name][0]+'<br>';
                                    })

                                    $.alert({
                                        title: 'Field invalid',
                                        content: message,
                                    });
                                }
                            },
                        });
                    }
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
        error: function (file, response, xhr) {
            if (xhr.status == 422) { 
                let response = JSON.parse(xhr.response);
                let message = ''
                $.each(response.errors,function(field_name,error){
                    message+='<b>'+field_name+'</b>: '+response.errors[field_name][0]+'<br>';
                })

                $.alert({
                    title: 'Field invalid',
                    content: message,
                });
            }
        },
        successmultiple: function (file, response) {
            $.confirm({
                title: 'Agregar usuario',
                content: 'El usuario se ha creado con exito',
            });
            $.confirm({
                title: 'Agregar usuario',
                content: 'El usuario se ha creado con exito',
                buttons: {
                    ok: function () {
                        $("input[name='id']").val('');
                        $("input[name='name']").val('');
                        $("input[name='last_name']").val('');
                        $("input[name='email']").val('');
                        $('.btn-close-modal').trigger('click');
                        $('#user-table').DataTable().ajax.reload();
                        location.href = '../user';
                    }
                }
            });
        },
        completemultiple: function (file, response) {
            console.log(file, response, "completemultiple");
        },
        reset: function () {
            console.log("resetFiles");
            this.removeAllFiles(true);
        }
    });

    $(".dropzone").sortable({
        items:'.dz-preview',
        cursor: 'grab',
        opacity: 0.5,
        containment: '.dropzone',
        distance: 20,
        tolerance: 'pointer',
        stop: function () {
          var queue = myDropzone1.getAcceptedFiles();
          newQueue = [];
          $('#imageUpload .dz-preview .dz-filename [data-dz-name]').each(function (count, el) {           
                var name = el.innerHTML;
                queue.forEach(function(file) {
                    if (file.name === name) {
                        newQueue.push(file);
                    }
                });
          });
          myDropzone1.files = newQueue;
        }
    });
    /*Actual validation function*/
    function ValidatePassword(input, form) {
        
        if(input == '#btn-password'){
            $('div.securty_pass_c').show();
   
        }else{
            $('div.securty_pass_u').show();
        }
        /*Array of rules and the information target*/
        var rules = [
            {
                Pattern: "[A-Z]",
                Target: "UpperCase"
            },
            {
                Pattern: "[a-z]",
                Target: "LowerCase"
            },
            {
                Pattern: "[0-9]",
                Target: "Numbers"
            },
            {
                Pattern: "[!@@#$%^&*]",
                Target: "Symbols"
            }
        ];

        //Just grab the password once
        var password = $(input).val();
        var form_ = $(form);

        /*Length Check, add and remove class could be chained*/
        /*I've left them seperate here so you can see what is going on */
        /*Note the Ternary operators ? : to select the classes*/
        form_.find("#Length").removeClass(password.length > 7 ? "glyphicon-remove" : "glyphicon-ok");
        form_.find("#Length").addClass(password.length > 7 ? "glyphicon-ok" : "glyphicon-remove");
        
        /*Iterate our remaining rules. The logic is the same as for Length*/
        for (var i = 0; i < rules.length; i++) {
            var match_pass = new RegExp(rules[i].Pattern).test(password);
            var remove_class = match_pass ? "glyphicon-remove" : "glyphicon-ok";
            var add_class = match_pass ? "glyphicon-ok" : "glyphicon-remove";
            var element = form_.find( "#" + rules[i].Target);
            $(element).removeClass(remove_class); 
            $(element).addClass(add_class);
        }

    }

    function checked_validpass(input, form){

        $(input).addClass('is-invalid');
        $(input).attr('aria-invalid', true);
        if(input !== '#btn-password'){
            var password = $(input).val();
            if(password.length == 0){
                $('div.securty_pass_u').hide();
                $(input).removeClass('is-invalid');
                $(input).attr('aria-invalid', false);
                return true;
            }
        }


        var form_ = $(form);

        if( form_.find("#Length").hasClass('glyphicon-remove')){
            return false;
        }

        if(form_.find("#UpperCase").hasClass('glyphicon-remove')){
            return false;
        }
        if(form_.find("#LowerCase").hasClass('glyphicon-remove')){
            return false;
        }
        if(form_.find("#Numbers").hasClass('glyphicon-remove')){
            return false;
        }
        if(form_.find("#Symbols").hasClass('glyphicon-remove')){
            return false;
        }

        $(input).removeClass('is-invalid');
        $(input).attr('aria-invalid', false);

        return true;

    }
})();