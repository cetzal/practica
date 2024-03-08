(function() {
    $('form#edit_accounts').validate({
        rules:{
            name: 'required',
            init_balance: 'required'
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
            init_balance : "El saldo inicial es requerido",
        }
    });

    $( 'form#edit_accounts' ).submit( function(e){
        e.preventDefault();
        if ($('#edit_accounts').valid()) {
            var data = new FormData( $( 'form#edit_accounts' )[ 0 ] );
            var actionUrl = $(this).attr('action');
            
            $.ajax( {
                processData: false,
                contentType: false,
                dataType: 'json',
                data: data,
                type: $( this ).attr( 'method' ),
                url: actionUrl,
                success: function( response ){
                    $('#accounts-table').DataTable().ajax.reload();
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