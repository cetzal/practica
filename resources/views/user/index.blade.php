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
                    <label for="fisrt_name"> First name</label>
                    <input type="text" class="form-control" placeholder="First name" name="first_name">
                </div>
                <div class="col">
                    <label for="last_name">Last name</label>
                    <input type="text" class="form-control" placeholder="Last name" name="last_name">
                </div>
                <div class="col">
                    <label for="email">Email</label>
                    <input type="text" class="form-control" placeholder="Email" name="email">
                </div>
                <div class="col">
                    <label for="last_name">Usuario alta</label>
                    <input type="text" class="form-control" placeholder="User" name="user_created">
                </div>
            </div>
            <div class="row">
            <div class="col">
                    <div class="form-group">
                        <label>Seleccione fecha</label>
                        <select class="form-select  user-select-date" name="select_date">
                            <option selected value="">Seleccione</option>
                            <option value="created_at">Fecha creacion</option>
                            <option value="updated_at">Fecha actualizacion</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Fecha inicio y fin</label>
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
                        <label>status</label>
                        <select class="form-select" name="user_status">
                            <option selected value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data">Filtrar</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form_user">Limpiar</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">Close</button>
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
                    <th>{{trans('file.Status')}}</th>
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
<script type="text/javascript">

</script>
@endsection