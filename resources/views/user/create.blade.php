<div id="createModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog modal-lg">
          <div class="modal-content">
              {{ Form::open([ 'files' => true, 'id' => 'new_user'] ) }}
            <div class="modal-header">
              <h5 id="exampleModalLabel" class="modal-title"> {{trans('file.Add User')}}</h5>
              <button type="button" class="close btn-close-modal" data-bs-dismiss="modal" aria-label="Close"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span></button>
             
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label><strong>{{trans('file.UserName')}} *</strong> </label>
                            <input type="text" name="name" required class="form-control" value="">
                        </div>
                        <div class="form-group">
                            <label><strong>{{trans('file.UserLastName')}} *</strong> </label>
                            <input type="text" name="last_name" required class="form-control">
                        </div>
                        <div class="form-group">
                            <label><strong>{{trans('file.Password')}} *</strong> </label>
                            <div class="input-group has-validation">
                                <input type="password" name="password" id="btn-password" required class="form-control">
                                <div class="input-group-prepend">
                                    <button type="button" class="input-group-text show_p" name="show_pass" id="show_pass"><i class="fa fa-eye" aria-hidden="true"></i></button>
                                    <!-- <button id="genbutton" type="button" class="input-group-text"><i class="fa fa-unlock-alt" aria-hidden="true"></i></button> -->
                                </div>
                            </div>

                            <div class="invalid-feedback order-last"></div>
                            <div class="securty_pass_c">
                                <div id="Length" class="glyphicon glyphicon-remove">Must be at least 7 charcters</div>
                                <div id="UpperCase" class="glyphicon glyphicon-remove">Must have atleast 1 upper case character</div>
                                <div id="LowerCase" class="glyphicon glyphicon-remove">Must have atleast 1 lower case character</div>
                                <div id="Numbers" class="glyphicon glyphicon-remove">Must have atleast 1 numeric character</div>
                                <div id="Symbols" class="glyphicon glyphicon-remove">Must have atleast 1 special character</div>
                            </div>
                        </div>
                        <div class="form-group mt-3">
                            <label><strong>{{trans('file.Email')}} *</strong></label>
                            <input type="email" name="email" placeholder="example@example.com" required class="form-control" value="">
                        </div>
                        <div class="form-group">
                            <input class="mt-2" type="checkbox" name="is_active" value="1" checked>
                            <label class="mt-2"><strong>{{trans('file.Active')}}</strong></label>
                        </div>
                    </div>
                    <div class="col-md-6">
                       
                        <div class="form-group">
                            <label><strong>{{trans('file.Role')}} *</strong></label>
                            <input type="hidden" name="role_id_hidden" value="">
                            <select name="role_id" required class="selectpicker form-control" data-live-search="true" data-live-search-style="begins" title="Select Role...">
                                <option value="1">ADMIN</option>
                                <option value="2 ">CUSTOMER</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>avatar</strong> </label> <i class="dripicons-question" data-toggle="tooltip" title="{{trans('file.You can upload multiple image. Only .jpeg, .jpg, .png, .gif file can be uploaded. First image will be base image.')}}"></i>
                            <div id="imageUploadNewUser" class="dropzone"></div>
                            <span class="validation-msg" id="image-error"></span>
                        </div>
                       
                    </div>                              
                </div>
                                          
                <div class="form-group">       
                    <input type="submit" value="{{trans('file.Save')}}" id="submit-btn-create" class="btn btn-primary">
                    <button type="button" data-bs-dismiss="modal" aria-label="Close" class="btn bt-close-modal">{{__('file.Close')}}</button>

                </div>
            </div>
            {{ Form::close() }}
          </div>
        </div>
    </div>