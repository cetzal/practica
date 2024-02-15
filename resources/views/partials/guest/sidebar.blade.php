<!-- Left Sidebar -->

<div class="side-bar active">
    <div class="menu">
    <div class="item"><a href="#"><i class="fas fa-desktop"></i>Dashboard</a></div>
    <div class="item"><a href="{{route('suppliers.index')}}"><i class="fas fa-desktop"></i>{{ trans('file.Supplier') }}</a></div>
    <div class="item"><a href="{{route('clients.index')}}"><i class="fas fa-desktop"></i>{{ trans('file.customer') }}</a></div>
    <div class="item">
        <a class="sub-btn"><i class="fas fa-table"></i>{{__('file.products')}}<i class="fas fa-angle-right dropdown"></i></a>
        <div class="sub-menu">
        <a href="{{route('products.index')}}" class="sub-item">{{__('file.product')}}</a>
        <a href="{{route('brand.index')}}" class="sub-item">{{__('file.brands')}}</a>
        <!-- <a href="#" class="sub-item">Sub Item 03</a> -->
        </div>
    </div>
    <div class="item"><a href="{{route('user.index')}}"><i class="fas fa-th"></i>{{__('file.Users')}}</a></div>
    <div class="item"><a href="{{route('logs.index')}}"><i class="fas fa-list"></i>Logs</a></div>
    <div class="item"><a href="{{route('logout')}}"><i class="fa fa-sign-out" aria-hidden="true"></i>{{ __('file.logout') }}</a></div>
    <i class="fa-solid fa-list"></i>
    </div>
</div>

<!-- End Sidebar -->