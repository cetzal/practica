@extends('template.app') 
@section('content')
<div class="container-fluid mb-2 p-1">
    <h4>{{trans('file.charge_detail')}}</h4>
</div>
<div class="container-fluid mb-2 p-1">
    <p><span><b>{{trans('file.date')}}</b>:</span>  {{$charge_date}}</p>
</div>
<div class="container-fluid mb-2 p-1">
    <div class="table-responsive">
        <table id="charge-detail-table" data-charge="{{$charge_id}}" class="table charge-list" style="width: 100%">
            <thead>
                <tr>
                    <th>{{trans('file.account')}}</th>
                    <th>{{trans('file.customer')}}</th>
                    <th>{{trans('file.charge_amount')}}</th>
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
    <script src="{{ asset('js/modules/charge/detail.js') }}"></script>
@endsection