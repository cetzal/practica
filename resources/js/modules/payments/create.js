(function(){
    $('#set_date').text(moment().format('DD/MM/YYYY'));

    function loadSearchCreateComboAccounts(){
        let input = '#select_account';
        let url = '/api/payments/load/create/accounts';
        $.get(url, function(response) {
            let filtered = response.filter(function(current) {
                return current.id != ''
            });

            if (filtered.length == 0) {
                $.confirm({
                    title: '',
                    content: 'Para realizar pagos se requiere atender la configuracion de las cuentas.',
                    buttons: {
                        ok: function () {
                            window.location.replace('/accounts');
                        }
                    }
                });
            }

            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value="' + row.id + '" data-total_balance="'+row.total_balance+'" >' + row.name + '</option>');
                }); 
            }
        })
    }

    function loadSearchCreateComboSupplier(){
        input = '#select_supplier';
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            type: "GET",
            url:  '/api/payments/load/create/suppliers',
            success: function( response ){
               let filtered = response.filter(function(current) {
                    return current.id != ''
                });
                
                if (filtered.length == 0) {
                    $.confirm({
                        title: '',
                        content: 'Para realizar pagos se requiere atender la configuracion en proveedores.',
                        buttons: {
                            ok: function () {
                                window.location.replace('/suppliers');
                            }
                        }
                    });
                }

                if(response.length != 0){
                    
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }else{
                    $(input).empty();
                    $(input).append('<option value="">Without supplier</option>');
                }
            },
            error: function(xhr, textStatus, error){
              
            }
        });
    };

    $('#open-search-purchase').on('click', function(e) {
        e.preventDefault();
        supplier_id = $("select[name='supplier_id']").val();
        if(supplier_id == ""){
            $.alert({
                title : "Cuenta por pagar",
                content : "Selecione un proveedor"
            });

            return;
        }
        $("input[name='supplier_id']").val('');
        $("input[name='supplier_id']").val(supplier_id);
        $('#serchModalPurchase').modal('show');
    });

    $(document).ready(function(){
        loadSearchCreateComboAccounts();
        loadSearchCreateComboSupplier();
    });


    function calculateTotal() {
        let total_purchase = 0;
        let total_amount = 0;
        $('#purchase-detail-table tbody tr').each(function() {
            // let subtotal = parseFloat($(this).find('.subtotal').text());
            let purchase = parseFloat($(this).find('.total_purchase').text().replace(/[^\d.-]/g, ''));
            let amount = parseInt($(this).find('.amount').val());
            total_purchase += purchase;
            if (!isNaN(amount)) {
                total_amount += amount;
            }
        });

        $('#total-purchase').text('$ '+parseFloat(total_purchase).toLocaleString('en-US', {minimumFractionDigits: 2}));
        $('#total-paid').text('$ '+parseFloat(total_amount).toLocaleString('en-US', {minimumFractionDigits: 2}));
        
        if(total_purchase > 0){
            $("select[name='supplier_id']").find('option:not(:selected)').attr('disabled', true);
        }else{
            $("select[name='supplier_id']").find('option:not(:selected)').attr('disabled', false);
        }
    }

    function addRow(data) {
        let fila = $('<tr>').attr('data-purchase-id', data.id);
        let sale_exist = false;
        

        $('#purchase-detail-table tbody tr').each(function() {
            let sale_id = $(this).data('purchase-id').toString();
            if (sale_id == data.id) {
                sale_exist = true;
                return false;
            }
        });

        if (!sale_exist) {
            fila.append('<td>'+ data.date +'</td>');
            fila.append('<td>'+ data.supplier_name +'</td>');
            fila.append('<td class="total_purchase">$ '+ parseFloat(data.total).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
            fila.append('<td><input type="number" name="amount" class="amount" value="0" min="0" step="1" pattern="\d*"></td>');
            fila.append('<td><button type="button" class="btn btn-sm btn-danger remove-row"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
            $('#purchase-detail-table tbody').append(fila);
        }
        calculateTotal();
    }

    function addRows(data) {
        if ($('#purchase-detail-table tbody tr').length) {
            $.each(data,function(index, row) {
                addRow(row);
            });
        } else {
            $.each(data,function(index, row) {
                let fila = $('<tr>')
                            .attr('data-purchase-id', row.id)
                            .attr('data-balance', row.balance_receivable);
                fila.append('<td>'+ row.date +'</td>');
                fila.append('<td>'+ row.supplier_name +'</td>');
                fila.append('<td class="total_purchase">$ '+ parseFloat(row.total).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                fila.append('<td><input type="number" name="amount" class="amount" value="0" min="0" step="1"></td>');
                fila.append('<td><button type="button" class="btn btn-sm btn-danger remove-row"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
                $('#purchase-detail-table tbody').append(fila);
            });
            calculateTotal();
        }
    }

    $('#purchase-detail-table tbody').on('click', '.remove-row', function(event) {
        let row = $(this).closest("tr");
        $.confirm({
            title: '',
            content: 'Desea eliminar la compra?',
            buttons: {
                ok: function () {
                    row.remove();
                    calculateTotal();
                },
                cancel: function() {

                }
            }
        });
    });


    $('#purchase-detail-table').on('input', 'input.amount', function() {
        let row = $(this).closest('tr');
       
        let total_purchase = parseFloat(row.find('.total_purchase').text().replace(/[^\d.-]/g, ''));
        let amount = parseFloat(row.find('.amount').val());
       
        // let alert_reorden = product_quantity - amount;
        if (amount < 0) {
            $.alert({
                title: '',
                content: 'Solo se acepta valores positivos.'
            });
            row.find('.amount').val(0);
        } else if (amount > total_purchase ) {
            $.alert({
                title: '',
                content: 'El monto no debe ser mayor al total de la compra $'+total_purchase
            });
            row.find('.amount').val(0);
        }
         
        calculateTotal();
       
    });

    $('#payments-form').validate({
        rules:{
            supplier_id : {
                required : true,
            },
            account_id : {
                required : true
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
       
    });

    var check_ored_table = function(){
        var rownumber = $('table#purchase-detail-table tbody tr:last').index();
        if (rownumber < 0) {
            $.alert({
                title : "Cuenta de pagos",
                content : "Agregue compras a la tabla de pagos"
            });
            e.preventDefault();
            return false;
        }

        return true;
    }

    $('#payments-form').on('submit',function(e){
        e.preventDefault();
        if($(this).valid() && check_ored_table()){
            let payments_detail = [];
            let count = [];
            $('table#purchase-detail-table tbody tr').each(function() {
                let amount = parseFloat($(this).find('.amount').val().replace(/[^\d.-]/g, ''));
                if(amount == 0){
                    count.push(1);
                }
                let payments = {
                    purchase_id: parseInt($(this).data('purchase-id').toString()),
                    amount : amount,
                }
                payments_detail.push(payments);
            });


            if(count.length > 0){
                $.alert({
                    title : 'cuenta por pagar',
                    content : 'La lista de compras tiene un monto igual a 0'
                });
                return false;
            }

            let total_payments = parseFloat($('#purchase-detail-table').find('#total-paid').text().replace(/[^\d.-]/g, ''));
            let account_tota_balance = $('select[name="account_id"] option:selected').data('total_balance');
            
            if(total_payments > account_tota_balance){
                $.alert({
                    title : '',
                    content: 'La cuenta selecionada no tienes los fondos suficientes para realizar el pago'
                });

                return;
            }
            
            let data = {
                account_id : parseInt($("select[name='account_id']").val()),
                supplier_id: parseInt($("select[name='supplier_id']").val()),
                payments_purchase: payments_detail,
            };


            $.ajax({
                type:'POST',
                url:  "/api/payments",
                data: data,
                success: function (response) {
                    $.confirm({
                        title: 'Agregar pagos',
                        content: response.message,
                        buttons: {
                            ok: function () {
                                window.location.replace('/payments');
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
            })
        }
       
        
    });



    $(document).on('listen-searchModalPurchase', function(event, data_modal) {
        if (data_modal.data.length) {
            addRows(data_modal.data);
        }
    });
})();