@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <p>{{trans('file.record')}}: {{$record_name}}</p>
    </div>
    <div class="container-fluid mb-2">
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i><i class="fa fa-pencil" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">
        <form id="form_serach_log_record">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.movement_type')}}</strong> </label>
                        <div class="input-group">
                            <select name="movement_type_id" class="selectpicker form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select Movement type...">
                            <option value="">{{trans('file.select_movement')}}</option>  
                            @foreach($movement_types_list as $movement_type)
                                <option value="{{$movement_type->id}}">{{$movement_type->name}}</option>
                            @endforeach
                            </select>
                        </div>
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
                    <label for="last_name">{{trans('file.Created By')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.created_by')}}" name="user_created">
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data">{{trans('file.filter')}}</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form">{{trans('file.active')}}</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">{{trans('file.inactive')}}</button>
                </div>
            </div>
        </form>
    </div>

    <div class="table-responsive">
        <table id="log-record-table" data-record-id="{{$record_id}}" data-module-name="{{$module_name}}" class="table" style="width:100%">
            <thead>
                <tr>
                    <th>{{trans('file.movement_type')}}</th>
                    <th>{{trans('file.User')}}</th>
                    <th>{{trans('file.movement_date')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
        </table>
    </div>

    @include('log-record.detail')
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/log-record/index.js') }}"></script>
@endsection
