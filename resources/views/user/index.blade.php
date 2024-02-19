@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <a href="{{route('user.create')}}" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#createModal"><i class="dripicons-plus"></i> {{trans('file.Add User')}}</a>
        <a href="#" class="btn btn-danger delete_all_user"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
        <a href="#" class="btn btn-success active_all_user"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
        <a href="#" class="btn btn-warning desactive_all_user"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a>
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_search">
            <div class="row">
                <div class="col">
                    <label for="fisrt_name">{{__('file.name')}}</label>
                    <input type="text" class="form-control" placeholder="{{__('file.name')}}" name="first_name">
                </div>
                <div class="col">
                    <label for="last_name">{{trans('file.LastName')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.LastName')}}" name="last_name">
                </div>
                <div class="col">
                    <label for="email">Email</label>
                    <input type="text" class="form-control" placeholder="Email" name="email">
                </div>
                <div class="col">
                    <label for="last_name">{{ trans('file.Created By') }}</label>
                    <input type="text" class="form-control" placeholder="{{ trans('file.Created By') }}" name="user_created">
                </div>
            </div>
            <div class="row">
            <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.select_date')}}</label>
                        <select class="form-select  user-select-date" name="select_date">
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
                            <input type="text" name="date_range" id="date_range" class="form-control" />
                        </div>
                    </div>
                </div>
                <!-- <div class="col">
                    <div class="form-group">
                        <label>Fecha modificacion</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="date_update" id="date_update" class="form-control" />
                        </div>
                    </div>
                </div> -->
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.status')}}</label>
                        <select class="form-select" name="user_status">
                            <option selected value="">{{trans('file.all')}}</option>
                            <option value="1">{{trans('file.active')}}</option>
                            <option value="0">{{trans('file.inactive')}}</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data">{{ __('file.Filter') }}</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form_user">{{ __('file.Clear') }}</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">{{ __('file.Close') }}</button>
                </div>
            </div>
        </form>
    </div>
    <div class="table-responsive">
        <table id="user-table" class="table table-striped nowrap">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.UserName')}}</th>
                    <th>{{trans('file.UserLastName')}}</th>
                    <th>Imagen</th>
                    <th>{{trans('file.Email')}}</th>
                    <th>{{trans('file.Role')}}</th>
                    <th>{{trans('file.status')}}</th>
                    <th>{{trans('file.Created By')}}</th>
                    <th>{{trans('file.created_at')}}</th>
                    <th>{{trans('file.updated_at')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            <tbody>
               
            </tbody>
        </table>
    </div>
    @include('user.create')
    @include('user.edit')
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/brand/functions.js') }}"></script>
    <script src="{{ asset('js/modules/user/index.js') }}"></script>
@endsection