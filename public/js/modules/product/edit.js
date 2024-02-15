/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/modules/product/edit.js":
/*!**********************************************!*\
  !*** ./resources/js/modules/product/edit.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function () {
  var host = window.location.origin;

  // var product_id = <?php echo json_encode($lims_product_data->id) ?>;
  var product_id = $('#product_id').val();
  console.log('product_id', product_id);
  $('[data-toggle="tooltip"]').tooltip();
  $("select[name='type']").val($("input[name='type_hidden']").val());
  var promotion = $("input[name='promotion_hidden']").val();
  if (promotion) {
    $("input[name='promotion']").prop('checked', true);
    $("#promotion_price").show(300);
    $("#start_date").show(300);
    $("#last_date").show(300);
  } else {
    $("#promotion_price").hide(300);
    $("#start_date").hide(300);
    $("#last_date").hide(300);
  }
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $('#genbutton').on("click", function () {
    $.get('{{route("api.product.gencode")}}', function (data) {
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
  if ($("input[name='unit']").val()) {
    $('select[name=unit_id]').val($("input[name='unit']").val());
    populate_unit($("input[name='unit']").val());
  }
  var tax = $("input[name='tax']").val();
  if (tax) $('select[name=tax_id]').val(tax);
  var tax_method = $("input[name='tax_method_id']").val();
  $('select[name=tax_method]').val(tax_method);
  $('select[name="unit_id"]').on('change', function () {
    unitID = $(this).val();
    if (unitID) {
      populate_unit_second(unitID);
    } else {
      $('select[name="sale_unit_id"]').empty();
      $('select[name="purchase_unit_id"]').empty();
    }
  });
  function populate_unit(unitID) {
    var url = 'api/product/saleunit/' + unitID;
    $.ajax({
      url: host + '/' + url,
      type: "GET",
      dataType: "json",
      success: function success(data) {
        $('select[name="sale_unit_id"]').empty();
        $('select[name="purchase_unit_id"]').empty();
        $.each(data, function (key, value) {
          $('select[name="sale_unit_id"]').append('<option value="' + key + '">' + value + '</option>');
          $('select[name="purchase_unit_id"]').append('<option value="' + key + '">' + value + '</option>');
        });
        var sale_unit = $("input[name='sale_unit']").val();
        var purchase_unit = $("input[name='purchase_unit']").val();
        $('#sale-unit').val(sale_unit);
        $('select[name=purchase_unit_id]').val(purchase_unit);
      }
    });
  }
  function populate_unit_second(unitID) {
    var url = '{{ route("api.product.saleUnit", [":id"]) }}';
    url = url.replace(':id', unitID);
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function success(data) {
        $('select[name="sale_unit_id"]').empty();
        $('select[name="purchase_unit_id"]').empty();
        $.each(data, function (key, value) {
          $('select[name="sale_unit_id"]').append('<option value="' + key + '">' + value + '</option>');
          $('select[name="purchase_unit_id"]').append('<option value="' + key + '">' + value + '</option>');
        });
      }
    });
  }
  ;
  $("#promotion").on("change", function () {
    if ($(this).is(':checked')) {
      $("#promotion_price").show();
      $("#start_date").show();
      $("#last_date").show();
    } else {
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
    }
  });
  var ending_date = $('#ending_date');
  ending_date.daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    locale: {
      format: 'DD/MM/YYYY'
    }
  });

  //dropzone portion
  Dropzone.autoDiscover = false;
  jQuery.validator.setDefaults({
    errorPlacement: function errorPlacement(error, element) {
      if (error.html() == 'Select Category...') error.html('This field is required.');
      $(element).closest('div.form-group').find('.validation-msg').html(error.html());
    },
    highlight: function highlight(element) {
      $(element).closest('div.form-group').removeClass('has-success').addClass('has-error');
    },
    unhighlight: function unhighlight(element, errorClass, validClass) {
      $(element).closest('div.form-group').removeClass('has-error').addClass('has-success');
      $(element).closest('div.form-group').find('.validation-msg').html('');
    }
  });
  $.validator.addMethod("requiredIfChecked", function (value, element) {
    // Check if checkbox is checked and date is empty
    if ($('#promotion').prop('checked') && value === '') {
      return false; // Return false to indicate validation failure
    }
    return true; // Return true if validation passes
  }, "Date is required if checkbox is checked.");
  $("#product-form").validate({
    rules: {
      name: 'required',
      code: 'required',
      brand_id: 'required',
      promotion_price: {
        requiredIfChecked: true,
        required: true
      }
    },
    onfocusout: false,
    invalidHandler: function invalidHandler(form, validator) {
      var errors = validator.numberOfInvalids();
      if (errors) {
        validator.errorList[0].element.focus();
      }
    },
    highlight: function highlight(input) {
      $(input).addClass('is-invalid');
    },
    unhighlight: function unhighlight(input) {
      $(input).removeClass('is-invalid');
    },
    errorElement: 'span',
    errorPlacement: function errorPlacement(error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    // errorPlacement: function ( error, element ) {
    //     // Add the `invalid-feedback` class to the error element
    //     error.addClass("invalid-feedback");
    //     error.insertAfter(element);
    // },
    messages: {
      name: 'The name is required',
      code: 'The code is required',
      brand_id: 'The brand is required',
      promotion_price: {
        required: 'The promition price is required'
      }
    }
  });
  function validate() {
    var product_code = $("input[name='code']").val();
    var barcode_symbology = $('select[name="barcode_symbology"]').val();
    var exp = /^\d+$/;
    if (!product_code.match(exp) && (barcode_symbology == 'UPCA' || barcode_symbology == 'UPCE' || barcode_symbology == 'EAN8' || barcode_symbology == 'EAN13')) {
      alert('Product code must be numeric.');
      return false;
    } else if (product_code.match(exp)) {
      if (barcode_symbology == 'UPCA' && product_code.length > 11) {
        alert('Product code length must be less than 12');
        return false;
      } else if (barcode_symbology == 'EAN8' && product_code.length > 7) {
        alert('Product code length must be less than 8');
        return false;
      } else if (barcode_symbology == 'EAN13' && product_code.length > 12) {
        alert('Product code length must be less than 13');
        return false;
      }
    }
    $("input[name='price']").prop('disabled', false);
    return true;
  }
  $(".dropzone").sortable({
    items: '.dz-preview',
    cursor: 'grab',
    opacity: 0.5,
    containment: '.dropzone',
    distance: 20,
    tolerance: 'pointer',
    stop: function stop() {
      var queue = myDropzone.getAcceptedFiles();
      newQueue = [];
      $('#imageUpload .dz-preview .dz-filename [data-dz-name]').each(function (count, el) {
        var name = el.innerHTML;
        queue.forEach(function (file) {
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
    url: url_update,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    renameFile: function renameFile(file) {
      var dt = new Date();
      var time = dt.getTime();
      return time + file.name;
    },
    acceptedFiles: ".jpeg,.jpg,.png,.gif",
    init: function init() {
      var myDropzone = this;
      $('#submit-btn').on("click", function (e) {
        e.preventDefault();
        if ($("#product-form").valid() && validate()) {
          tinyMCE.triggerSave();
          if (myDropzone.getAcceptedFiles().length) {
            myDropzone.processQueue();
          } else {
            $.ajax({
              type: 'POST',
              url: url_update,
              data: $("#product-form").serialize(),
              success: function success(response) {
                $.confirm({
                  title: 'Actualizar producto',
                  content: 'El producto se ha actualizado con exito',
                  autoClose: 'ok|3000',
                  buttons: {
                    ok: function ok() {
                      window.location.replace('/product');
                    }
                  }
                });
                //location.href = '../';
              },
              error: function error(response) {
                if (response.status == 422) {
                  //toastError(err.responseJSON.message);
                  var details = response.responseJSON.errors;
                  var content = '';
                  Object.keys(details).forEach(function (field) {
                    content += formatErrorUsingClassesAndPopover(field, details[field]);
                  });
                  $.alert({
                    title: 'Error',
                    content: content
                  });
                }
              }
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
    error: function error(file, response) {
      if (response.status == 422) {
        //toastError(err.responseJSON.message);
        var details = response.responseJSON.errors;
        var content = '';
        Object.keys(details).forEach(function (field) {
          content += formatErrorUsingClassesAndPopover(field, details[field]);
        });
        $.alert({
          title: 'Error',
          content: content
        });
      }
    },
    successmultiple: function successmultiple(file, response) {
      $.confirm({
        title: 'Actualizar producto',
        content: 'El producto se ha actualizado con exito',
        autoClose: 'ok|3000',
        buttons: {
          ok: function ok() {
            window.location.replace('/product');
          }
        }
      });
      //location.href = '../';
      //console.log('sss: '+ response);
    },
    completemultiple: function completemultiple(file, response) {
      console.log(file, response, "completemultiple");
    },
    reset: function reset() {
      console.log("resetFiles");
      this.removeAllFiles(true);
    }
  });
})();

/***/ }),

/***/ 9:
/*!****************************************************!*\
  !*** multi ./resources/js/modules/product/edit.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/product/edit.js */"./resources/js/modules/product/edit.js");


/***/ })

/******/ });