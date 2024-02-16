(function() {
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
            // error.addClass("invalid-feedback" );
            // error.insertAfter(element);
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        messages: {
            name: "El nombre es requerido",
            description: "La descripcion es requerido"
        }
    });
    
    $('form#new_brand').submit( function(e){
        e.preventDefault();
        
        if ($('form#new_brand').valid()) {
            var data = new FormData( $('form#new_brand')[ 0 ] );
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
                    
                    $.confirm({
                        title: response.status,
                        content: response.message,
                        buttons: {
                            ok: function () {
                                // $('#createModal').modal('hide');
                                // $('#createModal').modal({backdrop: false});
                                // $('.modal-backdrop').remove();
                                $('.btn-close-modal').trigger('click');
                                $("#new_brand").get(0).reset();
                                $("tbody input[type='checkbox']").prop('checked', false);
                                $('#brand-table').DataTable().ajax.reload();
                            }
                        }
                    });
                },
                error: function(xhr, textStatus, error){
                    if (xhr.status == 422) {
                        // let responseText = JSON.parse(xhr.responseText);
                        // let keys = Object.keys(responseText.errors);
                        // let message = 'Error desconocido';
                        // if (keys.length > 0) {
                        //     message = responseText.errors[keys[0]][0];
                        // }
                        // console.log('response', responseText);
                        // $.alert({
                        //     title: 'Campos invalidos',
                        //     content: message,
                        // });
                        console.log(xhr.responseJSON.errors);
                        $.each(xhr.responseJSON.errors,function(field_name,error){
                            console.log(field_name, xhr.responseJSON.errors[field_name][0], error);
                            $('input[name="'+field_name+'"]').addClass('is-invalid');
                            let html = '<label id="name-error" class="error invalid-feedback" for="name" style="">'+xhr.responseJSON.errors[field_name][0]+'</label>';
                            $('input[name="'+field_name+'"]').after(html);
                        })

                    }
                }
            });
        }
        
    });

    $("#suppliers_id").multiselect({
        enableHTML:false,
    });
})();