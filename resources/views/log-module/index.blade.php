@extends('template.app') 
@section('content')
<section>
    <div class="container-fluid mb-2">
        <a href="#" class="btn btn-primary show_form_search"><i class="fa fa-search" aria-hidden="true"></i><i class="fa fa-pencil" aria-hidden="true"></i></a>
    </div>
    <div class="container-fluid mb-2 form_search_log">
        <form id="from_search_log">
            <div class="row">
                <div class="col">
                    <label for="code_prod">Module</label>
                    <input type="text" class="form-control" placeholder="Module" name="search_module">
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Movement type</label>
                        <select class="form-select" name="select_movement">
                            <option selected value="">Seleccione</option>
                            <option value="Creacion">Creacion</option>
                            <option value="Actualizacion">Actualizacion</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Rango fecha</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                            </div>
                            <input type="text" name="range_date" id="range_date" class="form-control" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for="last_name">Usuario alta</label>
                    <input type="text" class="form-control" placeholder="User" name="user_created">
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
        <table id="log-data-table" class="table" style="width:100%">
            <thead>
                <tr>
                    <th>{{trans('file.module')}}</th>
                    <th>{{trans('file.movement_type')}}</th>
                    <th>{{trans('file.User')}}</th>
                    <th>Movement date</th>
                    <th class="not-exported">{{trans('file.action')}}</th>
                </tr>
            </thead>
            
        </table>
    </div>

    @include('log-module.detail')
</section>
@endsection
@section('scripts')
<script type="text/javascript">
    
</script>
@endsection