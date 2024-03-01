@extends('template.app') 
@section('content')
<section class="forms">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex align-items-center">
                        <h4>{{trans('file.Add Purchase')}}</h4>
                    </div>
                    <div class="card-body">
                        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
                        {!! Form::open(['route' => 'purchase-details.index', 'method' => 'post', 'files' => true, 'id' => 'purchase-form']) !!}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row">
                                  
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.purchase date')}}</label>
                                            <input type="text" class="form-control" name="purchase_date" id="purchase_date" value="">
                                        </div>
                                    </div>
                                  
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.Supplier')}}</label>
                                            <select name="supplier_id" class="selectpicker-suppliers form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select a supplier...">
                                               
                                            </select>
                                        </div>
                                    </div>
                                   
                                    <div class="col">
                                        <button class="btn btn-primary mt-4" id="open-search-product">{{ trans('file.search products') }}</button>
                                    </div>
                                </div>
                                <div class="row">  
                                    
                                    <!-- <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.brands')}}</label>
                                            <select name="brand_id" class="selectpicker form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select a brand...">
                                                <option value="">Without brands</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <label>{{trans('file.Select Product')}}</label>
                                        <div class="search-box input-group">
                                            <select name="product_id" class="selectpicker form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select a product...">
                                                <option value="">Without products</option>
                                            </select>
                                            
                                        </div>
                                    </div> -->
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <h5>{{trans('file.Order Table')}} *</h5>
                                        <div class="table-responsive mt-3">
                                            <table id="myTable" class="table table-hover order-list">
                                                <thead>
                                                    <tr>
                                                        <th>{{trans('file.name')}}</th>
                                                        <th>{{trans('file.Code')}}</th>
                                                        <th>{{trans('file.Quantity')}}</th>
                                                        <th>{{trans('file.Unit Price')}}</th>
                                                        <th>Sub total</th>
                                                        <th><i class="dripicons-trash"></i></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot class="tfoot active">
                                                    <th colspan="2">{{trans('file.Total')}}</th>
                                                    <th id="total-qty">0</th>
                                                    <th></th>
                                                    <th id="total">0.00</th>
                                                    <th><i class="dripicons-trash"></i></th>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <input type="hidden" name="total_qty" />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <input type="hidden" name="total_cost" />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <input type="hidden" name="item" />
                
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                           
                                        </div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    
                                    
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>{{trans('file.Note')}}</label>
                                            <textarea rows="5" class="form-control" name="note"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="float-right">
                                        <a href="{{route('purchase-details.index')}}" class="btn btn-info">{{trans('file.back')}}</a>
                                        <button type="submit" class="btn btn-primary" id="submit-btn">{{trans('file.Save')}}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('purchase-detail.search')
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/purchase-detail/create.js') }}"></script>
@endsection