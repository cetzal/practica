@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <p>Module: {{$module_name}}</p>
        <p>Record: {{$record_name}}</p>
    </div>

    <div class="table-responsive">
        <table id="log-record-table" class="table" style="width:100%">
            <thead>
                <tr>
                    <th>Movement Type</th>
                    <th>User</th>
                    <th>Movement date</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
        </table>
    </div>
</section>
@endsection