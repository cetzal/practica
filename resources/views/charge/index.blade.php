@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2 p-1">
        <h4>{{trans('file.list_charges')}}</h4>
    </div>
    <div class="container-fluid mb-2 p-1">
        <a href="{{ route('charges.create') }}" class="btn btn-info"><i class="dripicons-plus"></i> {{trans('file.add_charge')}}</a>
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">  
        <form id="from_search_charge">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.account')}}</label>
                        <select name="account_id" id="select_account" class="form-control form-select" data-live-search="true" data-live-search-style="begins">
                        </select>
                    </div>
                </div>
                {{-- <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.client')}}</label>
                        <select name="client_id" id="select_client" class="form-control form-select" data-live-search="true" data-live-search-style="begins">
                        </select>
                    </div>
                </div> --}}
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
                    <button type="submit" class="btn btn-primary mt-4 filter_data">{{trans('file.filter')}}</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form">{{trans('file.clear')}}</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">{{trans('file.close')}}</button>
                </div>
            </div>
        </form>
    </div>
    <div class="table-responsive">
        <table id="charge-table" class="table charge-list" style="width: 100%">
            <thead>
                <tr>
                    <th>{{trans('file.account')}}</th>
                    {{-- <th>{{trans('file.customer')}}</th> --}}
                    <th>{{trans('file.date')}}</th>
                    <th>{{trans('file.charge_amount')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            
            <tfoot class="tfoot active">
                <th>{{trans('file.Total')}}</th>
                {{-- <th></th> --}}
                <th></th>
                <th></th>
                <th></th>
            </tfoot>
        </table>
    </div>
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/charge/index.js') }}"></script>
@endsection