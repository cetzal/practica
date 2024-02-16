(function() {
    $('form#update_supplier').validate({
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

    $( 'form#update_supplier' ).submit( function(e){
        e.preventDefault();
        
        if ($('#update_supplier').valid()) {
            var data = new FormData( $( 'form#update_supplier' )[ 0 ] );
            var actionUrl = $(this).attr('action');
            let host = window.location.origin;
            host+='/api/suppliers/'+  $("input[name='supplier_id']").val();

            var method = $( this ).attr( 'method' );
            
            $.ajax( {
                processData: false,
                contentType: false,
                dataType: 'json',
                data: data,
                type: $( this ).attr( 'method' ),
                url: host,
                success: function( response ){
                    table.ajax.reload();
                    $('#editModal').modal('hide');
                    $('#editModal').modal({backdrop: false});
                    $('.modal-backdrop').remove();
                    $.alert({
                        title: response.status,
                        content: response.message,
                    });
                }
            });
        }
    });
})();