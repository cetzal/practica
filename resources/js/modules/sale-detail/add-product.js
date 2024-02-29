(function() {

    function loadSearchComboSuppliers() {
        let input = '#select_search_supplier';
        let url = '/api/sale-details/load/create/suppliers';

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
        let url = '/api/sale-details/load/create/brands';
        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    //Load initial combos
    $('#select_search_supplier').on('change', function() {
        let supplier_id = $(this).val();
        let url = '/api/sale-details/getBrandsBySupplierId/'+supplier_id;
        let input_brand = '#select_search_brand';

        if (supplier_id != '') {
            $.get(url, function(response) {
                if (response) {
                    $(input_brand).find('option').remove().end();
                    $.each(response, function(index, row) {
                        $(input_brand).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        } else {
            loadSearchComboBrands();
        }
    });

    $('#select_brand').on('change', function() {
        let brand_id = $(this).val();
        let url = '/api/sale-details/getProductsByBrandId/'+brand_id;
        let input = '#select_product';
        if (brand_id != '') {
            $.get(url, function(response) {
                if (response) {
                    $(input).find('option').remove().end();
                    $(input).append('<option value="">Select product</option>');
                    $.each(response, function(index, row) {
                        $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        }
    });

    //Filter product
    $('#filter_data').on('click', function(event) {
        event.preventDefault();

        var form_data = {
            code_prod: $("input[name='code_prod']").val(),
            name_prod: $("input[name='name_prod']").val(),
            supplier_id: $("#select_search_supplier").val(),
            brand_id: $("#select_search_brand").val()
        };

        $.get('/api/sale-details/modalProductSearch', form_data)
            .done(function(response) {
                $('#product-search-data-table tbody').empty();
                $('#display-table-product-search').removeClass('d-none');
                if (response.length) {
                    $.each(response, function(index, row) {
                        let fila = $('<tr>')
                                    .attr('data-product-id', row.id)
                                    .attr('data-alert-quantity', row.alert_quantity);

                        fila.append('<td><div class="checkbox"><input type="checkbox" class="dt-checkboxes checked-product"><label></label></div></td>');
                        fila.append('<td>'+ row.code +'</td>');
                        fila.append('<td>'+ row.name +'</td>');
                        fila.append('<td>'+ row.qty +'</td>');
                        fila.append('<td>$ '+ parseFloat(row.price).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                        $('#product-search-data-table tbody').append(fila);
                    }); 
                } else if (response.length == 0) {
                    $('#display-table-product-search').addClass('d-none');
                }
            });
    });

    $('#clear_form_prod').on('click', function(event) {
        event.preventDefault();
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        $("input[name='code_prod']").val('');
        $("input[name='name_prod']").val('');
        $("#select_search_supplier").val('');
        $("#select_search_brand").val('');
        $( "#select_all" ).prop('checked', false);
        $('#display-table-product-search').addClass('d-none');
        $('#product-search-data-table tbody').empty();
    })

    //Table
    $( "#product-search-data-table #select_all" ).on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
    });

    function selectedProducts() {
        let data = [];
        $('#product-search-data-table tbody tr').each(function() {
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
    //Add products in view create sale
    $('#add-products').on('click', function() {
        let selected_products = selectedProducts();
        if (selected_products.length) {
            $("input[name='code_prod']").val(''),
            $("input[name='name_prod']").val(''),
            $("#select_search_supplier").val(''),
            $("#select_search_brand").val('')
            $('#product-search-data-table tbody').empty();
            $( "#select_all" ).prop('checked', false);
            $(document).trigger('listen-searchModal', {data: selected_products});

            $('#searchProduct').modal('hide');
        } else {
            $.alert({
                title: '',
                content: 'No hay productos seleccionados'
            });
        }
    });
})();