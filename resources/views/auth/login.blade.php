@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Login') }}</div>

                <div class="card-body">
                    <form method="POST" action="{{ route('api.login') }}" id="login">
                        @csrf

                        <div class="row mb-3">
                            <!--<div class="control-group"> -->
                                <label for="email" class="col-md-4 col-form-label text-md-end">{{ __('Email') }}</label>

                                <div class="col-md-6">
                                    <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>

                                    <span class="invalid-feedback" role="alert">
                                       
                                    </span>
                                </div>
                            <!-- </div>  -->
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-end">{{ __('Password') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control" name="password" required autocomplete="current-password">

                                    <span class="invalid-feedback" role="alert">
                                      
                                    </span>
                                
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6 offset-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                    <label class="form-check-label" for="remember">
                                        {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Login') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@section('scripts')
<script type="text/javascript">

    $('form#login').validate({
        rules:{
            email: {
                required: true,
                email: true
            },
            password : 'required'
        },
        highlight: function (input) {
            $(input).addClass('is-invalid');
        },
        unhighlight: function (input) {
            $(input).removeClass('is-invalid');
        },
        errorPlacement: function ( error, element ) {
            // Add the `invalid-feedback` class to the error element
            error.addClass("invalid-feedback" );
            error.insertAfter(element);
        },
        messages: {
            password: "password es requerido",
            email: {
            required: "We need your email address to contact you",
            email: "Your email address must be in the format of name@domain.com"
            }
        }
    });

    $( 'form#login' ).submit( function(e){
        e.preventDefault();

        if(!this.checkValidity()){
            return;
        }
        
        // var data = $(this);
        var data = new FormData( $( 'form#login' )[ 0 ] );
        var actionUrl = $(this).attr('action');
        var method = $( this ).attr( 'method' );
        
        $.ajax( {
            processData: false,
            contentType: false,
            dataType: "json",
            // data: JSON.stringify(data.serializeArray()),
            data: data,
            dataType: 'json',
            type: $( this ).attr( 'method' ),
            url: actionUrl,
            success: function( response ){
                $.confirm({
                    title: response.status,
                    content: response.message,
                    autoClose: 'ok|1000',
                    buttons: {
                        ok: function () {
                            window.location.replace('/user');
                        }
                    }
                });
                // window.location.href = "{{route('user.index')}}";
                //window.location.replace('/user');
            }
        });

       
    });
</script>
    
@endsection
