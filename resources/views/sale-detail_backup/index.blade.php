@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2 p-1">
        <h4>{{trans('file.Sale List')}}</h4>
    </div>
    <div class="container-fluid mb-2 p-1">
        <a href="{{ route('sale-details.create') }}" class="btn btn-info"><i class="dripicons-plus"></i> {{trans('file.add_sale')}}</a>
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">  
        <form id="from_search_sale">
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
                    <label for="name">{{trans('file.supplier')}}</label>
                    <select name="supplier_id" id="select_supplier" class="form-select selectpicker-suppliers" data-live-search="true" data-live-search-style="begins" placeholder="{{trans('file.supplier')}}">
                    </select>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{ trans('file.Brand') }}</strong> </label>
                        <div class="input-group">
                            <select name="brand_id" id="select_brand" class="selectpicker-brands form-select" data-live-search="true" data-live-search-style="begins" title="Select Brand...">
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{ trans('file.products') }}</strong> </label>
                        <div class="input-group">
                            <select name="product_id" id="select_product" class="selectpicker-brands form-select" data-live-search="true" data-live-search-style="begins" title="Select Brand...">
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.client')}}</label>
                        <select name="client_id" id="select_client" class="form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
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
                            <input type="text" name="range_date" id="range_date" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data">{{trans('file.filter')}}</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form">{{trans('file.clear')}}</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">{{trans('file.close')}}</button>
                </div>
            </div>
        </form>
    </div>
    <div class="table-responsive">
        <table id="sale-table" class="table purchase-list" style="width: 100%">
            <thead>
                <tr>
                    <!-- <th class="not-exported"></th> -->
                    <th>{{trans('file.Date')}}</th>
                    <th>{{trans('file.customer')}}</th>
                    <th>{{trans('file.Code')}}</th>
                    <th>{{trans('file.product')}}</th>
                    <th>{{trans('file.Supplier')}}</th>
                    <th>{{trans('file.Brand')}}</th>
                    <th>{{trans('file.Items')}}</th>
                    <th>{{trans('file.Total')}}</th>
                    <!-- <th>{{trans('file.Created By')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th> -->
                </tr>
            </thead>
            
            <tfoot class="tfoot active">
                <!-- <th></th> -->
                <th>{{trans('file.Total')}}</th>
                <th></th>
                <th></th>
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
    <script src="{{ asset('js/modules/sale-detail/index.js') }}"></script>
@endsection