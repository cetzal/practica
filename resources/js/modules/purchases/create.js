(function(){
    var host = window.location.origin;
    var product_cost = [];
    var product_discount = [];
    var tax_rate = [];
    var tax_name = [];
    var tax_method = [];
    var unit_name = [];
    var unit_operator = [];
    var unit_operation_value = [];

    var row_product_cost;
    $("#purchase_date").daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'DD/MM/YYYY'
        },
    });

    var load_combobox = function(input){
        $(input).append('<option value="">Select a suppliers</option>');
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: 'json',
            type: "GET",
            url: host + '/api/suppliers/all/combobox',
            success: function( response ){
                if(response.length != 0){
                    
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
              }
            },
            error: function(xhr, textStatus, error){
              
            }
        });
    };

    $('select[name="supplier_id"]').on('change', function(e) {
        e.preventDefault();
        supplier_id = $(this).val();
        if(supplier_id) {
            brandsBySupplier(supplier_id);
        }else{    
            $('select[name="brand_id"]').empty();
            $('select[name="brand_id"]').append('<option value="">Select a brand</option>');
        }                
    });

    function brandsBySupplier(supplier_id){
        var url = 'api/brand/supplier/'+ supplier_id;
        $('select[name="brand_id"]').empty();
        $('select[name="brand_id"]').append('<option value="">Select a brand</option>');
        $.ajax({
            url: host +'/'+ url,
            type: "GET",
            dataType: "json",
            success:function(response) {
                $.each(response, function(index, row) {
                    $('select[name="brand_id"]').append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            },
        });
    }

    $('select[name="brand_id"]').on('change', function(e) {
        e.preventDefault();
        brand_id = $(this).val();
        if(brand_id) {
            getProductByIdbrand(brand_id);
        }else{    
            $('select[name="product_id"]').empty();
            $('select[name="product_id"]').append('<option value="">Select a brand</option>');
        }                
    });

    function getProductByIdbrand(brand_id){
        var url = 'api/product/productByIdBrandCombo/'+ brand_id;
        $('select[name="product_id"]').empty();
        $('select[name="product_id"]').append('<option value="">Select a brand</option>');
        $.ajax({
            url: host +'/'+ url,
            type: "GET",
            dataType: "json",
            success:function(response) {
                $.each(response, function(index, row) {
                    $('select[name="product_id"]').append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            },
        });
    }

    $('select[name="product_id"]').on('change', function(e) {
        e.preventDefault();
        let product_id = $(this).val();
        productSearch(product_id);
    });

    function productSearch(product_id) {
        
        $.ajax({
            type: 'GET',
            url: host + '/api/purchase/productSearch/' + product_id ,
            success: function(data) {
                //console.log(data);
                var flag = 1;
                $(".product-code").each(function(i) {
                    if ($(this).val() == data['code']) {
                        rowindex = i;
                        var qty = parseFloat($('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ') .qty').val()) + 1;
                        $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ') .qty').val(qty);
                        calculateRowProductData(qty);
                        flag = 0;
                    }
                });
               
                if(flag){
                    var newRow = $("<tr>");
                    var cols = '';
                    //<button type="button" class="edit-product btn btn-link" data-toggle="modal" data-target="#editModal"> <i class="dripicons-document-edit"></i></button>
                    cols += '<td>' + data['name'] + '</td>';
                    cols += '<td>' + data['code'] + '</td>';
                    cols += '<td><input type="number" class="form-control qty" name="qty[]" value="1" step="any" required/></td>';
                    cols += '<td class="tax"></td>';
                    cols += '<td class="sub-total"></td>';
                    cols += '<td><button type="button" class="ibtnDel btn btn-md btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></button></td>';
                    cols += '<input type="hidden" class="product-code" name="product_code[]" value="' + data['code'] + '"/>';
                    cols += '<input type="hidden" class="product-id" name="product_id[]" value="' + data['id'] + '"/>';
                    cols += '<input type="hidden" class="net_unit_cost" name="net_unit_cost[]" />';
                    cols += '<input type="hidden" class="subtotal-value" name="subtotal[]" />';
    
                    newRow.append(cols);
                    $("table.order-list tbody").append(newRow);
    
                    product_cost.push(parseFloat(data['cost']));
                    rowindex = newRow.index();
                    $("select[name='product_id']").val('');
                    $("select[name='supplier_id']").find('option:not(:selected)').attr('disabled', true);
                    calculateRowProductData(1);
                }
                
            }
        });
    }

    //Change quantity
    $("#myTable").on('input', '.qty', function() {
        rowindex = $(this).closest('tr').index();
        if($(this).val() < 1 && $(this).val() != '') {
            $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ') .qty').val(1);
            $.alert({
                title : "Orden de comras",
                content : 'La cantidad del producto es incorrecta'
            });
        }
        checkQuantity($(this).val(), true);
    });
    
    // delete item
    $("table.order-list tbody").on("click", ".ibtnDel", function(event) {
        rowindex = $(this).closest('tr').index();
        $(this).closest("tr").remove();
        $("select[name='supplier_id']").find('option:not(:selected)').attr('disabled', false);
        calculateTotal();
    });

    function calculateRowProductData(quantity) {
     
        var sub_total_unit = product_cost[rowindex] ;
        
        var net_unit_cost =  product_cost[rowindex];
        
        var sub_total = sub_total_unit * quantity;
    
        $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ')').find('td:nth-child(4)').text(net_unit_cost.toFixed(2));
        $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ')').find('.net_unit_cost').val(net_unit_cost.toFixed(2));

        $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ')').find('td:nth-child(5)').text(sub_total.toFixed(2));
        $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ')').find('.subtotal-value').val(sub_total.toFixed(2));
        
    
        calculateTotal();
    }

    function calculateTotal() {
        //Sum of quantity
        var total_qty = 0;
        $(".qty").each(function() {
    
            if ($(this).val() == '') {
                total_qty += 0;
            } else {
                total_qty += parseFloat($(this).val());
            }
        });
        $("#total-qty").text(total_qty);
        $('input[name="total_qty"]').val(total_qty);
    
      
        //Sum of subtotal
        var total = 0;
        $(".sub-total").each(function() {
            total += parseFloat($(this).text());
        });
        $("#total").text(total.toFixed(2));
        $('input[name="total_cost"]').val(total.toFixed(2));
    
        
    }

    function checkQuantity(purchase_qty, flag) {
        var row_product_code = $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ')').find('td:nth-child(2)').text();
       
    
        $('#editModal').modal('hide');
        $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ')').find('.qty').val(purchase_qty);
        var status = $('select[name="status"]').val();
        if(status == '1' || status == '2' )
            $('table.order-list tbody tr:nth-child(' + (rowindex + 1) + ')').find('.recieved').val(purchase_qty);
        calculateRowProductData(purchase_qty);
    }

    $('#purchase-form').validate({
        rules:{
            reference_no : {
                required : true,
            },
            purchase_date : {
                required : true,
            },
            status : {
                required : true,
            },
            supplier_id : {
                required : true,
            },
            brand_id : {
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
        messages: {
            reference_no:'The reference # is requerid',
        }
    });

    var check_ored_table = function(){
        var rownumber = $('table.order-list tbody tr:last').index();
        if (rownumber < 0) {
            $.alert({
                title : "Oreden de compra",
                content : "Agregue productos a la tabla de orden"
            });
            e.preventDefault();
            return false;
        }

        return true;
    }
   
    $('#purchase-form').on('submit',function(e){
        e.preventDefault();
        $('input[name="item"]').val($('table.order-list tbody tr:last').index() + 1);
        if($(this).valid() && check_ored_table()){
            let purchase_detail = [];
            $('table.order-list tbody tr').each(function() {
               
                let product = {
                    product_id : parseInt($(this).find('input[name="product_id[]"]').val()),
                    product_code : parseInt($(this).find('input[name="product_code[]"]').val()),
                    product_qty : parseInt($(this).find('input[name="qty[]"]').val()),
                    product_unit_price : parseFloat($(this).find('input[name="net_unit_cost[]"]').val()).toFixed(2),
                    product_subtotal : parseFloat($(this).find('input[name="subtotal[]"]').val()).toFixed(2),
                }
                purchase_detail.push(product);
            });

            let data = {
                reference_no : $('input[name="reference_no"]').val(),
                purchase_date: moment($("#purchase_date").val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
                supplier_id: parseInt($("select[name='supplier_id']").val()),
                status : $('select[name="status"]').val(),
                item : $('input[name="item"]').val(),
                total_qty : $('input[name="total_qty"]').val(),
                total: parseFloat($('input[name="total_cost"]').val()).toFixed(2),
                note: $('input[name="note"]').text(),
                purchase_detail: purchase_detail,
            };


            $.ajax({
                type:'POST',
                url: host + "/api/purchase",
                data: data,
                success:function(response){

                },
                error:function(response) {

                    if (response.status == 422) { 
                        //toastError(err.responseJSON.message);
                        let details = response.responseJSON.errors ;
                        let content = '';
                        Object.keys(details).forEach(field => {
                            content += formatErrorUsingClassesAndPopover(field,details[field]);
                        });

                        $.alert({
                            title: 'Error',
                            content: content

                        });
                    }
                },
            })
        }
       
        
    });



    $(document).ready(function(){
        load_combobox(".selectpicker-suppliers");
    });
})();