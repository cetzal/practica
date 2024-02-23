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
                        {!! Form::open(['route' => 'purchases.index', 'method' => 'post', 'files' => true, 'id' => 'purchase-form']) !!}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.Reference No')}}</label>
                                            <input type="text" class="form-control" name="reference_no" value="pr-{{date('Ymd')}}-{{date('his')}}">
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.purchase date')}}</label>
                                            <input type="text" class="form-control" name="purchase_date" id="purchase_date" value="">
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.Purchase Status')}}</label>
                                            <select name="status" class="form-control">
                                                <option value="">{{ trans('file.select') }}</option>
                                                <option value="1">{{trans('file.Recieved')}}</option>
                                                
                                            </select>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="row">  
                                    <div class="col">
                                        <div class="form-group">
                                            <label>{{trans('file.Supplier')}}</label>
                                            <select name="supplier_id" class="selectpicker-suppliers form-control form-select" data-live-search="true" data-live-search-style="begins" title="Select a supplier...">
                                               
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col">
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
                                            <!-- <button class="btn btn-secondary"><i class="fa fa-barcode"></i></button>
                                            <input type="text" name="product_code_name" id="productcodeSearch" placeholder="Please type product code and select..." class="form-control" /> -->
                                        </div>
                                    </div>
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
                                        <a href="{{route('purchases.index')}}" class="btn btn-info">Atras</a>
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
    <div class="container-fluid">
        
    </div>
    <div id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-header" class="modal-title"></h5>
                    <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true"><i class="dripicons-cross"></i></span></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label>{{trans('file.Quantity')}}</label>
                            <input type="number" name="edit_qty" class="form-control" step="any">
                        </div>
                        <div class="form-group">
                            <label>{{trans('file.Unit Discount')}}</label>
                            <input type="number" name="edit_discount" class="form-control" step="any">
                        </div>
                        <div class="form-group">
                            <label>{{trans('file.Unit Cost')}}</label>
                            <input type="number" name="edit_unit_cost" class="form-control" step="any">
                        </div>
                        <?php
                // $tax_name_all[] = 'No Tax';
                // $tax_rate_all[] = 0;
                // foreach($lims_tax_list as $tax) {
                //     $tax_name_all[] = $tax->name;
                //     $tax_rate_all[] = $tax->rate;
                // }
            ?>
                            <div class="form-group">
                                <label>{{trans('file.Tax Rate')}}</label>
                                <select name="edit_tax_rate" class="form-control selectpicker">
                                   
                                </select>
                            </div>
                            <div class="form-group">
                                <label>{{trans('file.Product Unit')}}</label>
                                <select name="edit_unit" class="form-control selectpicker">
                                </select>
                            </div>
                            <button type="button" name="update_btn" class="btn btn-primary">{{trans('file.update')}}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/purchases/create.js') }}"></script>
@endsection