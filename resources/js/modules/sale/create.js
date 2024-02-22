(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $("#sale_date").daterangepicker({
        singleDatePicker: true,
        showDropdowns: false,
        showOnFocus: false,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        },
    });

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

    function calculateTotalSale() {
        let total_sale = 0;
        let total_quantity = 0;
        let total_subtotal = 0;
        $('#product-table tbody tr').each(function() {
            let subtotal = parseFloat($(this).find('.subtotal').text());
            let quantity = parseInt($(this).find('.quantity').val());
            if (!isNaN(subtotal)) {
                total_sale += subtotal;
                total_quantity += quantity;
                total_subtotal += subtotal;
            }
        });

        $('#total-sale').text(total_sale.toFixed(2));
        $('#total-quantity').text(total_quantity);
        $('#total-subtotal').text(total_sale.toFixed(2));
    }
    function addRow(data) {
        let fila = $('<tr>').attr('data-product-id', data.id).attr('data-stock-alert', data.alert_quantity);
        let product_exist = false;
        let quantity = 1;

        $('#product-table tbody tr').each(function() {
            let product_code = $(this).find('.product-code').text();
            if (product_code == data.code) {
                let exist_quantity = parseInt($(this).find('.quantity').val());
                let new_quantity = exist_quantity + quantity;
                let unit_cost = $(this).find('.unit_cost').text();
                $(this).find('.quantity').val(new_quantity);
                $(this).find('.subtotal').text(new_quantity * unit_cost);
                product_exist = true;
                return false;
            }
        });

        if (!product_exist) {
            fila.append('<td class="product-code">'+ data.code +'</td>');
            fila.append('<td>'+ data.name +'</td>');
            fila.append('<td><input type="number" name="quantity" class="quantity" value="1" min="1" step="1"></td>');
            fila.append('<td class="unit_cost">'+ data.price +'</td>');
            fila.append('<td class="subtotal">'+ data.price +'</td>');
            fila.append('<td><button type="button" class="btn btn-sm btn-danger remove-row"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
            $('#product-table tbody').append(fila);
        }
        calculateTotalSale();
    }

    $("#sale-form").validate({
        rules : {
            sale_date: 'required',
            client_id: 'required',
            supplier_id: 'required',
            brand_id: 'required',
            product_id: 'required'
            
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
            client_id: 'The client is required',
            supplier_id: 'The supplier is required',
            brand_id: 'The brand is required',
            product_id: 'The product is required'
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
        // addRow();
        // $.get(url, function(response) {
        //     if (response) {
        //         // $(input).find('option').get(0).remove();
        //         $(input).find('option').remove().end();
        //         $(input).append('<option value="">Select product</option>');
        //         $.each(response, function(index, row) {
        //             $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
        //         }); 
        //     }
        // })
    });

    $('#product-table').on('input', 'input.quantity', function() {
        let row = $(this).closest('tr');
        let stock_alert = row.data('stock-alert').toString();
        let quantity = parseInt(row.find('.quantity').val());
        
        if (quantity > stock_alert) {
            $.alert({
                title: '',
                content: 'El producto excede la cantidad permitida'
            });
            row.find('.quantity').val(quantity - 1);
        } else {
            let unit_cost = row.find('.unit_cost').text();
            row.find('.subtotal').text(quantity * unit_cost);
            calculateTotalSale();
        }
    });

    $('#product-table tbody').on('click', '.remove-row', function(event) {
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

    $('#save-sale').on('click', function() {
        let product_details = [];
        $('#product-table tbody tr').each(function() {
            let product = {
                product_id: parseInt($(this).data('product-id').toString()),
                quantity: parseInt($(this).find('.quantity').val()),
                unit_price: parseFloat($(this).find('.unit_cost').text()).toFixed(2),
                total: parseFloat($(this).find('.subtotal').text()).toFixed(2),
            }

            product_details.push(product);
            
        });
        
        if (product_details.length == 0) {
            $.alert({
                title: '',
                content: 'No hay productos agregados'
            });
        } else {
            let data = {
                date: moment($("#sale_date").val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
                client_id: parseInt($("select[name='client_id']").val()),
                total: parseFloat($('#total-sale').text()).toFixed(2),
                product_details: product_details,
            };
            console.log('data', data);
    
            $.ajax
            ({
                type: "POST",
                url: '/api/sales',
                dataType: 'json',
                async: false,
                data: data,
                success: function (response) {
                    $.alert({
                        title : '',
                        content: response.message
                    })
                }
            });
        }
    });
})();