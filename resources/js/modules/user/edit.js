(function() {
    var url_path_user = 'api/user';
    var url_user_up = url_path_user + '/:id';
    // url_user = url_user.replace(':id', up_user_id);
    // console.log(up_user_id);
    var myDropzone2 = new Dropzone('div#imageUpload', {
        addRemoveLinks: true,
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 1,
        maxFilesize: 12,
        paramName: 'image',
        clickable: true,
        method: 'POST',
        url: url_user_up,
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
                var url_user_up = url_path_user + '/:id';
                up_user_id = $("input[name='id']").val();
                url_user_up = url_user_up.replace(':id', up_user_id);
                this.options.url = url_user_up;
            });
            var myDropzone = this;
            $('#submit-btn').on("click", function (e) {
                e.preventDefault();
                if ( $("#update_user").valid() && checked_validpass('#btn-password-up', '#update_user')) {
                    tinyMCE.triggerSave();
                    if(myDropzone.getAcceptedFiles().length) {
                        myDropzone.processQueue();
                    }
                    else {
                        url_user_up = url_path_user + '/:id';
                        up_user_id = $("input[name='id']").val();
                        url_user_up = url_user_up.replace(':id', up_user_id);

                        $.ajax({
                            type:'POST',
                            url:url_user_up,
                            data: $("#update_user").serialize(),
                            success:function(response){
                                $.confirm({
                                    title: 'Actualizar usuario',
                                    content: 'El usuario se ha actualizado con exito',
                                    buttons: {
                                        ok: function () {
                                            $("input[name='id']").val('');
                                            $("input[name='name']").val('');
                                            $("input[name='last_name']").val('');
                                            $("input[name='email']").val('');
                                            //$('#editModal').modal('hide');
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
                var data = $("#update_user").serializeArray();
                $.each(data, function (key, el) {
                    formData.append(el.name, el.value);
                });
            });
        },
        error: function (file, response, xhr) {
            if (xhr.status == 422) {
                this.emit('success', file);
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
                title: 'Actualizar usuario',
                content: 'El usuario se ha actualizado con exito',
                buttons: {
                    ok: function () {
                        $("input[name='id']").val('');
                        $("input[name='name']").val('');
                        $("input[name='last_name']").val('');
                        $("input[name='email']").val('');
                        //$('#editModal').modal('hide');
                        $('.btn-close-modal').trigger('click');
                        $('#user-table').DataTable().ajax.reload();
                        location.href = '../user';
                    }
                }
            });
            // location.href = '../user';
            //console.log(file, response);
        },
        completemultiple: function (file, response) {
            this.emit('success', file);
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
          var queue = myDropzone2.getAcceptedFiles();
          newQueue = [];
          $('#imageUpload .dz-preview .dz-filename [data-dz-name]').each(function (count, el) {           
                var name = el.innerHTML;
                queue.forEach(function(file) {
                    if (file.name === name) {
                        newQueue.push(file);
                    }
                });
          });
          myDropzone2.files = newQueue;
        }
    });

    $('#btn-password-up').on('keyup', function(){
        ValidatePassword('#btn-password-up', '#update_user');
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