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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/modules/LogModule.js":
/*!*******************************************!*\
  !*** ./resources/js/modules/LogModule.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function () {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $(document).ready(function () {
    $("#range_date").daterangepicker({
      opens: 'left',
      //maxDate: moment().endOf('month'),
      maxDate: moment().endOf(),
      showApplyButton: false,
      autoApply: true,
      showInputs: false,
      locale: {
        format: 'DD/MM/YYYY'
      },
      todayHighlight: true,
      autoUpdateInput: false
    });
    $('input[name="range_date"]').on('apply.daterangepicker', function (ev, picker) {
      $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });
    $('input[name="range_date"]').on('cancel.daterangepicker', function (ev, picker) {
      $(this).val('');
    });
    var table = $('#log-data-table').DataTable({
      searching: false,
      bProcessing: true,
      "ajax": {
        url: "api/log-module/list",
        "data": function data(d) {
          var frm_data = $('form#from_search_log').serializeArray();
          // return frm_data;
          $.each(frm_data, function (key, val) {
            d[val.name] = val.value;
          });
        },
        type: "GET"
      },
      'language': {
        // 'lengthMenu': '_MENU_ {{trans("file.records per page")}}',
        // "info":      '<small>{{trans("file.Showing")}} _START_ - _END_ (_TOTAL_)</small>',
        // "search":  '{{trans("file.Search")}}',
        'lengthMenu': '_MENU_',
        "info": '<small> _START_ - _END_ (_TOTAL_)</small>',
        "search": 'Search',
        'paginate': {
          'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
          'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        }
      },
      'createdRow': function createdRow(row, data, dataIndex) {
        $(row).attr('data-log-id', data['id']);
      },
      'columnDefs': [{
        "orderable": false,
        'targets': [0]
      }, {
        'render': function render(data, type, row, meta) {
          return row.module;
        },
        'targets': [0]
      }, {
        'render': function render(data, type, row, meta) {
          return row.movement_type;
        },
        'targets': [1]
      }, {
        'render': function render(data, type, row, meta) {
          return row.user_name;
        },
        'targets': [2]
      }, {
        'render': function render(data, type, row, meta) {
          return moment(row.movement_date).format('DD/MM/YYYY HH:mm:ss');
        },
        'targets': [3]
      }, {
        'render': function render(data, type, row, meta) {
          // var url_edit = "{{route('products.edit', [':id'])}}";
          // url_edit = url_edit.replace(':id', row.id);
          var $html = '<a href="#" class="btn bg-primary btn-sm open-EditbrandDialog" data-id="' + row.id + '" data-bs-toggle="modal" data-bs-target="#detailLogModal"><i class="fa fa-eye text-white" aria-hidden="true"></i></a>';
          return $html;
        },
        'targets': [4]
      }]
    });
  });
  $('#log-data-table').on('click', '.open-EditbrandDialog ', function () {
    var url = "api/log-module/";
    var id = $(this).data('id').toString();
    url = url.concat(id).concat("/edit");
    $.get(url, function (data) {
      var details = JSON.parse(data.details);
      var previous_value = details.previous_value;
      var current_value = details.current_value;
      var keys_previous = Object.keys(previous_value);
      var html = '<table>' + +'<thead><tr><th></th><th>Previous</th><th>Current</th></tr></thead>';
      var tr = '<tbody>';
      for (var index = 0; index < keys_previous.length; index++) {
        if (_typeof(previous_value[keys_previous[index]]) != undefined) {
          tr += '<tr><td>' + keys_previous[index] + '</td><td>' + previous_value[keys_previous[index]] + '</td>' + '<td>' + current_value[keys_previous[index]] + '</td></tr>';
        }
      }
      tr += '</tbody>';
      html += tr;
      html += '</table>';
      // $("#detail_log").text(data.details);
      $("#detail_log").html(html);

      // <thead>
      //     <tr>
      //         <th>{{trans('file.module')}}</th>
      //         <th>{{trans('file.movement_type')}}</th>
      //         <th>{{trans('file.User')}}</th>
      //         <th class="not-exported">{{trans('file.action')}}</th>
      //     </tr>
      // </thead>
      // $('#text').text('Ejemplo con text()');
      // $("input[name='name']").val(data['name']);
      // $("input[name='description']").val(data['description']);
      // $("input[name='brand_id']").val(data['id']);
    });
  });
  $('.show_form_search').on('click', function (e) {
    e.preventDefault();
    console.log('click a form');
    $('.form_search_log').toggleClass('form_search_active');
  });
  $('.close_form').on('click', function (e) {
    $('.form_search_log').removeClass('form_search_active');
  });
  $("#from_search_log").on("submit", function (event) {
    event.preventDefault();
    console.log('submit');
    $('#log-data-table').DataTable().ajax.reload();
  });
  $('.clear_form').on('click', function (e) {
    $('#from_search_log')[0].reset();
    $('#log-data-table').DataTable().ajax.reload();
  });
})();

/***/ }),

/***/ 2:
/*!*************************************************!*\
  !*** multi ./resources/js/modules/LogModule.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/LogModule.js */"./resources/js/modules/LogModule.js");


/***/ })

/******/ });