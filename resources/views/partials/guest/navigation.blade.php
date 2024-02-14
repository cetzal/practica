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
                <select onchange="window.location.href = this.value" class="form-control">
                    <option value="{{ url('lang/en') }}" {{ session('locale') == 'en' ? 'selected' : '' }}>English</option>
                    <option value="{{ url('lang/es') }}" {{ session('locale') == 'es' ? 'selected' : '' }}>Spanish</option>
                </select>
            </li>
           
        </ul>

       
    </nav>

</div>
<!-- End Navigation -->