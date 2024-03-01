(function() {
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
    
    $( "#from_search_purchase" ).on("submit", function( event ) {
        event.preventDefault();
        table.ajax.reload();
    });

    $('.show_form_search').on('click', function(e){
        e.preventDefault();
        $('.form_search').toggleClass('form_search_active');
    });

    $('.close_form').on('click', function(e){
        $('.form_search').removeClass('form_search_active');
    });

    /**Cargar los combos iniciales para los filtros */
    function loadSearchComboSuppliers() {
        let input = '.selectpicker-suppliers';
        let url = '/api/inventory/load/serach/suppliers';
        $(input).empty();

        $.get(url, function(response) {
            if (response.length) {
                
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }
    function loadSearchComboBrands() {
        let input = '.selectpicker-brands';
        let url = '/api/inventory/load/serach/brands';
        $(input).empty();
        $.get(url, function(response) {
            if (response.length) {
              
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function loadSearchComboClients() {
        let input = '#select_client';
        let url = '/api/inventory/load/search/clients';

        $.get(url, function(response) {
            if (response.length) {
                $(input).find('option').remove().end();
                $.each(response, function(index, row) {
                    $(input).append('<option value=' + row.id + '>' + row.name + '</option>');
                }); 
            }
        })
    }

    function searchBrandBySupplierId(){
        let supplier_id = $('select[name="supplier_id"]').val();
        let url = '/api/inventory/getbrandSearchById?supplier_id='+supplier_id;
        let input_brand = '.selectpicker-brands';
        $(input_brand).empty();
        if (supplier_id != '') {
           
            $.get(url, function(response) {
                if (response) {
                   
                    $.each(response, function(index, row) {
                        $(input_brand).append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }
            })
        }   
    }

    $('select[name="supplier_id"]').on('change', function(e) {
        e.preventDefault();
        let supplier_id = $(this).val();
        if (supplier_id == "") {
            loadSearchComboSuppliers();
            loadSearchComboBrands();
        } else {
            searchBrandBySupplierId();
        }
    });

    $('#select_type').on('change', function(e) {
        e.preventDefault();
        $('#select_client').attr('disabled', 'disabled');
        if ($(this).val() == "sale") {
            $('#select_client').removeAttr('disabled');
        }
    });

    $('.clear_form_inventory').on('click', function(e){
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboClients();
        $('#select_client').val('');
        $('#select_client').attr('disabled', 'disabled');
        $('#from_search_inventory')[0].reset();
        // $('#inventory-table').DataTable().ajax.reload();
    });

    /**End load combo search */

    $(document).ready(function() {
        $('#select_client').attr('disabled', 'disabled');
        loadSearchComboSuppliers();
        loadSearchComboBrands();
        loadSearchComboClients();
    });
})();