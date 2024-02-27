<div id="serchModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="modal-header" class="modal-title">{{trans('file.search products')}}</h5>
                <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true"><i class="dripicons-cross"></i></span></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <form id="seach-purchase-product">
                        <input type="hidden" name="supplier_id">
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label>{{trans('file.Code')}}</label>
                                    <input type="text" name="code_prod" class="form-control">
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>{{trans('file.name')}}</label>
                                    <input type="text" name="name_prod" class="form-control">
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>{{trans('file.brands')}}</label>
                                    <select name="brand_id" class="selectpicker-suppliers form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select a supplier...">
                                        
                                    </select>
                                </div>
                            </div>
                            
                        
                        </div>
                        <div class="form-group float-right">       
                            <input type="submit" value="{{trans('file.filter')}}" id="submit-btn" class="btn btn-primary">
                            <button type="button" class="btn btn-primary">{{trans('file.clear')}}</button>

                        </div>
                    </form>
                </div>
                <div class="row">
                    <div class="col-md-12">                  
                        <div class="table-responsive mt-3">
                            <table id="table-prod-search" class="table table-hover order-list">
                                <thead>
                                    <tr>
                                        <th class="not-exported">
                                            <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                                        </th>
                                        <th>{{trans('file.Code')}}</th>
                                        <th>{{trans('file.name')}}</th>
                                        <th>{{trans('file.Quantity')}}</th>
                                        <th>{{trans('file.price')}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary bt-close-modal" data-bs-dismiss="modal">{{trans('file.close')}}</button>
                <input type="button" id="add-products" value="Agregar productos" class="btn btn-primary">
            </div>
        </div>
    </div>
</div>

@section('scripts')
  @parent
  <script src="{{ asset('js/modules/purchases/search.js') }}"></script>
@endsection