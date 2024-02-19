<div id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
  <div role="document" class="modal-dialog">
    <div class="modal-content">
        {{ Form::open([ 'route' => ['api.suppliers.update', 1], 'method' => 'PUT', 'files' => true, 'id'=> 'update_supplier'] ) }}
      <div class="modal-header">
        <h5 id="exampleModalLabel" class="modal-title"> {{trans('file.update_supplier')}}</h5>
        <button type="button" class="close btn-close-modal" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
      </div>
      <div class="modal-body">
        <p class="italic"><small>{{trans('file.The field labels marked with * are required input fields')}}.</small></p>
          <div class="form-group">
            <label>{{trans('file.name')}} *</label>
            <input type="text" name="name" required class="form-control" value="" placeholder="{{trans('file.placeholder_supplier_name')}}">
        </div>
        <div class="form-group">
            <input class="mt-2" type="checkbox" name="is_active" value="1" checked>
            <label class="mt-2"><strong>{{trans('file.Active')}}</strong></label>
        </div>
        <input type="hidden" name="supplier_id">
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary bt-close-modal" data-bs-dismiss="modal">{{trans('file.close')}}</button>
            <button type="submit" value="" class="btn btn-primary">{{trans('file.Save')}}</button>
        </div>
      {{ Form::close() }}
    </div>
  </div>
</div>