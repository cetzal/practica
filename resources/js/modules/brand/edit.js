(function() {
    $('form#update_brand').validate({
        rules:{
            name: 'required',
            supplier_id: 'required',
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
            supplier_id: "El proveedor es requerido",
            description: "La descripcion es requerido",
        }
    });

    $( 'form#update_brand' ).submit( function(e){
        e.preventDefault();
        
        if ($('#update_brand').valid()) {
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
                    $('#brand-table').DataTable().ajax.reload();
                    $('.btn-close-modal').trigger('click');
                    $.alert({
                        title: response.status,
                        content: response.message,
                    });
                },
                error: function(xhr, textStatus, error){
                    if (xhr.status == 422) {
                        let message = ''
                        $.each(xhr.responseJSON.errors,function(field_name,error){
                            // $('input[name="'+field_name+'"]').addClass('is-invalid');
                            // let html = '<label id="name-error" class="error invalid-feedback" for="name" style="">'+xhr.responseJSON.errors[field_name][0]+'</label>';
                            // $('input[name="'+field_name+'"]').after(html);
                            message+='<b>'+field_name+'</b>: '+xhr.responseJSON.errors[field_name][0]+'<br>';
                        })

                        $.alert({
                            title: 'Field invalid',
                            content: message,
                        });

                    }
                }
            });
        }
    });
})();