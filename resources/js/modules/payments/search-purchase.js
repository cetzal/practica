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

    $("#seach-purchase").on('submit', function(e){
        e.preventDefault();
        var form_data = {
            supplier_id: $("input[name='supplier_id']").val(),
            range_date: $("input[name='range_date']").val()
        };

        $.get('/api/payments/modalProductSearch', form_data)
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
                    $('#table-prod-search').hide();
                    $.alert({
                        title : '',
                        content : 'No se encontraron productos'
                    })
                }
            });
    });


})();