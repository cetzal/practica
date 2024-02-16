(function() {
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
                }
            });
        }
    });
})();