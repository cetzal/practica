@extends('template.app')

@section('content')
<section class="forms">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex align-items-center">
                        <h4>{{trans('file.Update Product')}}</h4>
                    </div>
                    <div class="card-body">
                        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
                        <form id="product-form">
                            @method('PUT')
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Type')}} *</strong> </label>
                                        <div class="input-group">
                                            <select name="type" required class="form-control selectpicker" id="type">
                                                <option value="standard">Standard</option>
                                            </select>
                                            <input type="hidden" name="type_hidden" value="{{$lims_product_data->type}}">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Name')}} *</strong> </label>
                                        <input type="text" name="name" value="{{$lims_product_data->name}}" required class="form-control">
                                        <span class="validation-msg" id="name-error"></span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Code')}} *</strong> </label>
                                        <div class="input-group">
                                            <input type="text" name="code" id="code" value="{{$lims_product_data->code}}" class="form-control" required>
                                            <div class="input-group-append">
                                                <button id="genbutton" type="button" class="btn btn-sm btn-default" title="{{trans('file.Generate')}}">{{trans('file.Generate')}}</button>
                                            </div>
                                        </div>
                                        <span class="validation-msg" id="code-error"></span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Barcode Symbology')}} *</strong> </label>
                                        <div class="input-group">
                                            <input type="hidden" name="barcode_symbology_hidden" value="{{$lims_product_data->barcode_symbology}}">
                                            <select name="barcode_symbology" required class="form-control selectpicker">
                                                <option value="C128">Code 128</option>
                                                <option value="C39">Code 39</option>
                                                <option value="UPCA">UPC-A</option>
                                                <option value="UPCE">UPC-E</option>
                                                <option value="EAN8">EAN-8</option>
                                                <option value="EAN13">EAN-13</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Brand')}}</strong> </label>
                                        <div class="input-group">
                                            <input type="hidden" name="brand" value="{{ $lims_product_data->brand_id}}">
                                          <select name="brand_id" class="selectpicker form-control" data-live-search="true" data-live-search-style="begins" title="Select Brand...">
                                          <option value="">Select a brand</option> 
                                          @foreach($lims_brand_list as $brand)
                                                @if ($brand->is_active == 1)
                                                <option value="{{$brand->id}}">{{$brand->name}}</option>
                                                @else
                                                <option readonly value="{{$brand->id}}">{{$brand->name}}</option>
                                                @endif
                                                
                                            @endforeach
                                          </select>
                                      </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <input type="hidden" name="category" value="{{$lims_product_data->category_id}}">
                                        <label>{{trans('file.category')}} *</strong> </label>
                                        <div class="input-group">
                                          <select name="category_id" required class="selectpicker form-control" data-live-search="true" data-live-search-style="begins" title="Select Category...">
                                            @foreach($lims_category_list as $category)
                                                <option value="{{$category->id}}">{{$category->name}}</option>
                                            @endforeach
                                          </select>
                                      </div>
                                    </div>
                                </div>
                                <div id="unit" class="col-md-12">
                                    <div class="row ">
                                        <div class="col-md-4">
                                                <label>{{trans('file.Product Unit')}} *</strong> </label>
                                                <div class="input-group">
                                                  <select required class="form-control selectpicker" data-live-search="true" data-live-search-style="begins" title="Select unit..." name="unit_id">
                                                    @foreach($lims_unit_list as $unit)
                                                        @if($unit->base_unit==null)
                                                            <option value="{{$unit->id}}">{{$unit->unit_name}}</option>
                                                        @endif
                                                    @endforeach
                                                  </select>
                                                  <input type="hidden" name="unit" value="{{ $lims_product_data->unit_id}}">
                                              </div>
                                        </div>
                                        <div class="col-md-4">
                                                <label>{{trans('file.Sale Unit')}}</strong> </label>
                                                <div class="input-group">
                                                  <select class="form-control selectpicker" name="sale_unit_id" id="sale-unit"> 
                                                  </select>
                                                  <input type="hidden" name="sale_unit" value="{{ $lims_product_data->sale_unit_id}}">
                                              </div>
                                        </div>
                                        <div class="col-md-4 mt-2">
                                                <div class="form-group">
                                                    <label>{{trans('file.Purchase Unit')}}</strong> </label>
                                                    <div class="input-group">
                                                      <select class="form-control selectpicker" name="purchase_unit_id"> 
                                                      </select>
                                                      <input type="hidden" name="purchase_unit" value="{{ $lims_product_data->purchase_unit_id}}">
                                                  </div>
                                                </div>
                                        </div>                                
                                    </div>                                
                                </div>
                                <div id="cost" class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Cost')}} *</strong> </label>
                                        <input type="number" name="cost" value="{{$lims_product_data->cost}}" required class="form-control" step="any">
                                        <span class="validation-msg"></span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Price')}} *</strong> </label>
                                        <input type="number" name="price" value="{{$lims_product_data->price}}" required class="form-control" step="any">
                                        <span class="validation-msg"></span>
                                    </div>
                                    <div class="form-group">
                                        <input type="hidden" name="qty" value="{{ $lims_product_data->qty }}" class="form-control">
                                    </div>
                                </div>
                                <div id="alert-qty" class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Alert Quantity')}}</strong> </label>
                                        <input type="number" name="alert_quantity" value="{{$lims_product_data->alert_quantity}}" class="form-control" step="any">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <input type="hidden" name="tax" value="{{$lims_product_data->tax_id}}">
                                        <label>{{trans('file.product')}} {{trans('file.Tax')}}</strong> </label>
                                        <select name="tax_id" class="form-control selectpicker">
                                            <option value="">No Tax</option>
                                            @foreach($lims_tax_list as $tax)
                                                <option value="{{$tax->id}}">{{$tax->name}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <input type="hidden" name="tax_method_id" value="{{$lims_product_data->tax_method}}">
                                        <label>{{trans('file.Tax Method')}}</strong> </label>
                                        <select name="tax_method" class="form-control selectpicker">
                                            <option value="1">{{trans('file.Exclusive')}}</option>
                                            <option value="2">{{trans('file.Inclusive')}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Image')}}</strong> </label> <i class="dripicons-question" data-toggle="tooltip" title="{{trans('file.You can upload multiple image. Only .jpeg, .jpg, .png, .gif file can be uploaded. First image will be base image.')}}"></i>
                                        <div id="imageUpload" class="dropzone"></div>
                                        <span class="validation-msg" id="image-error"></span>
                                    </div>
                                </div> 
                                <div class="col-md-12"> 
                                    <div class="form-group">
                                        <label>{{trans('file.Product Details')}}</label>
                                        <textarea name="product_details" class="form-control" rows="5">{{str_replace('@', '"', $lims_product_data->product_details)}}</textarea>
                                    </div>
                                </div>
                                <div class="col-md-4 mt-3">
                                    <input type="hidden" name="promotion_hidden" value="{{$lims_product_data->promotion}}">
                                    <input name="promotion" type="checkbox" id="promotion" value="1">&nbsp;
                                    <label><h5>{{trans('file.Add Promotional Price')}}</h5></label>
                                </div>
                                
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-4" id="promotion_price">   <label>{{trans('file.Promotional Price')}}</label>
                                            <input type="number" name="promotion_price" value="{{$lims_product_data->promotion_price}}" class="form-control" step="any" />
                                        </div>
                                        <div id="start_date" class="col-md-4">
                                            <div class="form-group">
                                                <label>{{trans('file.Promotion Starts')}}</label>
                                                <input type="text" name="starting_date" value="{{$lims_product_data->starting_date}}" id="starting_date" class="form-control" />
                                            </div>
                                        </div>
                                        <div id="last_date" class="col-md-4">
                                            <div class="form-group">
                                                <label>{{trans('file.Promotion Ends')}}</label>
                                                <input type="text" name="last_date" value="{{$lims_product_data->last_date}}" id="ending_date" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <input type="button" value="{{trans('file.Save')}}" class="btn btn-primary" id="submit-btn">
                                        <a href="{{route('products.index')}}" class="btn btn-warning">Atras</a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
@section('scripts')
<script type="text/javascript">

    var product_id = <?php echo json_encode($lims_product_data->id) ?>;
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
      $.get('{{route("api.product.gencode")}}', function(data){
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

    var brand = $("input[name='brand']").val();
    $('select[name=brand_id]').val(brand);

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
        var url = '{{ route("api.product.saleUnit", [":id"]) }}';
        url = url.replace(':id', unitID);
        $.ajax({
            url: url,
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
        var url = '{{ route("api.product.saleUnit", [":id"]) }}';
        url = url.replace(':id', unitID);
        $.ajax({
            url: url,
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
    starting_date.datepicker({
     format: "dd-mm-yyyy",
     startDate: "<?php echo date('d-m-Y'); ?>",
     autoclose: true,
     todayHighlight: true
     });

    var ending_date = $('#ending_date');
    ending_date.datepicker({
     format: "dd-mm-yyyy",
     startDate: "<?php echo date('d-m-Y'); ?>",
     autoclose: true,
     todayHighlight: true
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

    $("#product-form").validate({
        rules : {
            name : 'required',
            code : 'required',
            brand_id: 'required'
            
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
            brand_id : 'The brand is required'
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

    var url_update = '{{ route("api.product.update", [":id"]) }}';
    url_update = url_update.replace(':id', product_id);
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
                            data: $("#product-form").serialize()  ,
                            success:function(response){
                                $.confirm({
                                    title: 'Actualizar producto',
                                    content: 'El producto se ha actualizado con exito',
                                    autoClose: 'ok|1000',
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
                autoClose: 'ok|1000',
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

</script>
@endsection