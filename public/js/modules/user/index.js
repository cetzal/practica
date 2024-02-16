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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/modules/user/index.js":
/*!********************************************!*\
  !*** ./resources/js/modules/user/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  var token = localStorage.getItem('token');
  var user_id = [];
  var url_path_user = 'api/user';
  $('div.securty_pass_c').hide();
  $('div.securty_pass_u').hide();
  var up_user_id = $("input[name='id']").val();
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
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
  $("#date_update").daterangepicker({
    locale: {
      format: 'DD/MM/YYYY'
    },
    todayHighlight: true,
    autoUpdateInput: false
  });
  $('input[name="date_range"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
  });
  $('input[name="date_range"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  $('input[name="date_update"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
  });
  $('input[name="date_update"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  //dropzone portion
  Dropzone.autoDiscover = false;
  $(".delete_all_user").on('click', function (e) {
    e.preventDefault();
    if (user_id.length) {
      $.confirm({
        title: 'Eliminar usuarios',
        content: 'Realmente quieres eliminar los usarios selecionados',
        buttons: {
          deleteUser: {
            text: 'Si, eliminar',
            action: function action() {
              $.ajax({
                type: 'PUT',
                url: 'api/user/all/deletebyselection',
                data: {
                  userIdArray: user_id
                },
                success: function success(data) {
                  user_id = [];
                  $.alert({
                    title: 'Eliminar usuarios seleccionados',
                    content: 'se elimino todo los usuarios selecionados '
                  });
                  $("#select_all").prop('checked', false);
                  $('#user-table').DataTable().ajax.reload();
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
        title: 'Eliminar usuario',
        content: 'Selecciones los usuario que deseas eliminar'
      });
    }
  });
  $(".active_all_user").on('click', function (e) {
    e.preventDefault();
    if (user_id.length) {
      $.confirm({
        title: 'Activar usuarios',
        content: 'Realmente quieres Activar los usarios selecionados',
        buttons: {
          deleteUser: {
            text: 'Si, activar',
            action: function action() {
              $.ajax({
                type: 'PUT',
                url: 'api/user/all/activatebyselection',
                data: {
                  userIdArray: user_id
                },
                success: function success(data) {
                  $.alert({
                    title: 'Activar usuario',
                    content: 'se activado todo los usuario selecionados '
                  });
                  user_id = [];
                  $("#select_all").prop('checked', false);
                  $('#user-table').DataTable().ajax.reload();
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
        title: 'Activar usuario',
        content: 'Selecciones los usuario que deseas activar'
      });
    }
  });
  $(".desactive_all_user").on('click', function (e) {
    e.preventDefault();
    if (user_id.length) {
      $.confirm({
        title: 'Desactivar usuarios',
        content: 'Realmente quieres desactivar los usarios selecionados',
        buttons: {
          deleteUser: {
            text: 'Si, activar',
            action: function action() {
              $.ajax({
                type: 'PUT',
                url: 'api/user/all/deactivatebyselection',
                data: {
                  userIdArray: user_id
                },
                success: function success(data) {
                  user_id = [];
                  $.alert({
                    title: 'Desactiva usuario',
                    content: 'Se desactivo todo los usuario selecionados '
                  });
                  $("#select_all").prop('checked', false);
                  $('#user-table').DataTable().ajax.reload();
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
        title: 'Desactivar usuario',
        content: 'Selecciones los usuario que deseas desactivar'
      });
    }
  });
  $('.show_form_search').on('click', function (e) {
    e.preventDefault();
    $('.form_search').toggleClass('form_search_active');
  });
  $('.close_form').on('click', function (e) {
    $('.form_search').removeClass('form_search_active');
  });
  var table = $('#user-table').DataTable({
    responsive: true,
    autoWidth: true,
    serverSide: true,
    "searching": false,
    "bProcessing": true,
    //"ajax" : "",
    "ajax": {
      "url": url_path_user + '/list',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      "data": function data(d) {
        var frm_data = $('form#from_search').serializeArray();
        // return frm_data;
        $.each(frm_data, function (key, val) {
          d[val.name] = val.value;
        });
      }
    },
    "createdRow": function createdRow(row, data, dataIndex) {
      $(row).addClass('user-link');
      $(row).attr('data-user', JSON.stringify(data));
    },
    'columns': [{
      data: "text",
      "render": function render(data, type, full, meta) {
        return '<div class="checkbox"><input type="checkbox" class="dt-checkboxes checkbox_user"><label></label></div>';
      }
    }, {
      data: 'name'
    }, {
      data: 'last_name'
    }, {
      data: 'picture',
      "render": function render(data, type, row, meta) {
        var _picture = 'avarat.png';
        if (row.picture != null) {
          var _pictures = row.picture.split(",");
          _picture = _pictures[_pictures.length - 1];
          _picture = escapeHtml(_picture);
        }
        return '<img src="public/images/user/' + _picture + '" height="80" width="80">';
      }
    }, {
      data: 'email'
    }, {
      data: 'role_name',
      "render": function render(data, type, full, meta) {
        return full.role_name;
        // return full.role_id == 1 ? 'ADMIN' : 'CUSTOMER';
      }
    }, {
      data: 'status',
      "render": function render(data, type, full, meta) {
        var is_active = full.is_active == 1 ? 'Activo' : 'Desactivado';
        var class_text = "text-success";
        if (full.is_active == 0) {
          class_text = "text-warning";
        }
        data = '<span class="' + class_text + '">' + is_active + '</span>';
        return data;
      }
    }],
    "columnDefs": [{
      "orderable": false,
      'targets': [0, 3]
    }, {
      targets: [1],
      className: "text-center"
    }, {
      targets: [0, 1, 2, 3],
      searchable: false
    }, {
      targets: [7],
      render: function render(data, type, row, meta) {
        return row.user_parent_name;
      }
    }, {
      targets: [8],
      render: function render(data, type, row, meta) {
        if (row.created_at == null) {
          return '';
        }
        return moment(row.created_at).format('DD/MM/YYYY HH:mm:ss');
        DD;
      }
    }, {
      targets: [9],
      render: function render(data, type, row, meta) {
        if (row.updated_at == null) {
          return '';
        }
        return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
      }
    }, {
      targets: [10],
      "render": function render(data, type, row, meta) {
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
  $("#from_search").on("submit", function (event) {
    event.preventDefault();
    var date_range = $('#date_range').val();
    var type_fecha = $('.user-select-date').val();
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
  $('.clear_form_user').on('click', function (e) {
    $('#from_search')[0].reset();
    table.ajax.reload();
  });
  $('#user-table').on('click', '.open-EditbrandDialog ', function () {
    var url = "api/user/";
    var id = $(this).data('id').toString();
    url = url.concat(id);
    $("input[name='id']").val(id);
    $.get(url, function (data) {
      $("input[name='name']").val(data['name']);
      $("input[name='last_name']").val(data['last_name']);
      $("input[name='email']").val(data['email']);
      $("input[name='role_id']").val(data['role_id']);
      up_user_id = data['id'];
    });
  });
  $('#user-table').on('click', '.remove ', function () {
    var url = "api/user/";
    var id = $(this).data('id').toString();
    url = url.concat(id);
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Eliminar usuarios',
      content: 'Realmente quieres eliminar el usuario',
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
  $('#user-table').on('click', '.desactivar ', function () {
    var url = "api/user/{id}/deactivate";
    var id = $(this).data('id').toString();
    url = url.replace(/{id}/g, id);
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Desactivar usuario',
      content: 'Realmente quieres desactivar el usuario',
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
  $('#user-table').on('click', '.activar ', function () {
    var url = "api/user/{id}/activate";
    var id = $(this).data('id').toString();
    url = url.replace(/{id}/g, id);
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Activar usuario',
      content: 'Realmente quieres activar el usuario',
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
  $("#user-table #select_all").on("change", function () {
    if ($(this).is(':checked')) {
      $("tbody input[type='checkbox']").prop('checked', true);
    } else {
      $("tbody input[type='checkbox']").prop('checked', false);
    }
    user_id = [];
    verific_checks_users(0);
  });
  $('#user-table').on('click', "tbody input[type='checkbox']", function (e) {
    if (!$(this).is(":checked")) {
      //If the checkbox is checked
      user_id = [];
    }
    verific_checks_users(1);
  });
  $('.bt-close-modal').on('click', function (e) {
    $("input[name='name']").val('');
    $("input[name='last_name']").val('');
    $("input[name='email']").val('');
    $('div.securty_pass_c').hide();
    $('div.securty_pass_u').hide();
    $('form#new_user')[0].reset();
    $('form#update_user')[0].reset();
    $("form#new_user").find("#btn-password").removeClass('is-invalid');
    $("form#new_user").find("#btn-password").attr('aria-invalid', false);
    $("form#update_user").find("#btn-password-up").removeClass('is-invalid');
    $("form#update_user").find("#btn-password-up").attr('aria-invalid', false);
  });
  $('.btn-close-modal').on('click', function (e) {
    $("input[name='name']").val('');
    $("input[name='last_name']").val('');
    $("input[name='email']").val('');
    $('div.securty_pass_c').hide();
    $('div.securty_pass_u').hide();
    $('form#new_user')[0].reset();
    $('form#update_user')[0].reset();
    $("form#new_user").find("#btn-password").removeClass('is-invalid');
    $("form#new_user").find("#btn-password").attr('aria-invalid', false);
    $("form#update_user").find("#btn-password-up").removeClass('is-invalid');
    $("form#update_user").find("#btn-password-up").attr('aria-invalid', false);
  });
  var verific_checks_users = function verific_checks_users(num) {
    $(':checkbox.checkbox_user:checked').each(function (i) {
      var user_data = $(this).closest('tr').data('user');
      if (typeof user_data !== 'undefined') {
        user_id[i] = user_data.id;
      }
    });
  };
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
  $('#show_pass').on("click", function () {
    if ($(this).hasClass('show_p')) {
      $(this).removeClass('show_p');
      $(this).addClass('hiden_p');
      $(this).html('<i class="fa fa-eye-slash" aria-hidden="true"></i>');
      $('#btn-password').attr('type', 'text');
    } else {
      $(this).removeClass('hiden_p');
      $(this).addClass('show_p');
      $(this).html('<i class="fa fa-eye" aria-hidden="true"></i>');
      $('#btn-password').attr('type', 'password');
    }
  });
  $('#show_passpu').on("click", function () {
    if ($(this).hasClass('show_pu')) {
      $(this).removeClass('show_pu');
      $(this).addClass('hiden_p');
      $(this).html('<i class="fa fa-eye-slash" aria-hidden="true"></i>');
      $('#btn-password-up').attr('type', 'text');
    } else {
      $(this).removeClass('hiden_p');
      $(this).addClass('show_pu');
      $(this).html('<i class="fa fa-eye" aria-hidden="true"></i>');
      $('#btn-password-up').attr('type', 'password');
    }
  });
  function formatErrorUsingClassesAndPopover(element, array_of_problems) {
    var someHTML = '';
    array_of_problems.forEach(function (e) {
      someHTML += '<li>' + element + ': ' + e + '</li>';
    });
    // $('#'+element+'_error_section').html('<ul>'+someHTML+'</ul>');
    // $('#'+element).addClass('is-invalid');

    return '<ul>' + someHTML + '</ul><br>';
  }
})();

/***/ }),

/***/ 21:
/*!**************************************************!*\
  !*** multi ./resources/js/modules/user/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/user/index.js */"./resources/js/modules/user/index.js");


/***/ })

/******/ });