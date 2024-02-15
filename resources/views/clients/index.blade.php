@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
            <a href="{{route('products.create')}}" class="btn btn-info"><i class="dripicons-plus"></i> {{__('file.add_product')}}</a>
            <a href="#" class="btn btn-danger delete_all_prod"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
            <a href="#" class="btn btn-success active_all_prod"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
            <a href="#" class="btn btn-warning desactive_all_prod"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a>
            <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i><i class="fa fa-pencil" aria-hidden="true"></i></a>
        </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_search_prod">
            <div class="row">
                <div class="col">
                    <label for="code_prod">{{trans('file.Code')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.Code')}}" name="code_prod">
                </div>
                <div class="col">
                    <label for="name_rod">{{trans('file.name')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.name')}}" name="name_prod">
                </div>
                <div class="col">
                    <label for="last_name">{{trans('file.Created By')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.Created By')}}" name="user_created">
                </div>
            </div>
            <div class="row">
            <div class="col">
                    <div class="form-group">
                        <label>Select Date</label>
                        <select class="form-select product-select-date" name="select_date">
                            <option selected value="">Seleccione</option>
                            <option value="created_at">Fecha creacion</option>
                            <option value="updated_at">Fecha actualizacion</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Range Date</label>
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
                        <label>Fecha alta</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="date_create" id="date_create" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="col">
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
                        <label>Status</label>
                        <select class="form-select" name="prod_status">
                            <option selected value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data"> {{ trans('file.Filter') }}</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form_prod">{{ trans('file.Clear') }}</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">{{ trans('file.Close') }}</button>
                </div>
            </div>
        </form>
    </div>
    <div class="table-responsive">
        <table id="product-data-table" class="table" style="width: 100%">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.Image')}}</th>
                    <th>{{trans('file.name')}}</th>
                    <th>{{trans('file.Code')}}</th>
                    <th>{{trans('file.Brand')}}</th>
                    <th>{{trans('file.category')}}</th>
                    <th>{{trans('file.Quantity')}}</th>
                    <th>{{trans('file.Unit')}}</th>
                    <th>{{trans('file.Price')}}</th>
                    <th>{{trans('file.status')}}</th>
                    <th>{{trans('file.created_at')}}</th>
                    <th>{{trans('file.updated_at')}}</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            
        </table>
    </div>
</section>
@endsection