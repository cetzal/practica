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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/modules/user/create.js":
/*!*********************************************!*\
  !*** ./resources/js/modules/user/create.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function () {
  var url_path_user = 'api/user';
  $('form#new_user').validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true
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
    messages: {
      name: 'name is requerid',
      last_name: 'last name is requerid',
      password: {
        required: "password is requerid"
      },
      email: {
        required: "We need your email address to contact you",
        email: "Your email address must be in the format of name@domain.com"
      }
    }
  });
  $('#btn-password').bind("keyup", function () {
    ValidatePassword('#btn-password', '#new_user');
  });
  var url_user = url_path_user + '';
  // url_user = url_user.replace(':id', up_user_id);
  // console.log(up_user_id);
  var myDropzone1 = new Dropzone('div#imageUploadNewUser', {
    addRemoveLinks: true,
    autoProcessQueue: false,
    uploadMultiple: true,
    parallelUploads: 1,
    maxFilesize: 12,
    paramName: 'image',
    clickable: true,
    method: 'POST',
    url: url_user,
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
      $('#submit-btn-create').on("click", function (e) {
        e.preventDefault();
        if ($("#new_user").valid() && checked_validpass('#btn-password', '#new_user')) {
          tinyMCE.triggerSave();
          if (myDropzone.getAcceptedFiles().length) {
            myDropzone.processQueue();
          } else {
            $.ajax({
              type: 'POST',
              url: url_user,
              data: $("#new_user").serialize(),
              success: function success(response) {
                $("input[name='id']").val('');
                $("input[name='name']").val('');
                $("input[name='last_name']").val('');
                $("input[name='email']").val('');
                $('.btn-close-modal').trigger('click');
                $.confirm({
                  title: 'Crear usuario',
                  content: 'El usuario se ha creado con exito',
                  buttons: {
                    ok: function ok() {
                      console.log('creacion de usuario cargo la tabla');
                      $('#user-table').DataTable().ajax.reload();
                    }
                  }
                });
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
        var data = $("#new_user").serializeArray();
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
        title: 'Agregar usuario',
        content: 'El usuario se ha creado con exito'
      });
      //location.href = '../user';
      //console.log(file, response);
    },
    completemultiple: function completemultiple(file, response) {
      console.log(file, response, "completemultiple");
    },
    reset: function reset() {
      console.log("resetFiles");
      this.removeAllFiles(true);
    }
  });
  $(".dropzone").sortable({
    items: '.dz-preview',
    cursor: 'grab',
    opacity: 0.5,
    containment: '.dropzone',
    distance: 20,
    tolerance: 'pointer',
    stop: function stop() {
      var queue = myDropzone1.getAcceptedFiles();
      newQueue = [];
      $('#imageUpload .dz-preview .dz-filename [data-dz-name]').each(function (count, el) {
        var name = el.innerHTML;
        queue.forEach(function (file) {
          if (file.name === name) {
            newQueue.push(file);
          }
        });
      });
      myDropzone1.files = newQueue;
    }
  });
  /*Actual validation function*/
  function ValidatePassword(input, form) {
    if (input == '#btn-password') {
      $('div.securty_pass_c').show();
    } else {
      $('div.securty_pass_u').show();
    }
    /*Array of rules and the information target*/
    var rules = [{
      Pattern: "[A-Z]",
      Target: "UpperCase"
    }, {
      Pattern: "[a-z]",
      Target: "LowerCase"
    }, {
      Pattern: "[0-9]",
      Target: "Numbers"
    }, {
      Pattern: "[!@@#$%^&*]",
      Target: "Symbols"
    }];

    //Just grab the password once
    var password = $(input).val();
    var form_ = $(form);

    /*Length Check, add and remove class could be chained*/
    /*I've left them seperate here so you can see what is going on */
    /*Note the Ternary operators ? : to select the classes*/
    form_.find("#Length").removeClass(password.length > 7 ? "glyphicon-remove" : "glyphicon-ok");
    form_.find("#Length").addClass(password.length > 7 ? "glyphicon-ok" : "glyphicon-remove");

    /*Iterate our remaining rules. The logic is the same as for Length*/
    for (var i = 0; i < rules.length; i++) {
      var match_pass = new RegExp(rules[i].Pattern).test(password);
      var remove_class = match_pass ? "glyphicon-remove" : "glyphicon-ok";
      var add_class = match_pass ? "glyphicon-ok" : "glyphicon-remove";
      var element = form_.find("#" + rules[i].Target);
      $(element).removeClass(remove_class);
      $(element).addClass(add_class);
    }
  }
  function checked_validpass(input, form) {
    $(input).addClass('is-invalid');
    $(input).attr('aria-invalid', true);
    if (input !== '#btn-password') {
      var password = $(input).val();
      if (password.length == 0) {
        $('div.securty_pass_u').hide();
        $(input).removeClass('is-invalid');
        $(input).attr('aria-invalid', false);
        return true;
      }
    }
    var form_ = $(form);
    if (form_.find("#Length").hasClass('glyphicon-remove')) {
      return false;
    }
    if (form_.find("#UpperCase").hasClass('glyphicon-remove')) {
      return false;
    }
    if (form_.find("#LowerCase").hasClass('glyphicon-remove')) {
      return false;
    }
    if (form_.find("#Numbers").hasClass('glyphicon-remove')) {
      return false;
    }
    if (form_.find("#Symbols").hasClass('glyphicon-remove')) {
      return false;
    }
    $(input).removeClass('is-invalid');
    $(input).attr('aria-invalid', false);
    return true;
  }
})();

/***/ }),

/***/ 16:
/*!***************************************************!*\
  !*** multi ./resources/js/modules/user/create.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/user/create.js */"./resources/js/modules/user/create.js");


/***/ })

/******/ });