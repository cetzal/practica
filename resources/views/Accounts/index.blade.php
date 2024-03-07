@extends('template.app') 
@section('content')
<section>
<div class="container-fluid mb-2 p-1">
        <h4>{{trans('file.Account List')}}</h4>
    </div>
    <div class="container-fluid mb-2 p-1">
        <button class="btn btn-info open-modal-brand" data-bs-toggle="modal" data-bs-target="#createModal"><i class="dripicons-plus"></i> {{trans('file.Add Account')}} </button>&nbsp;
        <!-- <a href="#" class="btn btn-danger delete_all"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
        <a href="#" class="btn btn-success active_all"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
        <a href="#" class="btn btn-warning desactive_all"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a> -->
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_accounts_search">
            <div class="row">
                <div class="col">
                    <label for="name">{{trans('file.name')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.name')}}" name="name">
                </div>
                
                <div class="col">
                    <label for="created_by">{{trans('file.created_by')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.created_by')}}" name="created_by">
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.status')}}</label>
                        <select class="form-select" name="status">
                            <option selected value="">{{trans('file.all')}}</option>
                            <option value="1">{{trans('file.active')}}</option>
                            <option value="0">{{trans('file.inactive')}}</option>
                        </select>
                    </div>
                </div>
                
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.date')}}</label>
                        <select class="form-select brand-date-select" name="select_date">
                            <option selected value="">{{trans('file.select')}}</option>
                            <option value="created_at">{{trans('file.date_create')}}</option>
                            <option value="updated_at">{{trans('file.date_update')}}</option>
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
                            <input type="text" name="range_date" id="range_date" class="form-control" autocomplete="off" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        
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
        <table id="accounts-table" class="table table-striped nowrap" style="width:100%">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.name')}}</th>
                    <th>{{trans('file.Initial Balance')}}</th>
                    <th>{{trans('file.revenue')}}</th>
                    <th>{{trans('file.egress')}}</th>
                    <th>{{trans('file.Balance')}}</th>
                    <th>{{trans('file.status')}}</th>
                    <th>{{trans('file.created_by')}}</th>
                    <th>{{trans('file.created_at')}}</th>
                    <th>{{trans('file.updated_at')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            <tbody>
              
            </tbody>
        </table>
    </div>

    @include('Accounts.create')
    @include('Accounts.edit')
    
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/accounts/index.js') }}"></script>
    <script src="{{ asset('js/modules/accounts/create.js') }}"></script>
@endsection