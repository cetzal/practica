(function(){
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

    $('#clear_form_search_purchase').on('click', function(event) {
        event.preventDefault();

        $("input[name='range_date']").val('');
        $( "#select_all" ).prop('checked', false);
        $('#table-purc-search tbody').empty();
        $('#table-purc-search').hide();
    });

    $("#seach-purchase").on('submit', function(e){
        e.preventDefault();
        var form_data = {
            supplier_id: $("input[name='supplier_id']").val(),
            range_date: $("input[name='range_date']").val()
        };

        $.get('/api/payments/modalPurchaseSearch', form_data)
            .done(function(response) {
                $('#table-purc-search tbody').empty();
                if (response.length) {
                    $('#table-purc-search').show();
                    $.each(response, function(index, row) {
                        let fila = $('<tr>')
                                    .attr('data-purchase-id', row.id);

                        fila.append('<td><div class="checkbox"><input type="checkbox" class="dt-checkboxes checked-purchase"><label></label></div></td>');
                        fila.append('<td>'+ row.purchase_date +'</td>');
                        fila.append('<td>'+ row.supplier_name +'</td>');
                        fila.append('<td>$ '+ row.total +'</td>');
                        fila.append('<td>$ '+ parseFloat(row.pid_amounts).toLocaleString('en-US', {minimumFractionDigits: 2}) +'</td>');
                        $('#table-purc-search tbody').append(fila);
                    }); 
                }else{
                    $('#table-purc-search').hide();
                    $.alert({
                        title : '',
                        content : 'No se encontraron compras'
                    })
                }
            });
    });

    $("#table-purc-search #select_all").on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
    });

    function selectedPurchase() {
        let data = [];
        $('#table-purc-search tbody tr').each(function() {
            let checked = $(this).find('.checked-purchase');
            let row = $(this).closest('tr');

            if(checked.prop('checked')) {
                data.push({
                    id: parseInt(row.data('purchase-id').toString()),
                    date: $(this).find('td:eq(1)').text(),
                    supplier_name: $(this).find('td:eq(2)').text(),
                    total: parseInt($(this).find('td:eq(3)').text().replace(/[^\d.-]/g, '')),
                    pid_amounts: parseInt($(this).find('td:eq(4)').text().replace(/[^\d.-]/g, '')),
                });
            }
        });
        
        return data;
    }
   
    $('#add-purchase').on('click', function() {
        let selected_purchase = selectedPurchase();
        if (selected_purchase.length) {
            $("input[name='range_date']").val('');
            $('#table-purc-search tbody').empty();
            $( "#select_all" ).prop('checked', false);
            $(document).trigger('listen-searchModalPurchase', {data: selected_purchase});
            $('.bt-close-modal').trigger('click');
        } else {
            $.alert({
                title: '',
                content: 'No hay ventas seleccionados'
            });
        }
    });
})();