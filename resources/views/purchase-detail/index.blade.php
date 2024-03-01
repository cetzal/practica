@extends('template.app') 
@section('content')
<div class="container-fluid mb-2 p-1">
    <h4>{{trans('file.Purchase Details')}}</h4>
</div>
<div class="container-fluid mb-2 p-1">
    <p><span><b>{{trans('file.date')}}</b>:</span>  {{$purchase_date}}</p>
    <p><span><b>{{trans('file.purchase_number')}}</b>: </span> {{$purchase_number}}</p>
    <p><span><b>{{trans('file.Supplier')}}</b>:</span> {{$supplier}}</p>
</div>
<div class="container-fluid mb-2 p-1">
    <div class="table-responsive">
        <table id="purchase-detail-table" data-purchase="{{$purchase_number}}" class="table purchase-list" style="width: 100%">
            <thead>
                <tr>
                    <th>{{trans('file.Code')}}</th>
                    <th>{{trans('file.Date')}}</th>
                    <th>{{trans('file.Brand')}}</th>
                    <th>{{trans('file.Items')}}</th>
                    <th>{{trans('file.Total')}}</th>
                </tr>
            </thead>
            <tfoot class="tfoot active">
                <th>{{trans('file.Total')}}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                
            </tfoot>
            
           
        </table>
    </div>
</div>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/purchase-detail/index.js') }}"></script>
@endsection