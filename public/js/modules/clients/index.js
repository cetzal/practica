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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/modules/clients/index.js":
/*!***********************************************!*\
  !*** ./resources/js/modules/clients/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  var clients_id = [];
  $("#date_range").daterangepicker(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
    maxDate: moment().endOf(),
    showApplyButton: false,
    autoApply: true,
    showInputs: false
  }, "maxDate", "0"), "locale", {
    format: 'DD/MM/YYYY',
    "applyLabel": "Aplicar",
    "cancelLabel": "Cancelar"
  }), "todayHighlight", true), "autoUpdateInput", false));
  $('input[name="date_range"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
  });
  var table = $('#clients-data-table').DataTable({
    responsive: true,
    autoWidth: true,
    serverSide: true,
    "searching": false,
    "bProcessing": true,
    //"ajax" : "",
    "ajax": {
      "url": 'api/clients',
      "data": function data(d) {
        var frm_data = $('form#from_search_client').serializeArray();
        // return frm_data;
        $.each(frm_data, function (key, val) {
          d[val.name] = val.value;
        });
      }
    },
    "createdRow": function createdRow(row, data, dataIndex) {
      $(row).addClass('client-link');
      $(row).attr('data-client', JSON.stringify(data));
    },
    'columns': [{
      data: "text",
      "render": function render(data, type, full, meta) {
        return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes checkbox_client"><label></label></div>';
      }
    }],
    "columnDefs": [{
      "orderable": false,
      'targets': [0]
    }, {
      targets: [1],
      render: function render(data, type, row, meta) {
        return row.name;
      }
    }, {
      targets: [2],
      render: function render(data, type, row, meta) {
        var is_active = row.is_active == 1 ? 'Activo' : 'Desactivado';
        var class_text = "text-success";
        if (row.is_active == 0) {
          class_text = "text-warning";
        }
        data = '<span class="' + class_text + '">' + is_active + '</span>';
        return data;
      }
    }, {
      targets: [3],
      render: function render(data, type, row, meta) {
        return row.created_by;
      }
    }, {
      targets: [4],
      render: function render(data, type, row, meta) {
        if (row.created_at == null) {
          return '';
        }
        return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
      }
    }, {
      targets: [5],
      render: function render(data, type, row, meta) {
        if (row.updated_at == null) {
          return '';
        }
        return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
      }
    }, {
      targets: [6],
      render: function render(data, type, row, meta) {
        var $html = '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="' + row.id + '" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></button>';
        $html += '<a class="btn bg-danger m-1 remove" data-id="' + row.id + '"><i class="fa fa-trash" aria-hidden="true"></i></a>';
        if (row.is_active == 1) {
          $html += '<a class="btn bg-grey m-1 desactivar btn-sm" data-id="' + row.id + '"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
        } else {
          $html += '<a class="btn bg-grey m-1 activar btn-sm" data-id="' + row.id + '"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
        }
        // if(row.is_active == 1){
        //     $html +=  '<a class="btn bg-grey m-1 desactivar" data-id="'+row.id+'"><i class="icon-reset"></i> Desactivar</a>';
        // }else{
        //     $html +=  '<a class="btn bg-grey m-1 activar" data-id="'+row.id+'"><i class="icon-reset"></i> Activar</a>';
        // }
        return $html;
      }
    }],
    "order": [],
    'language': {
      'lengthMenu': '_MENU_',
      "info": '<small> _START_ - _END_ (_TOTAL_)</small>',
      "search": '',
      'paginate': {
        'previous': '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        'next': '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      }
    }
  });
  $("#from_search_client").on("submit", function (event) {
    event.preventDefault();
    var date_range = $('#date_range').val();
    var type_fecha = $('.client-select-date').val();
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
  $('.clear_form_client').on('click', function (e) {
    $('#from_search_client')[0].reset();
    table.ajax.reload();
  });
  $('#clients-data-table').on('click', '.open-EditbrandDialog ', function () {
    var url = "api/clients/";
    var id = $(this).data('id').toString();
    url = url.concat(id);
    $("input[name='client_id']").val(id);
    $.get(url, function (response) {
      if (response.status == "success") {
        $("input[name='name']").val(response.data.name);
        $("input[name='is_active']").prop("checked", response.data.is_active);
      }
    });
  });
  $('#clients-data-table').on('click', '.remove ', function (e) {
    e.preventDefault();
    var url = "api/clients/";
    var id = $(this).data('id').toString();
    url = url.concat(id);
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Eliminar clientes',
      content: 'Realmente quieres eliminar el cliente',
      buttons: {
        deleteUser: {
          text: 'Si, eliminar',
          action: function action() {
            $.ajax({
              url: url,
              type: 'DELETE',
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
        cancelar: function cancelar() {
          // $.alert('action is canceled');
        }
      }
    });
  });
  $('#clients-data-table').on('click', '.desactivar ', function (e) {
    e.preventDefault();
    var url = "api/clients/{id}/deactivate";
    var id = $(this).data('id').toString();
    url = url.replace(/{id}/g, id);
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Desactivar clientes',
      content: 'Realmente quieres desactivar el cliente',
      buttons: {
        deleteUser: {
          text: 'Si, desactivar',
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
        cancelar: function cancelar() {
          // $.alert('action is canceled');
        }
      }
    });
  });
  $('#clients-data-table').on('click', '.activar ', function (e) {
    e.preventDefault();
    var url = "api/clients/{id}/activate";
    var id = $(this).data('id').toString();
    url = url.replace(/{id}/g, id);
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Activar clientes',
      content: 'Realmente quieres activar el cliente',
      buttons: {
        deleteUser: {
          text: 'Si, activar',
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
        cancelar: function cancelar() {
          // $.alert('action is canceled');
        }
      }
    });
  });
  $("#select_all").on("change", function () {
    if ($(this).is(':checked')) {
      $("tbody input[type='checkbox']").prop('checked', true);
    } else {
      $("tbody input[type='checkbox']").prop('checked', false);
    }
    clients_id = [];
    verific_checks_users(0);
  });
  $('#clients-data-table').on('click', "tbody input[type='checkbox']", function (e) {
    if (!$(this).is(":checked")) {
      //If the checkbox is checked
      clients_id = [];
    }
    verific_checks_users(1);
  });
  var verific_checks_users = function verific_checks_users(num) {
    $(':checkbox.checkbox_client:checked').each(function (i) {
      var client_data = $(this).closest('tr').data('client');
      if (typeof client_data !== 'undefined') {
        clients_id[i] = client_data.id;
      }
    });
  };
  $(".delete_all_client").on('click', function (e) {
    e.preventDefault();
    if (clients_id.length) {
      $.confirm({
        title: 'Eliminar clientes',
        content: 'Realmente quieres eliminar los usarios selecionados',
        buttons: {
          deleteUser: {
            text: 'Si, eliminar',
            action: function action() {
              $.ajax({
                type: 'PUT',
                url: 'api/clients/all/deletebyselection',
                data: {
                  clientsIdArray: clients_id
                },
                success: function success(data) {
                  clients_id = [];
                  $.alert({
                    title: 'Eliminar clientes seleccionados',
                    content: 'se elimino todo los clientes selecionados '
                  });
                  $("#select_all").prop('checked', false);
                  $('#clients-data-table').DataTable().ajax.reload();
                }
              });
            }
          },
          cancelar: function cancelar() {
            // $.alert('action is canceled');
          }
        }
      });
    } else {
      $.alert({
        title: 'Eliminar clientes',
        content: 'Selecciones los clientes que deseas eliminar'
      });
    }
  });
  $(".active_all_client").on('click', function (e) {
    e.preventDefault();
    if (clients_id.length) {
      $.confirm({
        title: 'Activar clientes',
        content: 'Realmente quieres Activar los clientes selecionados',
        buttons: {
          deleteUser: {
            text: 'Si, activar',
            action: function action() {
              $.ajax({
                type: 'PUT',
                url: 'api/clients/all/activarbyselection',
                data: {
                  clientsIdArray: clients_id
                },
                success: function success(data) {
                  $.alert({
                    title: 'Activar clientes',
                    content: 'se activado todo los clientes selecionados '
                  });
                  clients_id = [];
                  $("#select_all").prop('checked', false);
                  $('#clients-data-table').DataTable().ajax.reload();
                }
              });
            }
          },
          cancelar: function cancelar() {
            // $.alert('action is canceled');
          }
        }
      });
    } else {
      $.alert({
        title: 'Activar clientes',
        content: 'Selecciones los clientes que deseas activar'
      });
    }
  });
  $(".desactive_all_client").on('click', function (e) {
    e.preventDefault();
    if (clients_id.length) {
      $.confirm({
        title: 'Desactivar clientes',
        content: 'Realmente quieres desactivar los clientes selecionados',
        buttons: {
          deleteUser: {
            text: 'Si, activar',
            action: function action() {
              $.ajax({
                type: 'PUT',
                url: 'api/clients/all/deactivatebyselection',
                data: {
                  clientsIdArray: clients_id
                },
                success: function success(data) {
                  clients_id = [];
                  $.alert({
                    title: 'Desactiva clientes',
                    content: 'Se desactivo todo los clientes selecionados '
                  });
                  $("#select_all").prop('checked', false);
                  $('#clients-data-table').DataTable().ajax.reload();
                }
              });
            }
          },
          cancelar: function cancelar() {
            // $.alert('action is canceled');
          }
        }
      });
    } else {
      $.alert({
        title: 'Desactivar clientes',
        content: 'Selecciones los clientes que deseas desactivar'
      });
    }
  });
})();

/***/ }),

/***/ 10:
/*!*****************************************************!*\
  !*** multi ./resources/js/modules/clients/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/clients/index.js */"./resources/js/modules/clients/index.js");


/***/ })

/******/ });