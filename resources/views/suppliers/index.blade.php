@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#createModal"><i class="dripicons-plus"></i> {{trans('file.add_supplier')}} </button>&nbsp;
        <a href="#" class="btn btn-danger delete_all"><i class="dripicons-plus"></i> {{__('file.delete_all')}}</a>
        <a href="#" class="btn btn-success active_all"><i class="dripicons-plus"></i> {{__('file.active_all')}}</a>
        <a href="#" class="btn btn-warning desactive_all"><i class="dripicons-plus"></i> {{__('file.desactive_all')}}</a>
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search">
        <form id="from_search_supplier">
            <div class="row">
                <div class="col">
                    <label for="name">{{trans('file.name')}}</label>
                    <input type="text" class="form-control" placeholder="Supplier name" name="supplier_name">
                </div>
                <div class="col">
                    <label for="created_by">{{trans('file.created_by')}}</label>
                    <input type="text" class="form-control" placeholder="Created by" name="created_by">
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.status')}}</label>
                        <select class="form-select" name="status">
                            <option selected value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
                
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.date')}}</label>
                        <select class="form-select brand-date-select" name="select_date">
                            <option selected value="">Seleccione</option>
                            <option value="created_at">Fecha creacion</option>
                            <option value="updated_at">Fecha actualizacion</option>
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
                            <input type="text" name="range_date" id="range_date" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label for=""></label>
                    <button type="submit" class="btn btn-primary mt-4 filter_data">Filter</button>
                    <button type="button" class="btn btn-primary mt-4 clear_form">Clear</button>
                    <button type="button" class="btn btn-primary mt-4 close_form">Close</button>
                </div>
            </div>
        </form>
    </div>
    <div class="table-responsive">
        <table id="supplier-table" class="table table-striped nowrap" style="width:100%">
            <thead>
                <tr>
                    <th class="not-exported">
                        <div class="checkbox"><input type="checkbox" class="dt-checkboxes" id="select_all"><label></label></div>
                    </th>
                    <th>{{trans('file.supplier')}}</th>
                    <th>{{trans('file.total_brands')}}</th>
                    <th>{{trans('file.Status')}}</th>
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

    @include('suppliers.create')
    @include('suppliers.edit')
</section>

@endsection
@section('scripts')
    <script src="{{ asset('js/modules/supplier/index.js') }}"></script>
@endsection