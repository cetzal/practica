(function(){
    $('form#new_accounts').validate({
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
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        messages: {
            name: "El nombre es requerido",
            init_balance : "El saldo inicial es requerido",
        }
    });

    $('form#new_accounts').submit( function(e){
        e.preventDefault();
        
        if ($('form#new_accounts').valid()) {
            $.ajax( {
                data: $("#new_accounts").serialize(),
                type: 'POST',
                url: '/api/accounts',
                success: function( response ){
                    
                    $.confirm({
                        title: response.status,
                        content: response.message,
                        buttons: {
                            ok: function () {
                                $('.btn-close-modal').trigger('click');
                                $("#new_accounts").get(0).reset();
                                $('#accounts-table').DataTable().ajax.reload();
                            }
                        }
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