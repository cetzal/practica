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
        </ul>
    </nav>

</div>
<!-- End Navigation -->