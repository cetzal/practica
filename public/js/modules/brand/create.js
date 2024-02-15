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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/modules/brand/create.js":
/*!**********************************************!*\
  !*** ./resources/js/modules/brand/create.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function () {
  $('form#new_brand').validate({
    rules: {
      name: 'required',
      description: 'required'
    },
    highlight: function highlight(input) {
      $(input).addClass('is-invalid');
    },
    unhighlight: function unhighlight(input) {
      $(input).removeClass('is-invalid');
    },
    errorPlacement: function errorPlacement(error, element) {
      // Add the `invalid-feedback` class to the error element
      // error.addClass("invalid-feedback" );
      // error.insertAfter(element);
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    },
    messages: {
      name: "El nombre es requerido",
      description: "La descripcion es requerido"
    }
  });
  $('form#new_brand').submit(function (e) {
    e.preventDefault();
    if ($('form#new_brand').valid()) {
      var data = new FormData($('form#new_brand')[0]);
      var actionUrl = $(this).attr('action');
      var method = $(this).attr('method');
      $.ajax({
        processData: false,
        contentType: false,
        dataType: 'json',
        data: data,
        type: $(this).attr('method'),
        url: actionUrl,
        success: function success(response) {
          table.ajax.reload();
          $.confirm({
            title: response.status,
            content: response.message,
            buttons: {
              ok: function ok() {
                $('#createModal').modal('hide');
                $('#createModal').modal({
                  backdrop: false
                });
                $('.modal-backdrop').remove();
                $("#new_brand").get(0).reset();
                $("tbody input[type='checkbox']").prop('checked', false);
                table.ajax.reload();
              }
            }
          });
        },
        error: function error(xhr, textStatus, _error) {
          if (xhr.status == 422) {
            // let responseText = JSON.parse(xhr.responseText);
            // let keys = Object.keys(responseText.errors);
            // let message = 'Error desconocido';
            // if (keys.length > 0) {
            //     message = responseText.errors[keys[0]][0];
            // }
            // console.log('response', responseText);
            // $.alert({
            //     title: 'Campos invalidos',
            //     content: message,
            // });
            console.log(xhr.responseJSON.errors);
            $.each(xhr.responseJSON.errors, function (field_name, error) {
              console.log(field_name, xhr.responseJSON.errors[field_name][0], error);
              $('input[name="' + field_name + '"]').addClass('is-invalid');
              var html = '<label id="name-error" class="error invalid-feedback" for="name" style="">' + xhr.responseJSON.errors[field_name][0] + '</label>';
              $('input[name="' + field_name + '"]').after(html);
            });
          }
        }
      });
    }
  });
})();

/***/ }),

/***/ 4:
/*!****************************************************!*\
  !*** multi ./resources/js/modules/brand/create.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/brand/create.js */"./resources/js/modules/brand/create.js");


/***/ })

/******/ });