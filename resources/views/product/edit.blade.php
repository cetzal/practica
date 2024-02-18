@extends('template.app')

@section('content')
<section class="forms">
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex align-items-center">
                        <h4>{{trans('file.Update Product')}}</h4>
                    </div>
                    <div class="card-body">
                        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
                        <form id="product-form">
                            @method('PUT')
                            <input type="hidden" id="product_id" value="{{ $product_data->id }}">

                            <div class="row">
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Type')}} *</strong> </label>
                                        <div class="input-group">
                                            <select name="type" required class="form-control selectpicker" id="type">
                                                <option value="standard">Standard</option>
                                            </select>
                                            <input type="hidden" name="type_hidden" value="{{$product_data->type}}">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Name')}} *</strong> </label>
                                        <input type="text" name="name" value="{{$product_data->name}}" required class="form-control">
                                        <span class="validation-msg" id="name-error"></span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Code')}} *</strong> </label>
                                        <div class="input-group">
                                            <input type="text" name="code" id="code" value="{{$product_data->code}}" class="form-control" required readonly>
                                            <div class="input-group-append">
                                                <button desb id="genbutton" type="button" class="btn btn-sm btn-default" title="{{trans('file.Generate')}}" disabled><i class="fa fa-retweet" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                        <span class="validation-msg" id="code-error"></span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Barcode Symbology')}} *</strong> </label>
                                        <div class="input-group">
                                            <input type="hidden" name="barcode_symbology_hidden" value="{{$product_data->barcode_symbology}}">
                                            <select name="barcode_symbology" required class="form-control selectpicker">
                                                <option value="C128">Code 128</option>
                                                <option value="C39">Code 39</option>
                                                <option value="UPCA">UPC-A</option>
                                                <option value="UPCE">UPC-E</option>
                                                <option value="EAN8">EAN-8</option>
                                                <option value="EAN13">EAN-13</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label>{{trans('file.supplier')}}</strong> </label>
                                    <div class="input-group">
                                        <input type="hidden" name="supplier" value="{{ $product_data->supplier_id}}">
                                        <select class="form-control selectpicker form-select select-supplier" name="supplier_id"> 
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label>{{trans('file.Brand')}}</strong> </label>
                                        <div class="input-group">
                                            <input type="hidden" name="brand" value="{{ $product_data->brand_id}}">
                                            <select name="brand_id" class="selectpicker form-control" data-live-search="true" data-live-search-style="begins" title="Select Brand...">
                                                <option value="">Select a brand</option> 
                                            
                                            </select>
                                      </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <input type="hidden" name="category" value="{{$product_data->category_id}}">
                                        <label>{{trans('file.category')}} *</strong> </label>
                                        <div class="input-group">
                                          <select name="category_id" required class="selectpicker form-control" data-live-search="true" data-live-search-style="begins" title="Select Category...">
                                            @foreach($category_list as $category)
                                                <option value="{{$category->id}}">{{$category->name}}</option>
                                            @endforeach
                                          </select>
                                      </div>
                                    </div>
                                </div>
                                <div id="unit" class="col-md-12">
                                    <div class="row ">
                                        <div class="col-md-4">
                                                <label>{{trans('file.Product Unit')}} *</strong> </label>
                                                <div class="input-group">
                                                  <select required class="form-control selectpicker" data-live-search="true" data-live-search-style="begins" title="Select unit..." name="unit_id">
                                                    @foreach($unit_list as $unit)
                                                        @if($unit->base_unit==null)
                                                            <option value="{{$unit->id}}">{{$unit->unit_name}}</option>
                                                        @endif
                                                    @endforeach
                                                  </select>
                                                  <input type="hidden" name="unit" value="{{ $product_data->unit_id}}">
                                              </div>
                                        </div>
                                        <div class="col-md-4">
                                                <label>{{trans('file.Sale Unit')}}</strong> </label>
                                                <div class="input-group">
                                                  <select class="form-control selectpicker" name="sale_unit_id" id="sale-unit"> 
                                                  </select>
                                                  <input type="hidden" name="sale_unit" value="{{ $product_data->sale_unit_id}}">
                                              </div>
                                        </div>
                                        <div class="col-md-4 mt-2">
                                                <div class="form-group">
                                                    <label>{{trans('file.Purchase Unit')}}</strong> </label>
                                                    <div class="input-group">
                                                      <select class="form-control selectpicker" name="purchase_unit_id"> 
                                                      </select>
                                                      <input type="hidden" name="purchase_unit" value="{{ $product_data->purchase_unit_id}}">
                                                  </div>
                                                </div>
                                        </div>                                
                                    </div>                                
                                </div>
                                <div id="cost" class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Cost')}} *</strong> </label>
                                        <input type="number" name="cost" value="{{$product_data->cost}}" required class="form-control" step="any">
                                        <span class="validation-msg"></span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Price')}} *</strong> </label>
                                        <input type="number" name="price" value="{{$product_data->price}}" required class="form-control" step="any">
                                        <span class="validation-msg"></span>
                                    </div>
                                    <div class="form-group">
                                        <input type="hidden" name="qty" value="{{ $product_data->qty }}" class="form-control">
                                    </div>
                                </div>
                                <div id="alert-qty" class="col-md-4">
                                    <div class="form-group">
                                        <label>{{trans('file.Alert Quantity')}}</strong> </label>
                                        <input type="number" name="alert_quantity" value="{{$product_data->alert_quantity}}" class="form-control" step="any">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <input type="hidden" name="tax" value="{{$product_data->tax_id}}">
                                        <label>{{trans('file.product')}} {{trans('file.Tax')}}</strong> </label>
                                        <select name="tax_id" class="form-control selectpicker">
                                            <option value="">No Tax</option>
                                            @foreach($tax_list as $tax)
                                                <option value="{{$tax->id}}">{{$tax->name}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <input type="hidden" name="tax_method_id" value="{{$product_data->tax_method}}">
                                        <label>{{trans('file.Tax Method')}}</strong> </label>
                                        <select name="tax_method" class="form-control selectpicker">
                                            <option value="1">{{trans('file.Exclusive')}}</option>
                                            <option value="2">{{trans('file.Inclusive')}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label>{{trans('file.Product Image')}}</strong> </label> <i class="dripicons-question" data-toggle="tooltip" title="{{trans('file.You can upload multiple image. Only .jpeg, .jpg, .png, .gif file can be uploaded. First image will be base image.')}}"></i>
                                        <div id="imageUpload" class="dropzone"></div>
                                        <span class="validation-msg" id="image-error"></span>
                                    </div>
                                </div> 
                                <div class="col-md-12"> 
                                    <div class="form-group">
                                        <label>{{trans('file.Product Details')}}</label>
                                        <textarea name="product_details" class="form-control" rows="5">{{str_replace('@', '"', $product_data->product_details)}}</textarea>
                                    </div>
                                </div>
                                <div class="col-md-4 mt-3">
                                    <input type="hidden" name="promotion_hidden" value="{{$product_data->promotion}}">
                                    <input name="promotion" type="checkbox" id="promotion" value="1">&nbsp;
                                    <label><h5>{{trans('file.Add Promotional Price')}}</h5></label>
                                </div>
                                
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-4" id="promotion_price">   <label>{{trans('file.Promotional Price')}}</label>
                                            <input type="number" name="promotion_price" value="{{$product_data->promotion_price}}" class="form-control" step="any" />
                                        </div>
                                        <div id="start_date" class="col-md-4">
                                            <div class="form-group">
                                                <label>{{trans('file.Promotion Starts')}}</label>
                                                <input type="text" name="starting_date" value="{{$product_data->starting_date}}" id="starting_date" class="form-control" />
                                            </div>
                                        </div>
                                        <div id="last_date" class="col-md-4">
                                            <div class="form-group">
                                                <label>{{trans('file.Promotion Ends')}}</label>
                                                <input type="text" name="last_date" value="{{$product_data->last_date}}" id="ending_date" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <input type="button" value="{{trans('file.Save')}}" class="btn btn-primary" id="submit-btn">
                                        <a href="{{route('products.index')}}" class="btn btn-warning">Atras</a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
@section('scripts')
    <script src="{{ asset('js/modules/product/edit.js') }}"></script>
@endsection