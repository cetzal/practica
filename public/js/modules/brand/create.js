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

eval("(function () {\n  $('form#new_brand').validate({\n    rules: {\n      name: 'required',\n      description: 'required'\n    },\n    highlight: function highlight(input) {\n      $(input).addClass('is-invalid');\n    },\n    unhighlight: function unhighlight(input) {\n      $(input).removeClass('is-invalid');\n    },\n    errorPlacement: function errorPlacement(error, element) {\n      // Add the `invalid-feedback` class to the error element\n      // error.addClass(\"invalid-feedback\" );\n      // error.insertAfter(element);\n      error.addClass('invalid-feedback');\n      element.closest('.form-group').append(error);\n    },\n    messages: {\n      name: \"El nombre es requerido\",\n      description: \"La descripcion es requerido\"\n    }\n  });\n  $('form#new_brand').submit(function (e) {\n    e.preventDefault();\n    if ($('form#new_brand').valid()) {\n      var data = new FormData($('form#new_brand')[0]);\n      var actionUrl = $(this).attr('action');\n      var method = $(this).attr('method');\n      $.ajax({\n        processData: false,\n        contentType: false,\n        dataType: 'json',\n        data: data,\n        type: $(this).attr('method'),\n        url: actionUrl,\n        success: function success(response) {\n          $.confirm({\n            title: response.status,\n            content: response.message,\n            buttons: {\n              ok: function ok() {\n                // $('#createModal').modal('hide');\n                // $('#createModal').modal({backdrop: false});\n                // $('.modal-backdrop').remove();\n                $('.btn-close-modal').trigger('click');\n                $(\"#new_brand\").get(0).reset();\n                $(\"tbody input[type='checkbox']\").prop('checked', false);\n                $('#brand-table').DataTable().ajax.reload();\n              }\n            }\n          });\n        },\n        error: function error(xhr, textStatus, _error) {\n          if (xhr.status == 422) {\n            var message = '';\n            $.each(xhr.responseJSON.errors, function (field_name, error) {\n              // $('input[name=\"'+field_name+'\"]').addClass('is-invalid');\n              // let html = '<label id=\"name-error\" class=\"error invalid-feedback\" for=\"name\" style=\"\">'+xhr.responseJSON.errors[field_name][0]+'</label>';\n              // $('input[name=\"'+field_name+'\"]').after(html);\n              message += '<b>' + field_name + '</b>: ' + xhr.responseJSON.errors[field_name][0] + '<br>';\n            });\n            $.alert({\n              title: 'Field invalid',\n              content: message\n            });\n          }\n        }\n      });\n    }\n  });\n  $(\"#suppliers_id\").multiselect({\n    enableHTML: false\n  });\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvanMvbW9kdWxlcy9icmFuZC9jcmVhdGUuanM/N2ViNSJdLCJuYW1lcyI6WyIkIiwidmFsaWRhdGUiLCJydWxlcyIsIm5hbWUiLCJkZXNjcmlwdGlvbiIsImhpZ2hsaWdodCIsImlucHV0IiwiYWRkQ2xhc3MiLCJ1bmhpZ2hsaWdodCIsInJlbW92ZUNsYXNzIiwiZXJyb3JQbGFjZW1lbnQiLCJlcnJvciIsImVsZW1lbnQiLCJjbG9zZXN0IiwiYXBwZW5kIiwibWVzc2FnZXMiLCJzdWJtaXQiLCJlIiwicHJldmVudERlZmF1bHQiLCJ2YWxpZCIsImRhdGEiLCJGb3JtRGF0YSIsImFjdGlvblVybCIsImF0dHIiLCJtZXRob2QiLCJhamF4IiwicHJvY2Vzc0RhdGEiLCJjb250ZW50VHlwZSIsImRhdGFUeXBlIiwidHlwZSIsInVybCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImNvbmZpcm0iLCJ0aXRsZSIsInN0YXR1cyIsImNvbnRlbnQiLCJtZXNzYWdlIiwiYnV0dG9ucyIsIm9rIiwidHJpZ2dlciIsImdldCIsInJlc2V0IiwicHJvcCIsIkRhdGFUYWJsZSIsInJlbG9hZCIsInhociIsInRleHRTdGF0dXMiLCJlYWNoIiwicmVzcG9uc2VKU09OIiwiZXJyb3JzIiwiZmllbGRfbmFtZSIsImFsZXJ0IiwibXVsdGlzZWxlY3QiLCJlbmFibGVIVE1MIl0sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFlBQVc7RUFDUkEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUNDLFFBQVEsQ0FBQztJQUN6QkMsS0FBSyxFQUFDO01BQ0ZDLElBQUksRUFBRSxVQUFVO01BQ2hCQyxXQUFXLEVBQUc7SUFDbEIsQ0FBQztJQUNEQyxTQUFTLEVBQUUsU0FBQUEsVUFBVUMsS0FBSyxFQUFFO01BQ3hCTixDQUFDLENBQUNNLEtBQUssQ0FBQyxDQUFDQyxRQUFRLENBQUMsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFDREMsV0FBVyxFQUFFLFNBQUFBLFlB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LE1BQU07WUFDcEYsQ0FBQyxDQUFDO1lBRUZuRCxDQUFDLENBQUNvRCxLQUFLLENBQUM7Y0FDSmxCLEtBQUssRUFBRSxlQUFlO2NBQ3RCRSxPQUFPLEVBQUVDO1lBQ2IsQ0FBQyxDQUFDO1VBRU47UUFDSjtNQUNKLENBQUMsQ0FBQztJQUNOO0VBRUosQ0FBQyxDQUFDO0VBRUZyQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUNxRCxXQUFXLENBQUM7SUFDM0JDLFVBQVUsRUFBQztFQUNmLENBQUMsQ0FBQztBQUNOLENBQUMsRUFBRSxDQUFDIiwiZmlsZSI6Ii4vcmVzb3VyY2VzL2pzL21vZHVsZXMvYnJhbmQvY3JlYXRlLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgICQoJ2Zvcm0jbmV3X2JyYW5kJykudmFsaWRhdGUoe1xuICAgICAgICBydWxlczp7XG4gICAgICAgICAgICBuYW1lOiAncmVxdWlyZWQnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24gOiAncmVxdWlyZWQnXG4gICAgICAgIH0sXG4gICAgICAgIGhpZ2hsaWdodDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAkKGlucHV0KS5hZGRDbGFzcygnaXMtaW52YWxpZCcpO1xuICAgICAgICB9LFxuICAgICAgICB1bmhpZ2hsaWdodDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAkKGlucHV0KS5yZW1vdmVDbGFzcygnaXMtaW52YWxpZCcpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24gKCBlcnJvciwgZWxlbWVudCApIHtcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgYGludmFsaWQtZmVlZGJhY2tgIGNsYXNzIHRvIHRoZSBlcnJvciBlbGVtZW50XG4gICAgICAgICAgICAvLyBlcnJvci5hZGRDbGFzcyhcImludmFsaWQtZmVlZGJhY2tcIiApO1xuICAgICAgICAgICAgLy8gZXJyb3IuaW5zZXJ0QWZ0ZXIoZWxlbWVudCk7XG4gICAgICAgICAgICBlcnJvci5hZGRDbGFzcygnaW52YWxpZC1mZWVkYmFjaycpO1xuICAgICAgICAgICAgZWxlbWVudC5jbG9zZXN0KCcuZm9ybS1ncm91cCcpLmFwcGVuZChlcnJvcik7XG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2VzOiB7XG4gICAgICAgICAgICBuYW1lOiBcIkVsIG5vbWJyZSBlcyByZXF1ZXJpZG9cIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkxhIGRlc2NyaXBjaW9uIGVzIHJlcXVlcmlkb1wiXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICAkKCdmb3JtI25ld19icmFuZCcpLnN1Ym1pdCggZnVuY3Rpb24oZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgIGlmICgkKCdmb3JtI25ld19icmFuZCcpLnZhbGlkKCkpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IEZvcm1EYXRhKCAkKCdmb3JtI25ld19icmFuZCcpWyAwIF0gKTtcbiAgICAgICAgICAgIHZhciBhY3Rpb25VcmwgPSAkKHRoaXMpLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgdmFyIG1ldGhvZCA9ICQoIHRoaXMgKS5hdHRyKCAnbWV0aG9kJyApO1xuICAgICAgICAgICAgJC5hamF4KCB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgdHlwZTogJCggdGhpcyApLmF0dHIoICdtZXRob2QnICksXG4gICAgICAgICAgICAgICAgdXJsOiBhY3Rpb25VcmwsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICl7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlc3BvbnNlLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJCgnI2NyZWF0ZU1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJCgnI2NyZWF0ZU1vZGFsJykubW9kYWwoe2JhY2tkcm9wOiBmYWxzZX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkKCcubW9kYWwtYmFja2Ryb3AnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1jbG9zZS1tb2RhbCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjbmV3X2JyYW5kXCIpLmdldCgwKS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGJvZHkgaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjYnJhbmQtdGFibGUnKS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDQyMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHhoci5yZXNwb25zZUpTT04uZXJyb3JzLGZ1bmN0aW9uKGZpZWxkX25hbWUsZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICQoJ2lucHV0W25hbWU9XCInK2ZpZWxkX25hbWUrJ1wiXScpLmFkZENsYXNzKCdpcy1pbnZhbGlkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0IGh0bWwgPSAnPGxhYmVsIGlkPVwibmFtZS1lcnJvclwiIGNsYXNzPVwiZXJyb3IgaW52YWxpZC1mZWVkYmFja1wiIGZvcj1cIm5hbWVcIiBzdHlsZT1cIlwiPicreGhyLnJlc3BvbnNlSlNPTi5lcnJvcnNbZmllbGRfbmFtZV1bMF0rJzwvbGFiZWw+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkKCdpbnB1dFtuYW1lPVwiJytmaWVsZF9uYW1lKydcIl0nKS5hZnRlcihodG1sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlKz0nPGI+JytmaWVsZF9uYW1lKyc8L2I+OiAnK3hoci5yZXNwb25zZUpTT04uZXJyb3JzW2ZpZWxkX25hbWVdWzBdKyc8YnI+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQuYWxlcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRmllbGQgaW52YWxpZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9KTtcblxuICAgICQoXCIjc3VwcGxpZXJzX2lkXCIpLm11bHRpc2VsZWN0KHtcbiAgICAgICAgZW5hYmxlSFRNTDpmYWxzZSxcbiAgICB9KTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./resources/js/modules/brand/create.js\n");

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