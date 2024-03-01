@extends('template.app') 
@section('content')
<section>

    <div class="container-fluid mb-2 p-1">
        <h4>{{trans('file.Purchase List')}}</h4>
    </div>
    <div class="container-fluid mb-2 p-1">
       
        <a href="{{ route('purchases.create') }}" class="btn btn-info"><i class="dripicons-plus"></i> {{trans('file.Add Purchase')}}</a>&nbsp;
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i><i class="fa fa-pencil" aria-hidden="true"></i></a>
       
    </div>
    <div class="alert alert-danger alert-dismissible text-center alert-stock" role="alert" style="display:none">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
            <div class="row">
                <div class="col">
                    <a href="#" id="show-product-dilay" class="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
                    {{trans('file.see_products_to_buy')}}
                    </a>
                </div>
            </div>
        </div> 
    <div class="container-fluid mb-2 form_search">
        <form id="from_search_purchase">
            <div class="row">
                <div class="col">
                    <label for="name">{{trans('file.supplier')}}</label>
                    <select name="supplier_id" class="form-select selectpicker-suppliers" data-live-search="true" data-live-search-style="begins" placeholder="{{trans('file.supplier')}}">        
                    </select>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.range_date')}}</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="range_date" id="range_date" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data"> {{ trans('file.Filter') }}</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form_purchases">{{ trans('file.Clear') }}</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">{{ trans('file.Close') }}</button>
                </div>
            </div>           
        </form>
    </div>
    <div class="table-responsive">
        <table id="purchase-table" class="table purchase-list" style="width: 100%">
            <thead>
                <tr>
                    <th>{{trans('file.Date')}}</th>
                    <th>{{trans('file.Supplier')}}</th>
                    <th>{{trans('file.Total')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            <tfoot class="tfoot active">
                <th>{{trans('file.Total')}}</th>
                <th></th>
                <th></th>
                <th></th>
            </tfoot>
            
           
        </table>
    </div>
</section>

<div id="purchase-details" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog">
      <div class="modal-content">
        <div class="container mt-3 pb-2 border-bottom">
            <div class="row">
                <div class="col-md-3">
                    <button id="print-btn" type="button" class="btn btn-default btn-sm d-print-none"><i class="dripicons-print"></i> {{trans('file.Print')}}</button>
                </div>
                <div class="col-md-6">
                    <h3 id="exampleModalLabel" class="modal-title text-center container-fluid"></h3>
                </div>
                <div class="col-md-3">
                    <button type="button" id="close-btn" data-dismiss="modal" aria-label="Close" class="close d-print-none"><span aria-hidden="true"><i class="dripicons-cross"></i></span></button>
                </div>
                <div class="col-md-12 text-center">
                    <i style="font-size: 15px;">{{trans('file.Purchase Details')}}</i>
                </div>
            </div>
        </div>
            <div id="purchase-content" class="modal-body"></div>
            <br>
            <table class="table table-bordered product-purchase-list">
                <thead>
                    <th>#</th>
                    <th>{{trans('file.product')}}</th>
                    <th>Qty</th>
                    <th>{{trans('file.Unit Cost')}}</th>
                    <th>{{trans('file.Tax')}}</th>
                    <th>{{trans('file.Discount')}}</th>
                    <th>{{trans('file.Subtotal')}}</th>
                </thead>
                <tbody>
                </tbody>
            </table>
            <div id="purchase-footer" class="modal-body"></div>
      </div>
    </div>
</div>


@endsection
@section('scripts')
    <script src="{{ asset('js/modules/purchases/index.js') }}"></script>
@endsection
