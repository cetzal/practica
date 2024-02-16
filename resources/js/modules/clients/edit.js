(function(){
    $('form#update_client').validate({
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
    
    $('#update_client').on('submit', function(e){
        e.preventDefault();
        if ( $(this).valid()){
            let id = $("input[name='client_id']").val();
            $.ajax({
                type:'PUT',
                url:"api/clients/" + id,
                data: $("#update_client").serialize(),
                success:function(response){
                    
                    $("input[name='name']").val('');
                    $('.btn-close-modal').trigger('click');
                    $.confirm({
                        title: 'Actializar cliente',
                        content: 'El cliente se ha actualizado con exito',
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