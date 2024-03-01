@extends('template.app') 
@section('content')
<div class="container-fluid mb-2 p-1">
    <h4>{{trans('file.sale_detail')}}</h4>
</div>
<div class="container-fluid mb-2 p-1">
    <p><span><b>{{trans('file.date')}}</b>:</span>  {{$sale_date}}</p>
    <p><span><b>{{trans('file.customer')}}</b>:</span> {{$client}}</p>
</div>
<div class="container-fluid mb-2 p-1">
    <div class="table-responsive">
        <table id="sale-detail-table" data-sale="{{$sale_id}}" class="table sale-list" style="width: 100%">
            <thead>
                <tr>
                    <th>{{trans('file.Code')}}</th>
                    <th>{{trans('file.product')}}</th>
                    <th>{{trans('file.Supplier')}}</th>
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
                <th></th>
            </tfoot>
        </table>
    </div>
</div>

@endsection
@section('scripts')
    <script src="{{ asset('js/modules/sale-detail/index.js') }}"></script>
@endsection