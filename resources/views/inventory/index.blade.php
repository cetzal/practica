@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2 p-1">
        <h4>{{trans('file.inventory_list')}}</h4>
    </div>
    <div class="container-fluid mb-2 p-1">
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i><i class="fa fa-pencil" aria-hidden="true"></i></a>       
    </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_search_inventory">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>{{ trans('file.name') }}</label>
                        <input type="text" name="name_prod" class="form-control" placeholder="{{trans('file.Code')}}">
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label>{{ trans('file.Code') }}</label>
                        <input type="text" name="code_prod" class="form-control" placeholder="{{trans('file.name')}}">
                    </div>
                </div>
                
                <div class="col">
                    <label for="name">{{trans('file.supplier')}}</label>
                    <select name="supplier_id" class="form-select selectpicker-suppliers" data-live-search="true" data-live-search-style="begins" placeholder="{{trans('file.supplier')}}">
                            
                    </select>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{ trans('file.Brand') }} </label>
                        <div class="input-group">
                            <select name="brand_id" class="selectpicker-brands form-select" data-live-search="true" data-live-search-style="begins" title="Select Brand...">
                           
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.Type')}}</label>
                        <select name="type" id="select_type" class="form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                            <option value="">{{trans('file.All')}}</option>
                            <option value="purchase">{{trans('file.Purchase')}}</option>
                            <option value="sale">{{trans('file.Sale')}}</option>
                        </select>
                    </div>
                </div>
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
            </div>
            <div class="row float-right">
                <div class="col ">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data"> {{ trans('file.Filter') }}</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form_inventory">{{ trans('file.Clear') }}</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">{{ trans('file.Close') }}</button>
                </div> 
            </div>
           
        </form>
    </div>
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/inventory/index.js') }}"></script>
@endsection