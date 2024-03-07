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
})();