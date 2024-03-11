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
                        <label>{{trans('file.status')}}</label>
                        <select name="status_id" id="select_status" class="form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
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
                    <th>{{trans('file.status')}}</th>
                    <th>{{trans('file.total')}} {{trans('file.Paid')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            <tfoot class="tfoot active">
                <th>{{trans('file.Total')}}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tfoot>
            
           
        </table>
    </div>
</section>




@endsection
@section('scripts')
    <script src="{{ asset('js/modules/purchases/index.js') }}"></script>
@endsection
