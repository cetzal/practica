<div id="createModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
    <div role="document" class="modal-dialog">
      <div class="modal-content">
        {!! Form::open([ 'route' => 'api.brand.store', 'method' => 'post', 'files' => true, 'id'=> 'new_brand']) !!}
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">{{trans('file.Add Brand')}}</h5>
          <button type="button" class="close btn-close-modal" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
        </div>
        <div class="modal-body">
          <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
            <div class="form-group">
                <label>{{trans('file.name')}} *</label>
                <input type="text" name="name" required class="form-control" value="" placeholder="{{trans('file.placeholder_brand_name')}}">
            </div>
            <div class="form-group">
                <label>{{trans('file.supplier')}}</label>
                <select class="form-select" name="supplier_id" id="suppliers_id"></select>
            </div>
            <div class="form-group">
                <label>{{trans('file.Description')}} *</label>
                <textarea name="description" required class="form-control" value="" placeholder="{{trans('file.placeholder_brand_description')}}" rows="3"></textarea>
                <!-- <input type="textarea" name="description" required class="form-control" value="" placeholder="Type brand description..."> -->
            </div>
            
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary bt-close-modal" data-bs-dismiss="modal">{{trans('file.close')}}</button>
            <input type="submit" value="{{trans('file.Save')}}" class="btn btn-primary">
        </div>
        {{ Form::close() }}
      </div>
    </div>
</div>
