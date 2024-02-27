<div id="searchProduct" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
        <h5 id="exampleModalLabel" class="modal-title">{{trans('file.search_products')}}</h5>
          <button type="button" class="close btn-close-modal" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
        </div>
        <div class="modal-body">
            <form name="form-search-product">
                <div class="row">
                    <div class="col">
                        <label for="code_prod">{{trans('file.Code')}}</label>
                        <input type="text" class="form-control" placeholder="{{trans('file.Code')}}" name="code_prod">
                    </div>
                    <div class="col">
                        <label for="name_rod">{{trans('file.name')}}</label>
                        <input type="text" class="form-control" placeholder="{{trans('file.name')}}" name="name_prod">
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>{{trans('file.Supplier')}}</label>
                            <select name="supplier_id" id="select_search_supplier" class="form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                            </select>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>{{trans('file.brands')}}</label>
                            <select name="brand_id" id="select_search_brand" class="selectpicker form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                                <option value="">{{trans('file.select_non_branded')}}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row float-right mb-3">
                    <div class="col">
                        <label for=""></label>
                        <button type="button" id="filter_data" class="btn btn-primary"> {{ trans('file.Filter') }}</button>
                        <button type="button" id="clear_form_prod" class="btn btn-primary">{{ trans('file.Clear') }}</button>
                    </div>
                </div>
            </form>

            <div class="table-responsive">
                <table id="product-search-data-table" class="table" style="width: 100%">
                    <thead>
                        <tr>
                            <th class="not-exported">
                                <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                            </th>
                            <th>{{trans('file.Code')}}</th>
                            <th>{{trans('file.name')}}</th>
                            <th>{{trans('file.Quantity')}}</th>
                            <th>{{trans('file.Price')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    
                </table>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary bt-close-modal" data-bs-dismiss="modal">{{trans('file.close')}}</button>
            <input type="button" id="add-products" value="{{trans('file.add_products')}}" class="btn btn-primary">
        </div>
      </div>
    </div>
</div>
