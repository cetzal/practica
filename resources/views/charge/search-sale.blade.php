<div id="searchSale" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
        <h5 id="exampleModalLabel" class="modal-title">{{trans('file.search_sales')}}</h5>
          <button type="button" class="close btn-close-modal" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
        </div>
        <div class="modal-body">
            <form name="form-search-product">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label>{{trans('file.client')}}</label>
                            <select name="client_id" id="select_search_client" class="form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                            </select>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label>{{trans('file.range_date')}}</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                                </div>
                                <input type="text" name="range_date" id="range_date" class="form-control" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row float-right mb-3">
                    <div class="col">
                        <label for=""></label>
                        <button type="button" id="filter_data" class="btn btn-primary"> {{ trans('file.Filter') }}</button>
                        <button type="button" id="clear_form_sale" class="btn btn-primary">{{ trans('file.Clear') }}</button>
                    </div>
                </div>
            </form>

            <div id="display-table-sale-search" class="table-responsive d-none">
                <table id="sale-search-data-table" class="table" style="width: 100%">
                    <thead>
                        <tr>
                            <th class="not-exported">
                                <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                            </th>
                            <th>{{trans('file.date')}}</th>
                            <th>{{trans('file.customer')}}</th>
                            <th>{{trans('file.total')}}</th>
                            <th>{{trans('file.balance_collected')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    
                </table>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary bt-close-modal" data-bs-dismiss="modal">{{trans('file.close')}}</button>
            <input type="button" id="add-sales" value="{{trans('file.add_sale')}}" class="btn btn-primary">
        </div>
      </div>
    </div>
</div>
@section('scripts')
    @parent
    <script src="{{ asset('js/modules/charge/search-sale.js') }}"></script>
@endsection