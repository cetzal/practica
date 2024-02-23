(function() {

    var host = window.location.origin;
    var product_id = $('#product_id').val();

    function formatErrorUsingClassesAndPopover(element , array_of_problems ){
        let someHTML = '';
        array_of_problems.forEach(function(e){someHTML+='<li>'+element +': '+ e+'</li>'});
        // $('#'+element+'_error_section').html('<ul>'+someHTML+'</ul>');
        // $('#'+element).addClass('is-invalid');

        return '<ul>'+someHTML+'</ul><br>';
    }
    
    $('[data-toggle="tooltip"]').tooltip();

    $("select[name='type']").val($("input[name='type_hidden']").val());

    var promotion = $("input[name='promotion_hidden']").val();
    if(promotion){
        $("input[name='promotion']").prop('checked', true);
        $("#promotion_price").show(300);
        $("#start_date").show(300);
        $("#last_date").show(300);
    }
    else {
        $("#promotion_price").hide(300);
        $("#start_date").hide(300);
        $("#last_date").hide(300);
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('#genbutton').on("click", function(){
      $.get(host + '/api/product/gencode', function(data){
        $("input[name='code']").val(data);
      });
    });

  
    // tinymce.init({
    //   selector: 'textarea',
    //   height: 130,
    //   plugins: [
    //     'advlist autolink lists link image charmap print preview anchor textcolor',
    //     'searchreplace visualblocks code fullscreen',
    //     'insertdatetime media table contextmenu paste code wordcount'
    //   ],
    //   toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
    //   branding:false
    // });

    var barcode_symbology = $("input[name='barcode_symbology_hidden']").val();
    $('select[name=barcode_symbology]').val(barcode_symbology);

    
  

    var cat = $("input[name='category']").val();
    $('select[name=category_id]').val(cat);

    if($("input[name='unit']").val()) {
        $('select[name=unit_id]').val($("input[name='unit']").val());
        populate_unit($("input[name='unit']").val());
    }

    var tax = $("input[name='tax']").val();
    if(tax)
        $('select[name=tax_id]').val(tax);

    var tax_method = $("input[name='tax_method_id']").val();
    $('select[name=tax_method]').val(tax_method);
   

    $('select[name="unit_id"]').on('change', function() {
        unitID = $(this).val();
        if(unitID) {
            populate_unit_second(unitID);
        }else{    
            $('select[name="sale_unit_id"]').empty();
            $('select[name="purchase_unit_id"]').empty();
        }                        
    });

    function populate_unit(unitID){
        var url = 'api/product/saleunit/'+unitID;
        $.ajax({
            url: host +'/'+url,
            type: "GET",
            dataType: "json",

            success:function(data) {
                  $('select[name="sale_unit_id"]').empty();
                  $('select[name="purchase_unit_id"]').empty();
                  $.each(data, function(key, value) {
                      $('select[name="sale_unit_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                      $('select[name="purchase_unit_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                  });
                  
                  var sale_unit = $("input[name='sale_unit']").val();
                  var purchase_unit = $("input[name='purchase_unit']").val();
                $('#sale-unit').val(sale_unit);
                $('select[name=purchase_unit_id]').val(purchase_unit);
                
            },
        });
    }

    function populate_unit_second(unitID){
        var url = 'api/product/saleunit/' + unitID;
        url = url.replace(':id', unitID);
        $.ajax({
            url: host + '/' + url,
            type: "GET",
            dataType: "json",
            success:function(data) {
                  $('select[name="sale_unit_id"]').empty();
                  $('select[name="purchase_unit_id"]').empty();
                  $.each(data, function(key, value) {
                      $('select[name="sale_unit_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                      $('select[name="purchase_unit_id"]').append('<option value="'+ key +'">'+ value +'</option>');
                  });
                
            },
        });
    };

    $( "#promotion" ).on( "change", function() {
        if ($(this).is(':checked')) {
            $("#promotion_price").show();
            $("#start_date").show();
            $("#last_date").show();
        } 
        else {
            $("#promotion_price").hide();
            $("#start_date").hide();
            $("#last_date").hide();
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
            code : 'required',
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
            code : 'The code is required',
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

    var url_update = host +'/api/product/';
    url_update = url_update.concat(product_id);
    myDropzone = new Dropzone('div#imageUpload', {
        addRemoveLinks: true,
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 100,
        maxFilesize: 12,
        paramName: 'image',
        clickable: true,
        method: 'POST',
        url:url_update,
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
                            url:url_update,
                            data: $("#product-form").serialize(),
                            success:function(response){
                                $.confirm({
                                    title: 'Actualizar producto',
                                    content: 'El producto se ha actualizado con exito',
                                    buttons: {
                                        ok: function () {
                                            window.location.replace('/product');
                                        }
                                    }
                                });
                                //location.href = '../';
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
        successmultiple: function (file, response) {
            $.confirm({
                title: 'Actualizar producto',
                content: 'El producto se ha actualizado con exito',
                autoClose: 'ok|3000',
                buttons: {
                    ok: function () {
                        window.location.replace('/product');
                    }
                }
            });
            //location.href = '../';
            //console.log('sss: '+ response);
        },
        completemultiple: function (file, response) {
            console.log(file, response, "completemultiple");
        },
        reset: function () {
            console.log("resetFiles");
            this.removeAllFiles(true);
        }
    });

    
    var brand = $("input[name='brand']").val();
    var supplier = $("input[name='supplier']").val();
    $(document).ready(function() {
        load_combobox_filter(".select-supplier");
        all_brandsBySupplier(supplier);
    });

    var load_combobox_filter = function(input){
        
        // $(input).append('<option value="">Select suppliers</option>');
        $(input).append('<option value="">Without suppliers</option>');
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            type: "GET",
            url: host + '/api/suppliers/filter/combobox',
            success: function( response ){
                if(response.length != 0){
                    $(input).find('option').remove().end();
                    $(input).append('<option value="">Select supplier</option>');
                    $.each(response, function(index, row) {
                        if(row.is_active == 1){
                            $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                        }else{
                            $(input).append('<option value=' + row.id + ' disabled>' + row.name + '</option>');
                        }
                        
                    }); 

                    $('select[name="supplier_id"]').val(supplier);
              }
            },
            error: function(xhr, textStatus, error){
              
            }
        });
    };

    $('select[name="supplier_id"]').on('change', function(e) {
        e.preventDefault();
        supplier_id = $(this).val();
        if(supplier_id) {
            all_brandsBySupplier(supplier_id);
        }else{
            $('select[name="brand_id"]').find('option').remove().end();
            $('select[name="brand_id"]').append('<option value="">Non-branded</option>');
        }                    
    });

    function all_brandsBySupplier(supplier_id){
        var url = 'api/product/brand/supplier/'+ supplier_id;
        $('select[name="brand_id"]').find('option').remove().end();
        $('select[name="brand_id"]').append('<option value="">Non-branded</option>');
        $.ajax({
            url: host +'/'+ url,
            type: "GET",
            dataType: "json",
            success:function(response) {
                $('select[name="brand_id"]').find('option').remove().end();
                $('select[name="brand_id"]').append('<option value="">Select brand</option>');
                $.each(response, function(index, row) {
                    if(row.is_active == 1){
                        $('select[name="brand_id"]').append('<option value=' + row.id + '>' + row.name + '</option>');
                    }else{
                        $('select[name="brand_id"]').append('<option value=' + row.id + ' disabled>' + row.name + '</option>');
                    }
                   
                    if(row.id == parseInt(brand)){
                        $('select[name="brand_id"]').val(brand);
                    }
                }); 

                
               
                
            },
        });
    }

})();