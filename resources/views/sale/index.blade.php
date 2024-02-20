@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid">
       
        <a href="{{ route('sales.create') }}" class="btn btn-info"><i class="dripicons-plus"></i> {{trans('file.add_sale')}}</a>&nbsp;
        <!-- <a href="" class="btn btn-primary"><i class="dripicons-copy"></i> {{trans('file.Import Purchase')}}</a> -->
       
    </div>
    <div class="table-responsive">
        <table id="purchase-table" class="table purchase-list" style="width: 100%">
            <thead>
                <tr>
                    <th class="not-exported"></th>
                    <th>{{trans('file.Date')}}</th>
                    <th>{{trans('file.customer')}}</th>
                    <th>{{trans('file.Total')}}</th>
                    <th>{{trans('file.Created By')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            
            <tfoot class="tfoot active">
                <th></th>
                <th>{{trans('file.Total')}}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tfoot>
        </table>
    </div>
</section>
@endsection