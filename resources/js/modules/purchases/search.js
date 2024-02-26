

(function(){
    var host = window.location.origin;
    function brandsBySupplier(supplier_id){
        var url = 'api/purchase/getBrandsBySupplierId/'+ supplier_id;
        $('select[name="brand_id"]').empty();
        $('select[name="brand_id"]').append('<option value="">Select a brand</option>');
        $.ajax({
            url: host +'/'+ url,
            type: "GET",
            dataType: "json",
            success:function(response) {
                if(response.length != 0){
                    $.each(response, function(index, row) {
                        $('select[name="brand_id"]').append('<option value=' + row.id + '>' + row.name + '</option>');
                    }); 
                }else{
                    $('select[name="brand_id"]').empty();
                    $('select[name="brand_id"]').append('<option value="">Sin marcas</option>');
                }
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
   
    $(document).ready(function() {
        $('#serchModal').on('show.bs.modal', function(event) {
            let supplier_id =  $("input[name='supplier_id']").val();
            brandsBySupplier(supplier_id);
          // Hacer algo con 'dato' en el modal
        });
    });

    
})();