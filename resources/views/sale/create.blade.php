@extends('template.app') 
@section('content')
<section class="forms">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex align-items-center">
                        <h4>{{trans('file.Add Sale')}}</h4>
                    </div>
                    <div class="card-body">
                        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
                        {!! Form::open(['route' => ['api.product.show', 'id' => 0], 'method' => 'get', 'files' => true, 'id' => 'sale-form']) !!}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.Date')}}</label>
                                            <input type="text" class="form-control" name="sale_date" id="sale_date" readonly>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.customer')}}</label>
                                            <select name="client_id" class="form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                                                <option value="">{{trans('file.select_client')}}</option>
                                                @foreach($lims_clients_list as $client)
                                                    <option value="{{$client->id}}">{{$client->name}}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.Supplier')}}</label>
                                            <select name="supplier_id" id="select_supplier" class="form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                                            <option value="">{{trans('file.select_supplier')}}</option>
                                                @foreach($lims_suppliers_list as $supplier)
                                                    <option value="{{$supplier->id}}">{{$supplier->name}}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.brands')}}</label>
                                            <select name="brand_id" id="select_brand" class="selectpicker form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                                                <option value="">{{trans('file.select_non_branded')}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">  
                                   
                                    <div class="col-md-3">
                                        <label>{{trans('file.Select Product')}}</label>
                                        <div class="search-box input-group">
                                            <select name="product_id" id="select_product" class="selectpicker form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select supplier...">
                                            <option value="">{{trans('file.select_without_products')}}</option>
                                        </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <input type="button" value="{{trans('file.add')}}" id="add-product" class="btn btn-primary position-absolute bottom-0">
                                    </div>
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-12">
                                        <h5>Tabla de productos *</h5>
                                        <div class="table-responsive mt-3">
                                            <table id="product-detail-table" class="table table-hover order-list">
                                                <thead>
                                                    <tr>
                                                        <th>{{trans('file.Code')}}</th>
                                                        <th>{{trans('file.name')}}</th>
                                                        <th>{{trans('file.Quantity')}}</th>
                                                        <th class="recieved-product-qty d-none">{{trans('file.Recieved')}}</th>
                                                        <th>{{trans('file.unit_cost')}}</th>
                                                        <th>{{trans('file.total')}}</th>
                                                        <th><i class="dripicons-trash"></i></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                                <tfoot class="tfoot active">
                                                    <th colspan="2">{{trans('file.Total')}}</th>
                                                    <th id="total-quantity">0</th>
                                                    <th class="recieved-product-qty d-none"></th>
                                                    <th id="total-subtotal">0.00</th>
                                                    <th id="total-sale">0.00</th>
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
                                            <input type="hidden" name="total_discount" />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <input type="hidden" name="total_tax" />
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
                                            <input type="hidden" name="order_tax" />
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <input type="hidden" name="grand_total" />
                                            <input type="hidden" name="paid_amount" value="0.00" />
                                            <input type="hidden" name="payment_status" value="1" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>{{trans('file.Note')}}</label>
                                            <textarea rows="5" class="form-control" name="note"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group float-right">
                                    <button type="button" class="btn btn-primary" id="save-sale">{{trans('file.submit')}}</button>
                                </div>
                            </div>
                        </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/sale/create.js') }}"></script>
@endsection