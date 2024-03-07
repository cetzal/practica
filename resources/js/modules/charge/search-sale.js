(function (){
    $( "#range_date" ).daterangepicker({
        maxDate : moment().endOf(),
        showApplyButton: false,
        autoApply: true,
        showInputs: false,
        locale: {
            format: 'DD/MM/YYYY'
        },
        todayHighlight: true,
        autoUpdateInput: false,
    });

    $('input[name="range_date"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });

    $('input[name="range_date"]').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    function loadSearchSaleComboClients() {
        let input = '#select_search_client';
        let url = '/api/charges/load/search-sales/clients';

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
        console.log('load clientes by sales');
        loadSearchSaleComboClients();
    });

   
    $('#filter_data').on('click', function(event) {
        event.preventDefault();

        var form_data = {
            client_id: $("#select_search_client").val(),
            range_date: $("#range_date").val()
        };

        $.get('/api/charges/modalSaleSearch', form_data)
            .done(function(response) {
                $('#sale-search-data-table tbody').empty();
                $('#display-table-sale-search').removeClass('d-none');
                if (response.length) {
                    console.log('sales find', response);
                    $.each(response, function(index, row) {
                        let fila = $('<tr>').attr('data-sale-id', row.id);

                        fila.append('<td><div class="checkbox"><input type="checkbox" class="dt-checkboxes checked-sale"><label></label></div></td>');
                        fila.append('<td>'+ moment(row.sale_date, 'YYYY-MM-DD').format('DD/MM/YYYY') +'</td>');
                        fila.append('<td>'+ row.client_name +'</td>');
                        fila.append('<td>$ '+ parseFloat(row.total).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                        fila.append('<td>$ '+ parseFloat(row.total_charged).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                        $('#sale-search-data-table tbody').append(fila);
                    }); 
                } else if (response.length == 0) {
                    $('#display-table-sale-search').addClass('d-none');
                }
            });
    });

    $('#clear_form_sale').on('click', function(event) {
        event.preventDefault();
        loadSearchSaleComboClients
        $("#select_search_client").val('');
        $("input[name='range_date']").val('');
        $( "#select_all" ).prop('checked', false);
        $('#display-table-sale-search').addClass('d-none');
        $('#sale-search-data-table tbody').empty();
    });


    $("#sale-search-data-table #select_all").on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
    });

    function selectedSales() {
        let data = [];
        $('#sale-search-data-table tbody tr').each(function() {
            let checked = $(this).find('.checked-sale');
            let row = $(this).closest('tr');

            if(checked.prop('checked')) {
                data.push({
                    id: parseInt(row.data('sale-id').toString()),
                    date: $(this).find('td:eq(1)').text(),
                    client_name: $(this).find('td:eq(2)').text(),
                    total: parseInt($(this).find('td:eq(3)').text().replace(/[^\d.-]/g, '')),
                    balance_receivable: parseInt($(this).find('td:eq(4)').text().replace(/[^\d.-]/g, '')),
                });
            }
        });
        
        return data;
    }
    //Add ventas in view charge
    $('#add-sales').on('click', function() {
        let selected_sales = selectedSales();
        if (selected_sales.length) {
            $("input[name='code_prod']").val(''),
            $("input[name='name_prod']").val(''),
            $("#select_search_supplier").val(''),
            $("#select_search_brand").val('')
            $('#sale-search-data-table tbody').empty();
            $( "#select_all" ).prop('checked', false);
            $(document).trigger('listen-searchModalSale', {data: selected_sales});
            $('#searchSale').modal('hide');
        } else {
            $.alert({
                title: '',
                content: 'No hay ventas seleccionados'
            });
        }
    });
})();