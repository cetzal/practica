(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });



    //Cargos combos para agregar cuentas
    function loadSearchCreateComboAccounts() {
        let input = '#select_account';
        let url = '/api/charges/load/create/accounts';
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
        $('#set_date').text(moment().format('DD/MM/YYYY'));
        loadSearchCreateComboAccounts();
    });

    function addRow(data) {
        let fila = $('<tr>').attr('data-sale-id', data.id);
        let sale_exist = false;
        // let quantity = 1;

        $('#sale-detail-table tbody tr').each(function() {
            let sale_id = $(this).data('sale-id').toString();
            if (sale_id == data.id) {
                sale_exist = true;
                return false;
            }
        });

        if (!sale_exist) {
            fila.append('<td>'+ data.date +'</td>');
            fila.append('<td>'+ data.client_name +'</td>');
            fila.append('<td class="total_sale">$ '+ parseFloat(data.total).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
            fila.append('<td><input type="number" name="amount" class="amount" value="0" min="0" step="1" pattern="\d*"></td>');
            fila.append('<td><button type="button" class="btn btn-sm btn-danger remove-row"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
            $('#sale-detail-table tbody').append(fila);
        }
        // calculateTotalSale();
    }

    function addRows(data) {
        if ($('#sale-detail-table tbody tr').length) {
            $.each(data,function(index, row) {
                addRow(row);
            });
        } else {
            console.log('agregar sales', data);
            $.each(data,function(index, row) {
                let fila = $('<tr>').attr('data-sale-id', row.id);
                fila.append('<td>'+ row.date +'</td>');
                fila.append('<td>'+ row.client_name +'</td>');
                fila.append('<td class="total_sale">$ '+ parseFloat(row.total).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                fila.append('<td><input type="number" name="amount" class="amount" value="0" min="0" step="1"></td>');
                fila.append('<td><button type="button" class="btn btn-sm btn-danger remove-row"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
                $('#sale-detail-table tbody').append(fila);
            });
            // calculateTotalSale();
        }
    }
    
    

    $(document).on('listen-searchModalSale', function(event, data_modal) {
        if (data_modal.data.length) {
            addRows(data_modal.data);
        }
    });

    //Abri el modal para buscar las ventas
    $('#open-search-sale').on('click', function(e) {
        e.preventDefault();
        $('#searchSale').modal('show');
        $("#select_search_client").val('');
        $("input[name='range_date']").val('');
        $( "#select_all" ).prop('checked', false);
        $('#display-table-sale-search').addClass('d-none');
        $('#sale-search-data-table tbody').empty();
    });

    $('#sale-detail-table tbody').on('click', '.remove-row', function(event) {
        let row = $(this).closest("tr");
        $.confirm({
            title: '',
            content: 'Desea eliminar la venta?',
            buttons: {
                ok: function () {
                    row.remove();
                    // calculateTotalSale();
                },
                cancel: function() {

                }
            }
        });
    });

    $('#sale-detail-table').on('input', 'input.amount', function() {
        let row = $(this).closest('tr');
        // let stock_alert = row.data('stock-alert').toString();
        // let product_quantity = row.data('product-quantity').toString();
        let total_sale = parseFloat(row.find('.total_sale').text().replace(/[^\d.-]/g, ''));
        let amount = parseFloat(row.find('.amount').val());
        // let alert_reorden = product_quantity - amount;
        if (amount < 0) {
            $.alert({
                title: '',
                content: 'Solo se acepta valores positivos.'
            });
            row.find('.amount').val(0);
        }

        if (amount > total_sale ) {
            $.alert({
                title: '',
                content: 'El monto no debe ser mayor al total de la venta'
            });
            row.find('.amount').val(0);
        }

        // if (amount > product_quantity) {
        //     alert_reorden = product_quantity - quantity;
        //     let message = 'La cantidad del producto permitida es de <b>'+product_quantity+ '</b>.';
        //     $.alert({
        //         title: '',
        //         content: message
        //     });
        //     row.find('.quantity').val(1);
        //     let unit_cost = parseFloat(row.find('.unit_cost').text().replace(/[^\d.-]/g, ''));
        //     let subtotal = 1 * unit_cost;
        //     row.find('.subtotal').text('$ '+parseFloat(subtotal).toLocaleString('en-US', {minimumFractionDigits: 2}));
        //     calculateTotalSale();
        // } else {
        //     let unit_cost = parseFloat(row.find('.unit_cost').text().replace(/[^\d.-]/g, ''));
        //     let subtotal = amount * unit_cost;
        //     row.find('.subtotal').text('$ '+parseFloat(subtotal).toLocaleString('en-US', {minimumFractionDigits: 2}));
        //     calculateTotalSale();
        // }
    });

    $("#charge-form").validate({
        rules : {
            account_id: 'required'
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
            account_id: 'The account is required'
        }
    });

    $('#save-charge').on('click', function(event) {
        let sales = [];
        $('#sale-detail-table tbody tr').each(function() {
            let sale = {
                sale_id: parseInt($(this).data('sale-id').toString()),
                amount: parseFloat($(this).find('.amount').val().replace(/[^\d.-]/g, '')),
            }

            sales.push(sale);
            
        });
        
        if (sales.length == 0) {
            $.alert({
                title: '',
                content: 'No hay cobros agregados'
            });
        } else if ($('form#charge-form').valid()) {
            let exist_error = false;
            $(this).find('select').each(function() {
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

            let data = {
                account_id: parseInt($("select[name='account_id']").val()),
                sales: sales,
            };
            console.log('cobro', data);
            let amount_is_zero = false;
            $('#sale-detail-table tbody tr').each(function() {
                let amount = $(this).find('.amount').val();
                if (amount == 0) {
                    amount_is_zero = true;
                    return false;
                }
            });

            if (amount_is_zero) {
                $.alert({
                    title: '',
                    content: 'Algun(os) monto(s) no pueden tener el valor de "0"'
                });
            } else {
                console.log('avanzo el codigo');
                // $.ajax({
                //     type: "POST",
                //     url: '/api/sales',
                //     dataType: 'json',
                //     async: false,
                //     data: data,
                //     success: function (response) {
                //         $.confirm({
                //             title : '',
                //             content: response.message,
                //             buttons: {
                //                 ok: function() {
                //                     window.location.replace('/sales');
                //                 }
                //             }
                //         });
                //     },
                //     error: function(xhr, textStatus, error){
                //         if (xhr.status == 422) {
                //             let message = ''
                //             $.each(xhr.responseJSON.errors,function(field_name,error){
                //                 message+='<b>'+field_name+'</b>: '+xhr.responseJSON.errors[field_name][0]+'<br>';
                //             })
    
                //             $.alert({
                //                 title: 'Field invalid',
                //                 content: message,
                //             });
                //         }
                //     }
                // });
            }

        }

        
    });

    $('.bt-close-modal').on('click', function(e){
        // $("input[name='code_prod']").val(''),
        // $("input[name='name_prod']").val(''),
        // $("#select_search_supplier").val(''),
        // $("#select_search_brand").val('')
        // $( "#select_all" ).prop('checked', false);
        // $('#product-search-data-table tbody').empty();
    });

    $('.btn-close-modal').on('click', function(e){
        // $("input[name='code_prod']").val(''),
        // $("input[name='name_prod']").val(''),
        // $("#select_search_supplier").val(''),
        // $("#select_search_brand").val('')
        // $( "#select_all" ).prop('checked', false);
        // $('#product-search-data-table tbody').empty();
    });
})();