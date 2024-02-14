<!-- top bar navigation -->
<div class="headerbar">

    <!-- LOGO -->
    <div class="headerbar-left">
        <a href="{{ url('/') }}" class="logo"><img alt="Logo" src="assets/images/logo.png" />
            <span>{{ env('APP_NAME') }}</span>
        </a>
    </div>

    <nav class="navbar-custom">


        <ul class="list-inline menu-left mb-0">
            <li class="float-left">
                <button class="button-menu-mobile open-left">
                    <i class="fa fa-fw fa-bars"></i>
                </button>
            </li>

            <li class="float-right"> 
                <!-- <select onchange="window.location.href = this.value" class="form-control">
                    <option value="{{ url('lang/en') }}" {{ session('language') == 'en' ? 'selected' : '' }}>English</option>
                    <option value="{{ url('lang/es') }}" {{ session('language') == 'es' ? 'selected' : '' }}>Spanish</option>
                </select> -->
                <a rel="nofollow" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-item"><i class="dripicons-web"></i> <span>{{__('file.language')}}</span> <i class="fa fa-angle-down"></i></a>
                <ul class="dropdown-menu edit-options dropdown-menu-right dropdown-default" user="menu">
                    <li>
                        <a href="{{ url('lang/en') }}" class="btn btn-link"> English</a>
                    </li>
                    <li>
                        <a href="{{ url('lang/es') }}" class="btn btn-link"> Español</a>
                    </li>
                   
                </ul>
            </li>
           
        </ul>

       
    </nav>

</div>
<!-- End Navigation -->