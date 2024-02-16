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
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/modules/supplier/index.js":
/*!************************************************!*\
  !*** ./resources/js/modules/supplier/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function () {
  var supplier_ids = [];
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $("#range_date").daterangepicker({
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
  $("#select_all").on("change", function () {
    if ($(this).is(':checked')) {
      $("tbody input[type='checkbox']").prop('checked', true);
    } else {
      $("tbody input[type='checkbox']").prop('checked', false);
    }
  });
  $('.show_form_search').on('click', function (e) {
    e.preventDefault();
    $('.form_search').toggleClass('form_search_active');
  });
  $('.close_form').on('click', function (e) {
    $('.form_search').removeClass('form_search_active');
  });
  var table = $('#supplier-table').DataTable({
    responsive: false,
    autoWidth: false,
    serverSide: true,
    "searching": false,
    "bProcessing": true,
    "ajax": {
      "url": "api/suppliers",
      "data": function data(d) {
        var frm_data = $('form#from_search_supplier').serializeArray();
        // return frm_data;
        $.each(frm_data, function (key, val) {
          d[val.name] = val.value;
        });
        console.log('frmdata', frm_data);
      }
    },
    "order": [],
    'language': {
      'lengthMenu': '_MENU_',
      "info": ' _START_ - _END_ (_TOTAL_)</small>',
      "search": '',
      'paginate': {
        'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      }
    },
    'createdRow': function createdRow(row, data, dataIndex) {
      $(row).attr('data-supplier-id', data['id']);
    },
    'columnDefs': [{
      "orderable": false,
      'targets': [0]
    }, {
      'render': function render(data, type, row, meta) {
        data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
        return data;
      },
      'targets': [0],
      'checkboxes': {
        'selectRow': true,
        'selectAllRender': '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>'
      }
    }, {
      'render': function render(data, type, row, meta) {
        return row.name;
      },
      'targets': [1]
    }, {
      'render': function render(data, type, row, meta) {
        return row.total_brands;
      },
      'targets': [2]
    }, {
      'render': function render(data, type, row, meta) {
        is_active = row.is_active == 1 ? 'Activo' : 'Desactivado';
        class_text = "text-success";
        if (row.is_active == 0) {
          class_text = "text-warning";
        }
        data = '<span class="' + class_text + '">' + is_active + '</span>';
        return data;
      },
      'targets': [3]
    }, {
      'render': function render(data, type, row, meta) {
        return row.created_by;
      },
      'targets': [4]
    }, {
      'render': function render(data, type, row, meta) {
        if (row.created_at == null) {
          return '';
        }
        return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
      },
      'targets': [5]
    }, {
      'render': function render(data, type, row, meta) {
        if (row.updated_at == null) {
          return '';
        }
        return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
      },
      'targets': [6]
    }, {
      'render': function render(data, type, row, meta) {
        var $html = '<a href="#" class="btn bg-success btn-sm open-EditSupplierDialog" data-id="' + row.id + '"  data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></a>';
        $html += '<a class="btn bg-danger m-1 remove btn-sm" data-id="' + row.id + '"><i class="fa fa-trash" aria-hidden="true"></i></a>';
        if (row.is_active == 1) {
          $html += '<a class="btn m-1 desactivar btn-sm" data-id="' + row.id + '"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
        } else {
          $html += '<a class="btn m-1 activar btn-sm" data-id="' + row.id + '"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
        }
        return $html;
      },
      'targets': [7]
    }, {
      targets: [1],
      className: "text-center"
    }, {
      targets: [0, 1, 2, 3],
      searchable: false
    }],
    // 'select': { style: 'multi',  selector: 'td:first-child'},
    'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]]
  });
  $(".delete_all").on('click', function (e) {
    e.preventDefault();
    supplier_ids = [];
    verific_checks_supplier(0);
    if (supplier_ids.length) {
      $.ajax({
        type: 'PUT',
        url: 'api/suppliers/all/deletebyselection',
        data: {
          brandIdArray: supplier_ids
        },
        success: function success(data) {
          console.log('data', data.messages);
          var messsage = 'Se elimino todo los proveedores selecionados';
          if (_typeof(data.messages) != undefined) {
            messsage = data.messages;
          }
          $.confirm({
            title: 'Eliminar proveedores',
            content: messsage,
            buttons: {
              ok: function ok() {
                table.ajax.reload();
                $("tbody input[type='checkbox']").prop('checked', false);
              }
            }
          });
        }
      });
    } else {
      $.alert({
        title: 'Eliminar marcas',
        content: 'Seleccione los proveedores que deseas eliminar'
      });
    }
  });

  //Activar todas las proveedores seleccionas
  $(".active_all").on('click', function (e) {
    e.preventDefault();
    supplier_ids = [];
    verific_checks_supplier(0);
    if (supplier_ids.length) {
      $.ajax({
        type: 'PUT',
        url: 'api/suppliers/all/activatebyselection',
        data: {
          brandIdArray: supplier_ids
        },
        success: function success(data) {
          $.confirm({
            title: 'Activar proveedores',
            content: 'Se activo todo los proveedores selecionados ',
            buttons: {
              ok: function ok() {
                table.ajax.reload();
                $("tbody input[type='checkbox']").prop('checked', false);
              }
            }
          });
        }
      });
    } else {
      $.alert({
        title: 'Activar proveedores',
        content: 'Seleccione los proveedores que deseas activar'
      });
    }
  });

  // Desactivas todas las prvoeedores seleccionadas
  $(".desactive_all").on('click', function (e) {
    e.preventDefault();
    supplier_ids = [];
    verific_checks_supplier(0);
    if (supplier_ids.length) {
      $.ajax({
        type: 'PUT',
        url: 'api/suppliers/all/deactivatebyselection',
        data: {
          brandIdArray: supplier_ids
        },
        success: function success(data) {
          $.confirm({
            title: 'Desactivar proveedores',
            content: 'Se desactivo todas los proveedores selecionados ',
            buttons: {
              ok: function ok() {
                table.ajax.reload();
                $("tbody input[type='checkbox']").prop('checked', false);
                // $('#supplier-table').DataTable().ajax().reload();
              }
              // cancel: function () {
              //     $.alert('Canceled!');
              // },
              // somethingElse: {
              //     text: 'Something else',
              //     btnClass: 'btn-blue',
              //     keys: ['enter', 'shift'],
              //     action: function(){
              //         $.alert('Something else?');
              //     }
              // }
            }
          });
        }
      });
    } else {
      $.alert({
        title: 'Desactivar proveedores',
        content: 'Seleccione los proveedores que deseas desactivar'
      });
    }
  });
  $('#supplier-table').on('click', '.remove ', function () {
    var url = "api/suppliers/";
    var id = $(this).data('id').toString();
    url += id;
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Delete supplier?',
      content: 'Realmente quieres eliminar el proveedor',
      // autoClose: 'cancelAction|8000',
      buttons: {
        deleteUser: {
          text: 'delete suppliers',
          action: function action() {
            $.ajax({
              url: url,
              type: 'DELETE',
              success: function success(response) {
                $.confirm({
                  title: response.status,
                  content: response.message,
                  buttons: {
                    ok: function ok() {
                      table.ajax.reload();
                    }
                  }
                });
                // table.ajax.reload();
              }
            });
          }
        },
        cancelAction: function cancelAction() {
          // $.alert('action is canceled');
        }
      }
    });
  });
  $('#supplier-table').on('click', '.desactivar ', function () {
    var url = "api/suppliers/";
    var id = $(this).data('id').toString();
    url = url.concat(id).concat("/deactivate");
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Descativar proveedor?',
      content: 'Realmente quieres desactivar el proveedor',
      // autoClose: 'cancelAction|8000',
      buttons: {
        deleteUser: {
          text: 'desactivar suppliers',
          action: function action() {
            $.ajax({
              url: url,
              type: 'PUT',
              success: function success(response) {
                $.alert({
                  title: response.status,
                  content: response.message
                });
                table.ajax.reload();
              }
            });
          }
        },
        cancelAction: function cancelAction() {
          // $.alert('action is canceled');
        }
      }
    });
  });
  $('#supplier-table').on('click', '.activar ', function () {
    var url = "api/suppliers/";
    var id = $(this).data('id').toString();
    url = url.concat(id).concat("/activate");
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Activar brand?',
      content: 'Realmente quieres activar el proveedor',
      // autoClose: 'cancelAction|8000',
      buttons: {
        deleteUser: {
          text: 'activar suppliers',
          action: function action() {
            $.ajax({
              url: url,
              type: 'PUT',
              success: function success(response) {
                $.alert({
                  title: response.status,
                  content: response.message
                });
                table.ajax.reload();
              }
            });
          }
        },
        cancelAction: function cancelAction() {
          // $.alert('action is canceled');
        }
      }
    });
  });
  var verific_checks_supplier = function verific_checks_supplier(num) {
    $(':checkbox:checked').each(function (i) {
      var supplier_data = $(this).closest('tr').data('supplier-id');
      if (typeof supplier_data != "undefined") {
        supplier_ids[i - 1] = supplier_data;
      }
    });
  };
  $("#from_search_supplier").on("submit", function (event) {
    event.preventDefault();
    var date_range = $('#range_date').val();
    var type_fecha = $('.brand-date-select').val();
    if (type_fecha == '' && date_range !== '') {
      $.alert({
        title: 'Filtra datos',
        content: 'Selecione un tipo de fecha a consultar'
      });
      return '';
    }
    if (date_range == '' && type_fecha !== '') {
      $.alert({
        title: 'Filtra datos',
        content: 'Selecione el rango de fecha'
      });
      return '';
    }
    table.ajax.reload();
  });
  $('.clear_form').on('click', function (e) {
    $('#from_search_supplier')[0].reset();
    table.ajax.reload();
  });
  $('#supplier-table').on('click', '.open-EditSupplierDialog ', function () {
    var url = "api/suppliers/";
    var id = $(this).data('id').toString();
    url = url.concat(id);
    $.get(url, function (data) {
      $("input[name='name']").val(data['data']['name']);
      $("input[name='supplier_id']").val(data['data']['id']);
    });
  });
  $('#createModal').on('show.bs.modal', function (event) {
    // Encuentra el formulario dentro del modal y limpia los campos
    $(this).find('form')[0].reset();
  });
})();

/***/ }),

/***/ 19:
/*!******************************************************!*\
  !*** multi ./resources/js/modules/supplier/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/supplier/index.js */"./resources/js/modules/supplier/index.js");


/***/ })

/******/ });