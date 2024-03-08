@extends('template.app') 
@section('content')
<section class="forms">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex align-items-center">
                        <h4>{{trans('file.Add Payment')}}</h4>
                    </div>
                    <div class="card-body">
                        {{-- <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p> --}}
                        {!! Form::open([ 'method' => 'get', 'files' => false, 'id' => 'payments-form']) !!}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-sm-2">
                                        <div class="form-group">
                                            <label><b>{{trans('file.Date')}}: </b></label>
                                            <label id="set_date"></label>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.account')}}</label>
                                            <select name="account_id" id="select_account" class="form-control form-select" data-live-search="true" data-live-search-style="begins">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.supplier')}}</label>
                                            <select name="supplier_id" id="select_supplier" class="form-control form-select" data-live-search="true" data-live-search-style="begins">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col mb-3">
                                        <label for=""></label>
                                        <input 
                                            type="button" 
                                            value="{{ trans('file.search purchase') }}" 
                                            id="open-search-purchase"
                                            class="btn btn-primary position-absolute bottom-0">
                                    </div>
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <h5>{{trans('file.Purchase List')}}</h5>
                                        <div class="table-responsive mt-3">
                                            <table id="purchase-detail-table" class="table table-hover order-list">
                                                <thead>
                                                    <tr>
                                                        <th>{{trans('file.date')}}</th>
                                                        <th>{{trans('file.supplier')}}</th>
                                                        <th>{{trans('file.total')}}</th>
                                                        <th>{{trans('file.charge_amount')}}</th>
                                                        <th><i class="dripicons-trash"></i></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot class="tfoot active">
                                                    <th colspan="2">{{trans('file.Total')}}</th>
                                                    <th id="total-purchase">0.00</th>
                                                    <th><i class="dripicons-trash"></i></th>
                                                    <th></th>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group float-right">
                                    <a href="{{route('payments.index')}}" class="btn btn-info">{{trans('file.back')}}</a>
                                    <button type="submit" class="btn btn-primary" id="save-charge">{{trans('file.Save')}}</button>
                                </div>
                            </div>
                        </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('payments.search-purchase')
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/payments/create.js') }}"></script>
@endsection