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

/***/ "./resources/js/modules/brand/Brand.js":
/*!*********************************************!*\
  !*** ./resources/js/modules/brand/Brand.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function () {
  var brand_id = [];
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
  brand_ids = [];
  //Eliminar todas las marcas

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
  var table = $('#brand-table').DataTable({
    responsive: false,
    autoWidth: false,
    serverSide: true,
    "searching": false,
    "bProcessing": true,
    "ajax": {
      "url": "api/brand",
      "data": function data(d) {
        var frm_data = $('form#from_brand_search').serializeArray();
        // return frm_data;
        $.each(frm_data, function (key, val) {
          d[val.name] = val.value;
        });
        console.log('form_data', frm_data);
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
    // 'columns': [
    //     { 
    //         data: "", "render": function (data, type, full, meta) {
    //             return data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
    //         }
    //     },
    //     { data: 'name' },
    //     { data: 'description' },
    //     { data: 'accion' , "render": function (data, type, full, meta) {

    //         let $html =  '<a class="btn bg-success m-1 update" data-id="'+data+'"><i class="icon-floppy-disk"></i> Update</a>';
    //             $html +=  '<a class="btn bg-danger m-1 remove" data-id="'+data+'"><i class="icon-trash"></i> Delete</a>';
    //             $html +=  '<a class="btn bg-grey m-1 reset" data-id="'+data+'"><i class="icon-reset"></i> Reset</a>';
    //             return $html;
    //         }
    //     },
    // ],
    'createdRow': function createdRow(row, data, dataIndex) {
      $(row).attr('data-branch-id', data['id']);
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
      'width': '100px',
      'render': function render(data, type, row, meta) {
        var html = '<p class="text_ellipsis" style="width:250px;">' + row.description + '</p>';
        return html;
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
        if (row.created_at == null) {
          return '';
        }
        return moment(row.updated_at).format('DD/MM/YYYY HH:mm:ss');
      },
      'targets': [6]
    }, {
      'render': function render(data, type, row, meta) {
        // let $html =  '<button type="button" class="open-EditbrandDialog btn bg-success" data-id="'+row.id+'" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></button>';
        var $html = '<a href="#" class="btn bg-success btn-sm open-EditbrandDialog" data-id="' + row.id + '"  data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-edit" aria-hidden="true"></i></a>';
        $html += '<a class="btn bg-danger m-1 remove btn-sm" data-id="' + row.id + '"><i class="fa fa-trash" aria-hidden="true"></i></a>';
        if (row.is_active == 1) {
          $html += '<a class="btn m-1 desactivar btn-sm" data-id="' + row.id + '"><i class="fa fa-toggle-on" aria-hidden="true"></i></a>';
        } else {
          $html += '<a class="btn m-1 activar btn-sm" data-id="' + row.id + '"><i class="fa fa-toggle-off" aria-hidden="true"></i></a>';
        }
        // let $html =  '<a href="'+url_edit+'" class="btn bg-success btn-sm open-EditbrandDialog" data-id="'+row.id+'"><i class="fa fa-edit" aria-hidden="true"></i></a>';
        // let $html =  '<a href="'+url_edit+'" class="btn bg-success btn-sm " data-id="'+row.id+'"><i class="fa fa-edit" aria-hidden="true"></i></a>';
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
    brand_ids = [];
    verific_checks(0);
    if (brand_ids.length) {
      $.ajax({
        type: 'PUT',
        url: 'api/brand/all/deletebyselection',
        data: {
          brandIdArray: brand_ids
        },
        success: function success(data) {
          console.log('data', data.messages);
          var messsage = 'se elimino todo las marcas selecionados';
          if (_typeof(data.messages) != undefined) {
            messsage = data.messages;
          }
          $.confirm({
            title: 'Eliminar marcas',
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
        content: 'Seleccione las marcas que deseas eliminar'
      });
    }
  });

  //Activar todas las marcas seleccionas
  $(".active_all").on('click', function (e) {
    e.preventDefault();
    brand_ids = [];
    verific_checks(0);
    if (brand_ids.length) {
      $.ajax({
        type: 'PUT',
        url: 'api/brand/all/activatebyselection',
        data: {
          brandIdArray: brand_ids
        },
        success: function success(data) {
          $.confirm({
            title: 'Activar marcas',
            content: 'Se activo todo las marcas selecionados ',
            buttons: {
              ok: function ok() {
                console.log('activar todas las marcas');
                table.ajax.reload();
                $("tbody input[type='checkbox']").prop('checked', false);
              }
            }
          });
        }
      });
    } else {
      $.alert({
        title: 'Activar marcas',
        content: 'Seleccione los marcas que deseas activar'
      });
    }
  });

  // Desactivas todas las marcas seleccionadas
  $(".desactive_all").on('click', function (e) {
    e.preventDefault();
    brand_ids = [];
    verific_checks(0);
    if (brand_ids.length) {
      $.ajax({
        type: 'PUT',
        url: 'api/brand/all/deactivatebyselection',
        data: {
          brandIdArray: brand_ids
        },
        success: function success(data) {
          $.confirm({
            title: 'Desactivar marcas',
            content: 'Se desactivo todas los marcas selecionados ',
            buttons: {
              ok: function ok() {
                console.log('desactivar todas las marcas');
                table.ajax.reload();
                $("tbody input[type='checkbox']").prop('checked', false);
                // $('#brand-table').DataTable().ajax().reload();
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
        title: 'Desactivar marcas',
        content: 'Seleccione lass marcas que deseas desactivar'
      });
    }
  });
  var verific_checks = function verific_checks(num) {
    $(':checkbox:checked').each(function (i) {
      var brand_data = $(this).closest('tr').data('branch-id');
      if (typeof brand_data != "undefined") {
        brand_ids[i - 1] = brand_data;
      }
    });
  };
  $("#from_brand_search").on("submit", function (event) {
    event.preventDefault();
    var date_range = $('#range_date').val();
    var type_fecha = $('.brand-date-select').val();
    console.log(type_fecha);
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
    $('#from_brand_search')[0].reset();
    table.ajax.reload();
  });
  $('#brand-table').on('click', '.open-EditbrandDialog ', function () {
    var url = "api/brand/";
    var id = $(this).data('id').toString();
    url = url.concat(id).concat("/edit");
    $.get(url, function (data) {
      $("input[name='name']").val(data['name']);
      $("textarea[name='description']").val(data['description']);
      $("input[name='brand_id']").val(data['id']);
    });
  });
  $('#brand-table').on('click', '.remove ', function () {
    var url = "api/brand/";
    var id = $(this).data('id').toString();
    url = url.concat(id).concat("/delete");
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Delete brand?',
      content: 'Realmente quieres eliminar la marca',
      // autoClose: 'cancelAction|8000',
      buttons: {
        deleteUser: {
          text: 'delete brands',
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
  $('#brand-table').on('click', '.desactivar ', function () {
    var url = "api/brand/";
    var id = $(this).data('id').toString();
    url = url.concat(id).concat("/deactivate");
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Descativar marca?',
      content: 'Realmente quieres desactivar la marca',
      // autoClose: 'cancelAction|8000',
      buttons: {
        deleteUser: {
          text: 'desactivar brands',
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
  $('#brand-table').on('click', '.activar ', function () {
    var url = "api/brand/";
    var id = $(this).data('id').toString();
    url = url.concat(id).concat("/activate");
    var Jquery = $.Jquery;
    $.confirm({
      title: 'Activar brand?',
      content: 'Realmente quieres activar la marca',
      // autoClose: 'cancelAction|8000',
      buttons: {
        deleteUser: {
          text: 'activar brands',
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
  $('#createModal').on('show.bs.modal', function (event) {
    // Encuentra el formulario dentro del modal y limpia los campos
    $(this).find('form')[0].reset();
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
  $('form#update_brand').validate({
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
      error.addClass("invalid-feedback");
      error.insertAfter(element);
    },
    messages: {
      name: "El nombre es requerido",
      description: "La descripcion es requerido"
    }
  });
  $('form#update_brand').submit(function (e) {
    e.preventDefault();
    if ($('#update_brand').valid()) {
      var data = new FormData($('form#update_brand')[0]);
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
          $('#editModal').modal('hide');
          $('#editModal').modal({
            backdrop: false
          });
          $('.modal-backdrop').remove();
          $.alert({
            title: response.status,
            content: response.message
          });
        }
      });
    }
  });
  $('.bt-close-modal').on('click', function (e) {
    $("input[name='name']").val('');
    $("textarea[name='description']").val('');
    $('form#new_brand')[0].reset();
    $('form#update_brand')[0].reset();
    $("form#new_brand").find("#btn-password").removeClass('is-invalid');
    $("form#new_brand").find("#btn-password").attr('aria-invalid', false);
    $("form#update_brand").find("#btn-password-up").removeClass('is-invalid');
    $("form#update_brand").find("#btn-password-up").attr('aria-invalid', false);
  });
  $('.btn-close-modal').on('click', function (e) {
    $("input[name='name']").val('');
    $("textarea[name='description']").val('');
    $('form#new_brand')[0].reset();
    $('form#update_brand')[0].reset();
    $("form#new_brand").find("#btn-password").removeClass('is-invalid');
    $("form#new_brand").find("#btn-password").attr('aria-invalid', false);
    $("form#update_brand").find("#btn-password-up").removeClass('is-invalid');
    $("form#update_brand").find("#btn-password-up").attr('aria-invalid', false);
  });
})();

/***/ }),

/***/ 4:
/*!***************************************************!*\
  !*** multi ./resources/js/modules/brand/Brand.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /usr/local/var/www/practica/resources/js/modules/brand/Brand.js */"./resources/js/modules/brand/Brand.js");


/***/ })

/******/ });