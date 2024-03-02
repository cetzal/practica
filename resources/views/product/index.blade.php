@extends('template.app') 
@section('content')
<br>
<section>
    <div class="container-fluid mb-2 p-1">
        <h4>{{trans('file.product_list')}}</h4>
    </div>
    <div class="container-fluid mb-2 p-1">
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
                    <label for="name">{{trans('file.supplier')}}</label>
                    <select name="supplier_id" class="form-select selectpicker-suppliers" data-live-search="true" data-live-search-style="begins" placeholder="{{trans('file.supplier')}}">
                            
                           
                    </select>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{ trans('file.Brand') }}</strong> </label>
                        <div class="input-group">
                            <select name="brand_prod" class="selectpicker-brands form-select" data-live-search="true" data-live-search-style="begins" title="Select Brand...">
                            
                           
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.category')}}</strong> </label>
                        <div class="input-group">
                            <select name="category_id" class="selectpicker form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select Category...">
                            @if(count($lims_product_category_list) > 0 )
                                <option value="">{{trans('file.search_product_select_category')}}</option>  
                            @else
                                <option value="">Without Category</option>
                            @endif
                            @foreach($lims_product_category_list as $category)
                                <option value="{{$category->category_id}}">{{$category->category_name}}</option>
                            @endforeach
                            </select>
                        </div>
                    </div>
                </div>
               
            </div>
            <div class="row">
                <div class="col">
                    <label for="last_name">{{trans('file.Created By')}}</label>
                    <input type="text" class="form-control" placeholder="{{trans('file.Created By')}}" name="user_created">
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>{{trans('file.select_date')}}</label>
                        <select class="form-select product-select-date" name="select_date">
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
                            <input type="text" name="date_range" id="date_range" class="form-control" autocomplete="off" />
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
                        <label>{{trans('file.status')}}</label>
                        <select class="form-select" name="prod_status">
                            <option selected value="">{{trans('file.all')}}</option>
                            <option value="1">{{trans('file.active')}}</option>
                            <option value="0">{{trans('file.inactive')}}</option>
                        </select>
                    </div>
                </div>
                
            </div>
            <div class="row float-right">
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
                    <th>{{trans('file.supplier')}}</th>
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

<div id="product-details" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">{{trans('Product Details')}}</h5>
          
          <button type="button" id="close-btn" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true"><i class="dripicons-cross"></i>x</span></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-5" id="slider-content"></div>
                <div class="col-md-5 offset-1" id="product-content"></div>
            </div>
        </div>
      </div>
    </div>
</div>
@endsection
@section('scripts')
    <script>
        // var current_language  = "{{ app()->getLocale() }}";
    </script>
    <script src="{{ asset('js/modules/product/index.js') }}"></script>
@endsection