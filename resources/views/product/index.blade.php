@extends('template.app') 
@section('content')
<br>
<section>
    <div class="container-fluid">
            <a href="{{route('products.create')}}" class="btn btn-info"><i class="dripicons-plus"></i> {{__('file.add_product')}}</a>
            <a href="#" class="btn btn-primary delete_all"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
            <a href="#" class="btn btn-primary active_all"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
            <a href="#" class="btn btn-primary desactive_all"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a>
    </div>
    <div class="table-responsive">
        <table id="product-data-table" class="table" style="width: 100%">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.Image')}}</th>
                    <th>{{trans('file.name')}}</th>
                    <th>{{trans('file.Code')}}</th>
                    <th>{{trans('file.Brand')}}</th>
                    <th>{{trans('file.category')}}</th>
                    <th>{{trans('file.Quantity')}}</th>
                    <th>{{trans('file.Unit')}}</th>
                    <th>{{trans('file.Price')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            
        </table>
    </div>
</section>

<div id="product-details" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">{{trans('Product Details')}}</h5>
          
          <button type="button" id="close-btn" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true"><i class="dripicons-cross"></i>x</span></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-5" id="slider-content"></div>
                <div class="col-md-5 offset-1" id="product-content"></div>
            </div>
        </div>
      </div>
    </div>
</div>
@endsection
@section('scripts')
<script>
    var qty = [];
    var htmltext;
    var slidertext;
    var product_id = [];
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    product_id.length = 0;
    $(".delete_all").on('click', function(e){
        if(product_id.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.product.all_delete")}}',
                data:{
                    productIdArray: product_id
                },
                success:function(data){
                    $.confirm({
                        title: 'Eliminat productos',
                        content: 'se elimino todo los productos selecionados ',
                    });
                    $('#product-data-table').DataTable().ajax().reload();
                }
            });
        }else{
            $.confirm({
                title: 'Eliminat productos',
                content: 'Selecciiones los productos que deseas eliminar',
            });
        }
    });
    $(".active_all").on('click', function(e){
        if(product_id.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.product.all_active")}}',
                data:{
                    productIdArray: product_id
                },
                success:function(data){
                    $.confirm({
                        title: 'Activar productos',
                        content: 'se activado todo los productos selecionados ',
                    });
                    $('#product-data-table').DataTable().ajax().reload();
                }
            });
        }else{
            $.confirm({
                title: 'Activar productos',
                content: 'Selecciiones los productos que deseas activar',
            });
        }
    });
    $(".desactive_all").on('click', function(e){
        if(product_id.length) {
            $.ajax({
                type:'PUT',
                url:'{{route("api.product.all_active")}}',
                data:{
                    productIdArray: product_id
                },
                success:function(data){
                    $.confirm({
                        title: 'Desactiva productos',
                        content: 'Se desactivo todo los productos selecionados ',
                    });
                    $('#product-data-table').DataTable().ajax().reload();
                }
            });
        }else{
            $.confirm({
                title: 'Desactivar productos',
                content: 'Selecciiones los productos que deseas desactivar',
            });
        }
    });

    $( "#select_all" ).on("change", function() {
        if ($(this).is(':checked')) {
            $("tbody input[type='checkbox']").prop('checked', true);
        } 
        else {
            $("tbody input[type='checkbox']").prop('checked', false);
        }
        product_id = [];
        verific_checks(0);
    });

    $('#product-data-table').on('click', "tbody input[type='checkbox']", function(e) {
        if (!$(this).is(":checked")) { //If the checkbox is checked
            product_id = [];
        }
        verific_checks(1);
        
    });

    var verific_checks = function(num){
        $(':checkbox:checked').each(function(i){
            i+=num;
            if(i){
                var product_data = $(this).closest('tr').data('product');
                console.log(product_data);
                product_id[i-1] = product_data[12];
            }
        });
    }



    $(document).on("click", "tr.product-link td:not(:first-child, :last-child)", function() {
        productDetails( $(this).parent().data('product'), $(this).parent().data('imagedata') );        
    });

    $(document).on("click", ".view", function(){
        var product = $(this).parent().parent().parent().parent().parent().data('product');
        var imagedata = $(this).parent().parent().parent().parent().parent().data('imagedata');
        productDetails(product, imagedata);
    });

    $('#product-data-table').on('click', '.remove', function() {
        var url = "{{route('api.product.destroy', [':id'])}}";
        var id = $(this).data('id').toString();
        // url = url.concat(id).concat("/delete");
        url = url.replace(':id', id);
        var Jquery = $.Jquery;
       
        $.confirm({
            title: 'Eliminar producto?',
            content: 'Realmente quieres eliminar el producto',
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteUser: {
                    text: 'Eliminar producto',
                    action: function () {
                        $.ajax({
                            url: url,
                            type: 'DELETE',
                            success: function(response) {
                                $.confirm({
                                    title: response.status,
                                    content: response.message,
                                });
                                $('#product-data-table').DataTable().ajax.reload();
                            }
                        });
                    }
                },
                cancelAction: function () {
                    // $.alert('action is canceled');
                }
            }
        });

    });

    function productDetails(product, imagedata) {
        product[11] = product[11].replace(/@/g, '"');
        htmltext = slidertext = '';

        htmltext = '<p><strong>{{trans("file.Type")}}: </strong>'+product[0]+'</p><p><strong>{{trans("file.name")}}: </strong>'+product[1]+'</p><p><strong>{{trans("file.Code")}}: </strong>'+product[2]+ '</p><p><strong>{{trans("file.Brand")}}: </strong>'+product[3]+'</p><p><strong>{{trans("file.category")}}: </strong>'+product[4]+'</p><p><strong>{{trans("file.Quantity")}}: </strong>'+product[16]+'</p><p><strong>{{trans("file.Unit")}}: </strong>'+product[5]+'</p><p><strong>{{trans("file.Cost")}}: </strong>'+product[6]+'</p><p><strong>{{trans("file.Price")}}: </strong>'+product[7]+'</p><p><strong>{{trans("file.Tax")}}: </strong>'+product[8]+'</p><p><strong>{{trans("file.Tax Method")}} : </strong>'+product[9]+'</p><p><strong>{{trans("file.Alert Quantity")}} : </strong>'+product[10]+'</p><p><strong>{{trans("file.Product Details")}}: </strong></p>'+product[11];

        if(product[17]) {
            var product_image = product[17].split(",");
            if(product_image.length > 1) {
                slidertext = '<div id="product-img-slider" class="carousel slide" data-ride="carousel"><div class="carousel-inner">';
                for (var i = 0; i < product_image.length; i++) {
                    if(!i)
                        slidertext += '<div class="carousel-item active"><img src="public/images/product/'+product_image[i]+'" height="300" width="100%"></div>';
                    else
                        slidertext += '<div class="carousel-item"><img src="public/images/product/'+product_image[i]+'" height="300" width="100%"></div>';
                }
                slidertext += '</div><a class="carousel-control-prev" href="#product-img-slider" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="carousel-control-next" href="#product-img-slider" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>';
            }
            else {
                slidertext = '<img src="public/images/product/'+product[17]+'" height="300" width="100%">';
            }
        }
        
        $('#product-content').html(htmltext);
        $('#slider-content').html(slidertext);
        $('#product-details').modal('show');
        $('#product-img-slider').carousel(0);
    }

    $(document).ready(function() {
        var table = $('#product-data-table').DataTable( {
            responsive: true,
            fixedHeader: {
                header: true,
                footer: true
            },
            "processing": true,
            "serverSide": true,
            "ajax":{
                url:"{{route('api.product.list')}}",
                data:{},
                dataType: "json",
                type:"GET"
            },
            "createdRow": function( row, data, dataIndex ) {
                $(row).addClass('product-link');
                $(row).attr('data-product', data['product']);
                $(row).attr('data-imagedata', data['imagedata']);
            },
            "columns": [
                {"data": "id"},
                {"data": "image"},
                {"data": "name"},
                {"data": "code"},
                {"data": "brand"},
                {"data": "category"},
                {"data": "qty"},
                {"data": "unit"},
                {"data": "price"},
                {"data": "options"},
            ],
            'language': {
                
                'lengthMenu': '_MENU_ {{trans("file.records per page")}}',
                 "info":      '<small>{{trans("file.Showing")}} _START_ - _END_ (_TOTAL_)</small>',
                "search":  '{{trans("file.Search")}}',
                'paginate': {
                        'previous': '<i class="dripicons-chevron-left"></i>',
                        'next': '<i class="dripicons-chevron-right"></i>'
                }
            },
            order:[['2', 'asc']],
            'columnDefs': [
                {
                    "orderable": false,
                    'targets': [0, 1, 9]
                },
                {
                    'render': function(data, type, row, meta){
                        if(type === 'display'){
                            data = '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>';
                        }

                       return data;
                    },
                    'checkboxes': {
                       'selectRow': true,
                       'selectAllRender': '<div class="checkbox"><input type="checkbox" class="dt-checkboxes"><label></label></div>'
                    },
                    'targets': [0]
                }
            ],
            'select': { style: 'multi', selector: 'td:first-child'},
            'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, "All"]],
            
        } );

    } );

    // $('select').selectpicker();

</script>
@endsection