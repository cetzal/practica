(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $("#sale_date").daterangepicker({
        maxDate : moment().endOf(),
        singleDatePicker: true,
        showDropdowns: false,
        showOnFocus: false,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        },
    });

    // $("#sale_date").prop('disabled', true);

    $('#select_supplier').on('change', function() {
        let supplier_id = $(this).val();
        let url = '/api/sales/getBrandsBySupplierId/'+supplier_id;
        let input_brand = '#select_brand';
        let input_product = '#select_product';

        if (supplier_id != '') {
            $(input_product).find('option').remove().end();
            $(input_product).append('<option value="">Sin productos</option>');
            $.get(url, function(response) {
                if (response) {
                    // $(input).find('option').get(0).remove();
                    $(input_brand).find('option').remove().end();
                    $(input_brand).append('<option value="">Select brand</option>');
                    $.each(response, function(index, row) {
                        $(input_brand).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        }
    });

    $('#select_brand').on('change', function() {
        let brand_id = $(this).val();
        let url = '/api/sales/getProductsByBrandId/'+brand_id;
        let input = '#select_product';
        if (brand_id != '') {
            $.get(url, function(response) {
                if (response) {
                    // $(input).find('option').get(0).remove();
                    $(input).find('option').remove().end();
                    $(input).append('<option value="">Select product</option>');
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        }
    });

    function loadComboSuppliers() {
        let input = '#select_supplier';
        let url = '/api/sales/load/create/suppliers';
        $(input).append('<option value="">Without suppliers</option>');

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $(input).append('<option value="">Select supplier</option>');
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function loadComboClients() {
        let input = '#select_client';
        let url = '/api/sales/load/create/clients';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    $(document).ready(function() {
        loadComboClients();
        
        // $(document).on('click', function(event) {
        //     console.log('event click', $(event.target).attr('id'));
        //     // Verificar si el clic ocurrió fuera del área del modal
        //     if ($(event.target).closest('#searchProduct').length === 0 && $(event.target).attr('id') !== 'botonAbrirModal') {
        //         // El clic ocurrió fuera del modal, realiza las acciones de cierre del modal aquí
        //         console.log('Se ha cerrado el modal');
        //     }
        // });
    });

    function calculateTotalSale() {
        let total_sale = 0;
        let total_quantity = 0;
        let total_subtotal = 0;
        $('#product-detail-table tbody tr').each(function() {
            // let subtotal = parseFloat($(this).find('.subtotal').text());
            let subtotal = parseFloat($(this).find('.subtotal').text().replace(/[^\d.-]/g, ''));
            let quantity = parseInt($(this).find('.quantity').val());
            if (!isNaN(subtotal)) {
                total_sale += subtotal;
                total_quantity += quantity;
                total_subtotal += subtotal;
            }
        });
        $('#total-sale').text('$ '+parseFloat(total_sale).toLocaleString('en-US', {minimumFractionDigits: 2}));
        $('#total-quantity').text(total_quantity);
    }

    function addRow(data) {
        let fila = $('<tr>')
                    .attr('data-product-id', data.id)
                    .attr('data-stock-alert', data.alert_quantity)
                    .attr('data-product-quantity', data.qty);
        let product_exist = false;
        let quantity = 1;

        $('#product-detail-table tbody tr').each(function() {
            let product_code = $(this).find('.product-code').text();
            if (product_code == data.code) {
                let exist_quantity = parseInt($(this).find('.quantity').val());
                let new_quantity = exist_quantity + quantity;
                let unit_cost = parseFloat($(this).find('.unit_cost').text().replace(/[^\d.-]/g, ''));
                $(this).find('.quantity').val(new_quantity);
                $(this).find('.subtotal').text('$ '+parseFloat(new_quantity * unit_cost).toLocaleString('en-US', {minimumFractionDigits: 2}));
                $(this).attr('data-stock-alert', data.alert_quantity);
                product_exist = true;
                return false;
            }
        });

        if (!product_exist) {
            let unit_price = parseFloat(data.price);
            let subtotal = 1 * unit_price;
            
            fila.append('<td>'+ data.name +'</td>');
            fila.append('<td class="product-code">'+ data.code +'</td>');
            fila.append('<td><input type="number" name="quantity" class="quantity" value="1" min="1" step="1"></td>');
            fila.append('<td class="unit_cost">$ '+ parseFloat(unit_price).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
            fila.append('<td class="subtotal">$ '+ parseFloat(subtotal).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
            fila.append('<td><button type="button" class="btn btn-sm btn-danger remove-row"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
            $('#product-detail-table tbody').append(fila);
        }
        calculateTotalSale();
    }

    function addRows(data) {
        if ($('#product-detail-table tbody tr').length) {
            $.each(data,function(index, row) {
                addRow(row);
            });
        } else {
            $.each(data,function(index, row) {
                let fila = $('<tr>')
                        .attr('data-product-id', row.id)
                        .attr('data-stock-alert', row.alert_quantity)
                        .attr('data-product-quantity', row.qty);
                        
                    let unit_price = parseFloat(row.price);
                    let subtotal = 1 * unit_price;
                    fila.append('<td>'+ row.name +'</td>');
                    fila.append('<td class="product-code">'+ row.code +'</td>');
                    fila.append('<td><input type="number" name="quantity" class="quantity" value="1" min="1" step="1"></td>');
                    // fila.append('<td class="unit_cost">'+ unit_price.toFixed(2) +'</td>');
                    // fila.append('<td class="subtotal">'+ subtotal.toFixed(2) +'</td>');
                    fila.append('<td class="unit_cost">$ '+ parseFloat(unit_price).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                    fila.append('<td class="subtotal">$ '+ parseFloat(subtotal).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                    fila.append('<td><button type="button" class="btn btn-sm btn-danger remove-row"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
                    $('#product-detail-table tbody').append(fila);
            });
            calculateTotalSale();
        }
    }
    
    $("#sale-form").validate({
        rules : {
            sale_date: 'required',
            client_id: 'required'
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
        messages: {
            sale_date : 'The date is required',
            client_id: 'The client is required'
        }
    });

    $('#add-product').on('click', function() {
        let product_id = $('#select_product').val();
        let url = '/api/product/'+product_id;
        if ($("#sale-form").valid()) {
            $.get(url)
            .done(function(response){ 
                if (response) {
                    addRow(response);
                }
            })
            .fail(function(error, fail){
                // alert("error(fail)");
            });
        }
    });

    $('#product-detail-table').on('input', 'input.quantity', function() {
        let row = $(this).closest('tr');
        let stock_alert = row.data('stock-alert').toString();
        let product_quantity = row.data('product-quantity').toString();
        let quantity = parseInt(row.find('.quantity').val());
        let alert_reorden = product_quantity - quantity;

        if (quantity > product_quantity) {
            alert_reorden = product_quantity - quantity;
            let message = 'La cantidad del producto permitida es de <b>'+product_quantity+ '</b>.';
            $.alert({
                title: '',
                content: message
            });
            row.find('.quantity').val(1);
            let unit_cost = parseFloat(row.find('.unit_cost').text().replace(/[^\d.-]/g, ''));
            let subtotal = 1 * unit_cost;
            row.find('.subtotal').text('$ '+parseFloat(subtotal).toLocaleString('en-US', {minimumFractionDigits: 2}));
            calculateTotalSale();
        } else {
            let unit_cost = parseFloat(row.find('.unit_cost').text().replace(/[^\d.-]/g, ''));
            let subtotal = quantity * unit_cost;
            row.find('.subtotal').text('$ '+parseFloat(subtotal).toLocaleString('en-US', {minimumFractionDigits: 2}));
            calculateTotalSale();
        }
    });

    $('#product-detail-table tbody').on('click', '.remove-row', function(event) {
        let row = $(this).closest("tr");
        $.confirm({
            title: '',
            content: 'Desea eliminar el producto?',
            buttons: {
                ok: function () {
                    row.remove();
                    calculateTotalSale();
                },
                cancel: function() {

                }
            }
        });
    });

    $('#save-sale').on('click', function(event) {
        let product_details = [];
        $('#product-detail-table tbody tr').each(function() {
            parseFloat($(this).find('.unit_cost').text().replace(/[^\d.-]/g, ''))
            let product = {
                product_id: parseInt($(this).data('product-id').toString()),
                quantity: parseInt($(this).find('.quantity').val()),
                unit_price: parseFloat($(this).find('.unit_cost').text().replace(/[^\d.-]/g, '')),
                total: parseFloat($(this).find('.subtotal').text().replace(/[^\d.-]/g, '')),
            }

            product_details.push(product);
            
        });
        
        if (product_details.length == 0) {
            $.alert({
                title: '',
                content: 'No hay productos agregados'
            });
        } else if ($('form#sale-form').valid()) {
            let data = {
                date: moment($("#sale_date").val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
                client_id: parseInt($("select[name='client_id']").val()),
                total: parseFloat($('#total-sale').text().replace(/[^\d.-]/g, '')),
                product_details: product_details,
            };
    
            $.ajax({
                type: "POST",
                url: '/api/sales',
                dataType: 'json',
                async: false,
                data: data,
                success: function (response) {
                    $.confirm({
                        title : '',
                        content: response.message,
                        buttons: {
                            ok: function() {
                                window.location.replace('/sales');
                            }
                        }
                    });
                },
                error: function(xhr, textStatus, error){
                    if (xhr.status == 422) {
                        let message = ''
                        $.each(xhr.responseJSON.errors,function(field_name,error){
                            message+='<b>'+field_name+'</b>: '+xhr.responseJSON.errors[field_name][0]+'<br>';
                        })

                        $.alert({
                            title: 'Field invalid',
                            content: message,
                        });
                    }
                }
            });
        }

        let exist_error = false;
        $(this).find('input, select').each(function() {
            if (!$(this).val()) {
                exist_error = true;
            } 
        });
        
        if (exist_error) {
            var first_error = $(this).find('.error').first();
            if (first_error.length) { 
              $('html, body').animate({
                scrollTop: first_error.offset().top
              }, 500);
              event.preventDefault();
            }
          }
    });

    //Para cargar los cambos del modal searchProduct
    function loadSearchComboSuppliers() {
        let input = '#select_search_supplier';
        let url = '/api/sales/load/create/suppliers';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    
    function loadSearchComboBrands() {
        let input = '#select_search_brand';
        let url = '/api/sales/load/create/brands';
        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    $(document).on('listen-searchModal', function(event, datos) {
        if (datos.data.length) {
            addRows(datos.data);
        }
    });


    //Open modal add product
    $('#open-search-product').on('click', function(e) {
        e.preventDefault();
        
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        $('#searchProduct').modal('show');
        $("input[name='code_prod']").val('');
        $("input[name='name_prod']").val('');
        $("#select_search_supplier").val('');
        $("#select_search_brand").val('')
        $('#display-table-product-search').addClass('d-none');
        $('#product-search-data-table tbody').empty();
    });

    $('.bt-close-modal').on('click', function(e){
        $("input[name='code_prod']").val(''),
        $("input[name='name_prod']").val(''),
        $("#select_search_supplier").val(''),
        $("#select_search_brand").val('')
        $( "#select_all" ).prop('checked', false);
        $('#product-search-data-table tbody').empty();
    });

    $('.btn-close-modal').on('click', function(e){
        $("input[name='code_prod']").val(''),
        $("input[name='name_prod']").val(''),
        $("#select_search_supplier").val(''),
        $("#select_search_brand").val('')
        $( "#select_all" ).prop('checked', false);
        $('#product-search-data-table tbody').empty();
    });
})();