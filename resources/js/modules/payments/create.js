(function(){
    $('#set_date').text(moment().format('DD/MM/YYYY'));

    function loadSearchCreateComboAccounts(){
        let input = '#select_account';
        let url = '/api/payments/load/create/accounts';
        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
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
        let total_sale = 0;
        let total_amount = 0;
        $('#purchase-detail-table tbody tr').each(function() {
            // let subtotal = parseFloat($(this).find('.subtotal').text());
            let sale = parseFloat($(this).find('.total_purchase').text().replace(/[^\d.-]/g, ''));
            let amount = parseInt($(this).find('.amount').val());
            total_sale += sale;
            if (!isNaN(amount)) {
                total_amount += amount;
            }
        });
        $('#total-purchase').text('$ '+parseFloat(total_sale).toLocaleString('en-US', {minimumFractionDigits: 2}));
        $('#total-paid').text('$ '+parseFloat(total_amount).toLocaleString('en-US', {minimumFractionDigits: 2}));
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
            console.log('agregar sales', data);
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
            let purchase_detail = [];
            let message = [];
            $('table#purchase-detail-table tbody tr').each(function() {
                
                let add_qty = parseInt($(this).find('input[name="qty[]"]').val());
                let current_qty = parseInt($(this).find('input[name="t_qty[]"]').val());
                let alert_q = parseInt($(this).find('input[name="alert_quantity[]"]').val());
                let name =  $(this).find('td:eq(0)').text();

                if( (add_qty + current_qty) <= alert_q ){
                    message.push({'message' : 'El producto "<b>'+ name +'</b>" no se puede comprar menos del punto de reorden ' + alert_q + '.'});
                }


                let product = {
                    product_id : parseInt($(this).find('input[name="product_id[]"]').val()),
                    product_code : parseInt($(this).find('input[name="product_code[]"]').val()),
                    product_qty : parseInt($(this).find('input[name="qty[]"]').val()),
                    product_unit_price : parseFloat($(this).find('input[name="net_unit_cost[]"]').val()).toFixed(2),
                    product_subtotal : parseFloat($(this).find('input[name="subtotal[]"]').val()).toFixed(2),
                }
                purchase_detail.push(product);
            });

            if(message.length > 0){
                alert_purchase_form(message);
                return;
            }

            let data = {
                reference_no : $('input[name="reference_no"]').val(),
                purchase_date: moment($("#purchase_date").val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
                supplier_id: parseInt($("select[name='supplier_id']").val()),
                note: $('input[name="note"]').text(),
                purchase_detail: purchase_detail,
            };


            $.ajax({
                type:'POST',
                url: host + "/api/purchase",
                data: data,
                success: function (response) {
                    $.confirm({
                        title: 'Agregar compra',
                        content: response.message,
                        buttons: {
                            ok: function () {
                                window.location.replace('/purchases');
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