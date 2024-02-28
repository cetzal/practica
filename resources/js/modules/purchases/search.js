

(function(){
    var host = window.location.origin;
    function brandsBySupplier(supplier_id){
        var url = 'api/purchase/getBrandsBySupplierId/'+ supplier_id;
        $('select[name="brand_id"]').empty();
       
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

    // $('select[name="brand_id"]').on('change', function(e) {
    //     e.preventDefault();
    //     brand_id = $(this).val();
    //     if(brand_id) {
    //         getProductByIdbrand(brand_id);
    //     }else{    
    //         $('select[name="product_id"]').empty();
    //         $('select[name="product_id"]').append('<option value="">Select a brand</option>');
    //     }                
    // });

    $("#seach-purchase-product").on('submit', function(e){
        e.preventDefault();
        var form_data = {
            code_prod: $("input[name='code_prod']").val(),
            name_prod: $("input[name='name_prod']").val(),
            supplier_id: $("input[name='supplier_id']").val(),
            brand_id: $("select[name='brand_id']").val()
        };

        $.get('/api/purchase/modalProductSearch', form_data)
            .done(function(response) {
                $('#table-prod-search tbody').empty();
                if (response.length) {
                    $('#table-prod-search').show();
                    $.each(response, function(index, row) {
                        let fila = $('<tr>')
                                    .attr('data-product-id', row.id)
                                    .attr('data-alert-quantity', row.alert_quantity);

                        fila.append('<td><div class="checkbox"><input type="checkbox" class="dt-checkboxes checked-product"><label></label></div></td>');
                        fila.append('<td>'+ row.code +'</td>');
                        fila.append('<td>'+ row.name +'</td>');
                        fila.append('<td>'+ row.qty +'</td>');
                        fila.append('<td>$ '+ parseFloat(row.price).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                        $('#table-prod-search tbody').append(fila);
                    }); 
                }else{
                    $.alert({
                        title : '',
                        content : 'No se encontraron productos'
                    })
                }
            });
    });

     //Table
    $( "#table-prod-search #select_all" ).on("change", function() {
        
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
        // user_id = [];
        // verific_checks_users(0);
    });

    function selectedProducts() {
        let data = [];
        $('#table-prod-search tbody tr').each(function() {
            let checked = $(this).find('.checked-product');
            let row = $(this).closest('tr');

            if(checked.prop('checked')) {
                data.push({
                    id: parseInt(row.data('product-id').toString()),
                    code: $(this).find('td:eq(1)').text(),
                    name: $(this).find('td:eq(2)').text(),
                    qty: parseInt($(this).find('td:eq(3)').text()),
                    alert_quantity: parseInt(row.data('alert-quantity').toString()),
                    price: parseFloat($(this).find('td:eq(4)').text().replace(/[^\d.-]/g, '')),
                });
            }
        });
        return data;
    }

    $("#clear_form_search_product").on("click", function(e){
        e.preventDefault();
        $("input[name='code_prod']").val(''),
        $("input[name='name_prod']").val(''),
        $("select[name='brand_id']").val('')
        $( "#select_all" ).prop('checked', false);
        $('#table-prod-search tbody').empty();
        $('#table-prod-search').hide();

    });
    //Add products in view create sale
    $('#add-products').on('click', function() {
        let selected_products = selectedProducts();
        if (selected_products.length) {
            $( "#select_all" ).prop('checked', false);
            $("input[name='code_prod']").val(''),
            $("input[name='name_prod']").val(''),
            $("input[name='supplier_id']").val(''),
            $("select[name='brand_id']").val('')
            $('#table-prod-search tbody').empty();
            $(document).trigger('listen-searchModal', {data: selected_products});
            $('#serchModal').modal('hide');
        } else {
            $.alert({
                title: '',
                content: 'No hay productos seleccionados'
            });
        }
    });
   
    $(document).ready(function() {
        $('#serchModal').on('show.bs.modal', function(event) {
            let supplier_id =  $("input[name='supplier_id']").val();
            brandsBySupplier(supplier_id);
          // Hacer algo con 'dato' en el modal
        });
    });


})();