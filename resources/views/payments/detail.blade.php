@extends('template.app') 
@section('content')
<div class="container-fluid mb-2 p-1">
    <h4>{{trans('file.payments detail')}}</h4>
</div>
<div class="container-fluid mb-2 p-1">
    <p><span><b>{{trans('file.date')}}</b>:</span>  {{$paid_date}}</p>
</div>
<div class="container-fluid mb-2 p-1">
    <div class="table-responsive">
        <table id="payments-detail-table" data-payments="{{$payments_id}}" class="table payments-list" style="width: 100%">
            <thead>
                <tr>
                    <th>{{trans('file.account')}}</th>
                    <th>{{trans('file.supplier')}}</th>
                    <th>{{trans('file.Paid')}}</th>
                </tr>
            </thead>
            
            <tfoot class="tfoot active">
                <th>{{trans('file.Total')}}</th>
                <th></th>
                <th></th>
            </tfoot>
        </table>
    </div>
</div>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/payments/detail.js') }}"></script>
@endsection