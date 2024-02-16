(function(){

    $('form#new_client').validate({
        rules:{
            name : {
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
            name:'The name is requerid',
        }
    });

    $('#new_client').on('submit', function(e){
        e.preventDefault();
        if ( $(this).valid()){
            $.ajax({
                type:'POST',
                url:"api/clients",
                data: $("#new_client").serialize(),
                success:function(response){
                    
                    $("input[name='name']").val('');
                    $('.btn-close-modal').trigger('click');
                    $.confirm({
                        title: 'Crear cliente',
                        content: 'El cliente se ha creado con exito',
                        buttons: {
                            ok: function() {
                               
                                $('#clients-data-table').DataTable().ajax.reload();
                            }
                        }
                    });
                  
                },
                error:function(response) {

                    if (response.status == 422) { 
                        //toastError(err.responseJSON.message);
                        let details = response.responseJSON.errors ;
                        let content = '';
                        Object.keys(details).forEach(field => {
                            content += formatErrorUsingClassesAndPopover(field,details[field]);
                        });

                        $.alert({
                            title: 'Error',
                            content: content

                        });
                    }
                },
            });
        }
    });

    function formatErrorUsingClassesAndPopover(element , array_of_problems ){
        let someHTML = '';
        array_of_problems.forEach(function(e){someHTML+='<li>'+element +': '+ e+'</li>'});
        // $('#'+element+'_error_section').html('<ul>'+someHTML+'</ul>');
        // $('#'+element).addClass('is-invalid');

        return '<ul>'+someHTML+'</ul><br>';
    }
})();