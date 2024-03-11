<div id="serchModalPurchase" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 id="modal-header" class="modal-title">{{trans('file.search purchase')}}</h5>
                <button type="button" class="close btn-close-modal" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <form id="seach-purchase">
                        <input type="hidden" name="supplier_id">
                        <div class="row">
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
                            <div class="col">
                               
                            </div>
                            <div class="col">
                                <div class="form-group mt-4">
                                    <label>&nbsp;</label>
                                    <input type="submit" value="{{trans('file.filter')}}" id="submit-btn" class="btn btn-primary">
                                    <button type="button" id="clear_form_search_purchase" class="btn btn-primary">{{trans('file.clear')}}</button>
                                </div>
                            </div>
                            
                        
                        </div>
                        <div class="form-group float-right">       
                        </div>
                    </form>
                </div>
                <div class="row">
                    <div class="col-md-12">                  
                        <div class="table-responsive mt-3">
                            <table id="table-purc-search" class="table table-hover" style="display: none;">
                                <thead>
                                    <tr>
                                        <th class="not-exported">
                                            <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                                        </th>
                                        <th>{{trans('file.date')}}</th>
                                        <th>{{trans('file.supplier')}}</th>
                                        <th>{{trans('file.total')}}</th>
                                        <th>{{trans('file.Amount')}} {{trans('file.Paid')}}</th>
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
                <input type="button" id="add-purchase" value=" {{ trans('file.Add Purchase') }}" class="btn btn-primary">
            </div>
        </div>
    </div>
</div>

@section('scripts')
  @parent
  <script src="{{ asset('js/modules/payments/search-purchase.js') }}"></script>
@endsection