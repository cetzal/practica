(function() {
    var host = window.location.origin;

    function formatErrorUsingClassesAndPopover(element , array_of_problems ){
        let someHTML = '';
        array_of_problems.forEach(function(e){someHTML+='<li>'+element +': '+ e+'</li>'});
        // $('#'+element+'_error_section').html('<ul>'+someHTML+'</ul>');
        // $('#'+element).addClass('is-invalid');

        return '<ul>'+someHTML+'</ul><br>';
    }

    $("#promotion_price").hide();
    $("#start_date").hide();
    $("#last_date").hide();

    // $('[data-toggle="tooltip"]').tooltip(); 

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('#genbutton').on("click", function(){
      $.get(host+'/api/product/gencode', function(data){
        $("input[name='code']").val(data);
      });
    });

    $("input[name='code']").on('blur', function() {
        $.get(host+'/api/product/code',{ code: $("input[name='code']").val()})
          .done(function(data) {
            
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
                let message = ''
                $.each(jqXHR.responseJSON.errors,function(field_name,error){
                    message+='<b>'+field_name+'</b>: '+jqXHR.responseJSON.errors[field_name][0]+'<br>';
                })

                $.alert({
                    title: 'Field invalid',
                    content: message,
                });
          });
    });

    $('select[name="unit_id"]').on('change', function(e) {
        e.preventDefault();
        unitID = $(this).val();
        if(unitID) {
            populate_category(unitID);
        }else{    
            $('select[name="sale_unit_id"]').empty();
            $('select[name="purchase_unit_id"]').empty();
        }                        
    });
  


    function hide() {
        $("#cost").hide(300);
        $("#unit").hide(300);
        $("#alert-qty").hide(300);
    }
    function populate_category(unitID){
        var url = 'api/product/saleunit/'+ unitID;
        $.ajax({
            url: host +'/'+ url,
            type: "GET",
            dataType: "json",
            success:function(data) {
                  $('select[name="sale_unit_id"]').empty();
                  $('select[name="purchase_unit_id"]').empty();
                  $.each(data, function(key, value) {
                      $('select[name="sale_unit_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                      $('select[name="purchase_unit_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                  });
                //   $('.selectpicker').selectpicker('refresh');
            },
        });
    }

    $( "#promotion" ).on( "change", function() {
        if ($(this).is(':checked')) {
            // $.datepicker.formatDate('dd/mm/yy', new Date())
            $("#starting_date").val();
            $("#promotion_price").show(300);
            $("#start_date").show(300);
            $("#last_date").show(300);
        } 
        else {
            $("#promotion_price").hide(300);
            $("#start_date").hide(300);
            $("#last_date").hide(300);
        }
    });

    var starting_date = $('#starting_date');
    starting_date.daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        },
    });
    

    var ending_date = $('#ending_date');
    ending_date.daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        },
    });
    

    $(window).keydown(function(e){
        if (e.which == 13) {
            var $targ = $(e.target);

            if (!$targ.is("textarea") && !$targ.is(":button,:submit")) {
                var focusNext = false;
                $(this).find(":input:visible:not([disabled],[readonly]), a").each(function(){
                    if (this === e.target) {
                        focusNext = true;
                    }
                    else if (focusNext){
                        $(this).focus();
                        return false;
                    }
                });

                return false;
            }
        }
    });

    //dropzone portion
    Dropzone.autoDiscover = false;

    jQuery.validator.setDefaults({
        errorPlacement: function (error, element) {
            if(error.html() == 'Select Category...')
                error.html('This field is required.');
            $(element).closest('div.form-group').find('.validation-msg').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('div.form-group').removeClass('has-success').addClass('has-error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('div.form-group').removeClass('has-error').addClass('has-success');
            $(element).closest('div.form-group').find('.validation-msg').html('');
        }
    });

    $.validator.addMethod("requiredIfChecked", function(value, element) {
        // Check if checkbox is checked and date is empty
        if ($('#promotion').prop('checked') && value === '') {
            return false; // Return false to indicate validation failure
        }
        return true; // Return true if validation passes
    }, "Date is required if checkbox is checked.");


    $("#product-form").validate({
      
        rules : {
            name : 'required',
            code : {
                required : true,
                remote: {
                    url: 'code',
                    type: 'get',
                    delay: 1000,
                    message: 'The pageurl is not available.'
                }
            },
            brand_id: 'required',
            promotion_price : {
                requiredIfChecked: true,
                required : true
            }
            
        },
        onfocusout: false,
        invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {                    
                validator.errorList[0].element.focus();
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
        // errorPlacement: function ( error, element ) {
        //     // Add the `invalid-feedback` class to the error element
        //     error.addClass("invalid-feedback");
        //     error.insertAfter(element);
        // },
        messages: {
            name : 'The name is required',
            code : {
                required : 'The code is required',
                remote: "code already in use."
            },
            brand_id : 'The brand is required',
            promotion_price : {
                required : 'The promition price is required'
            }
            
        }
    });

    function validate() {
        var product_code = $("input[name='code']").val();
        var barcode_symbology = $('select[name="barcode_symbology"]').val();
        var exp = /^\d+$/;

        if(!(product_code.match(exp)) && (barcode_symbology == 'UPCA' || barcode_symbology == 'UPCE' || barcode_symbology == 'EAN8' || barcode_symbology == 'EAN13') ) {
            alert('Product code must be numeric.');
            return false;
        }
        else if(product_code.match(exp)) {
            if(barcode_symbology == 'UPCA' && product_code.length > 11){
                alert('Product code length must be less than 12');
                return false;
            }
            else if(barcode_symbology == 'EAN8' && product_code.length > 7){
                alert('Product code length must be less than 8');
                return false;
            }
            else if(barcode_symbology == 'EAN13' && product_code.length > 12){
                alert('Product code length must be less than 13');
                return false;
            }
        }

     
        $("input[name='price']").prop('disabled',false);
        return true;
    }

    myDropzone = new Dropzone('div#imageUpload', {
        addRemoveLinks: true,
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 100,
        maxFilesize: 12,
        paramName: 'image',
        clickable: true,
        method: 'POST',
        url: host + '/api/product',
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
            $('#submit-btn').on("click", function (e) {
                e.preventDefault();
                if ( $("#product-form").valid() && validate() ) {
                    tinyMCE.triggerSave();
                    if(myDropzone.getAcceptedFiles().length) {
                        myDropzone.processQueue();
                    }
                    else {
                        $.ajax({
                            type:'POST',
                            url:host + "/api/product",
                            data: $("#product-form").serialize(),
                            success:function(response){
                                $.confirm({
                                    title: 'Actualizar producto',
                                    content: 'El producto se ha creado con exito',
                                    buttons: {
                                        ok: function () {
                                            window.location.replace('/product');
                                        }
                                    }
                                });
                                //location.href = '../product';
                            },
                            error:function(response) {
                                if (response.status == 422) { 
                                    //toastError(err.responseJSON.message);
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
                var data = $("#product-form").serializeArray();
                $.each(data, function (key, el) {
                    formData.append(el.name, el.value);
                });
            });
        },
        error: function (file, response) {
            if (response.status == 422) { 
               

                let message = ''
                $.each(response.responseJSON.errors,function(field_name,error){
                   
                    message+='<b>'+field_name+'</b>: '+response.responseJSON.errors[field_name][0]+'<b>';
                })

                $.alert({
                    title: 'Field invalid',
                    content: message,
                });
            }
            
        },
        successmultiple: function (file, response) {
            $.confirm({
                title: 'Agregar producto',
                content: 'El producto se ha creado con exito',
                //autoClose: 'ok|3000',
                buttons: {
                    ok: function () {
                        window.location.replace('/product');
                    }
                }
            });
            //location.href = '../product';
            //console.log(file, response);
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
          var queue = myDropzone.getAcceptedFiles();
          newQueue = [];
          $('#imageUpload .dz-preview .dz-filename [data-dz-name]').each(function (count, el) {           
                var name = el.innerHTML;
                queue.forEach(function(file) {
                    if (file.name === name) {
                        newQueue.push(file);
                    }
                });
          });
          myDropzone.files = newQueue;
        }
    });

    var load_combobox = function(input){
        $(input).append('<option value="">Without suppliers</option>');
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            type: "GET",
            url: host + '/api/suppliers/all/combobox',
            success: function( response ){
                console.log('response suppliers', response);
                if(response.length != 0) {
                    $(input).find('option').remove().end();
                    $(input).append('<option value="">Select supplier</option>');
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
              }
            },
            error: function(xhr, textStatus, error){
              
            }
        });
    };

    $(document).ready(function() {
        load_combobox(".select-supplier");
    });

    $('select[name="supplier_id"]').on('change', function(e) {
        e.preventDefault();
        supplier_id = $(this).val();
        if(supplier_id) {
            brandsBySupplier(supplier_id);
        }else{    
            $('select[name="brand_id"]').find('option').remove().end();
            $('select[name="brand_id"]').append('<option value="">Non-branded</option>');
        }                
    });

    function brandsBySupplier(supplier_id){
        var url = 'api/brand/supplier/'+ supplier_id;
        $('select[name="brand_id"]').empty();
        $('select[name="brand_id"]').append('<option value="">Select a brand</option>');
        $.ajax({
            url: host +'/'+ url,
            type: "GET",
            dataType: "json",
            success:function(response) {
                $('select[name="brand_id"]').find('option').remove().end();
                $('select[name="brand_id"]').append('<option value="">Non-branded</option>');
                if (response.length) {
                    $('select[name="brand_id"]').find('option').remove().end();
                    $('select[name="brand_id"]').append('<option value="">Select a brand</option>');
                    $.each(response, function(index, row) {
                        $('select[name="brand_id"]').append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            },
        });
    }
})();