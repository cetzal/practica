<!-- Left Sidebar -->

<div class="side-bar active">
    <div class="menu">
    <div class="item"><a href="#"><i class="fas fa-desktop"></i>Dashboard</a></div>
    <div class="item">
        <a class="sub-btn"><i class="fas fa-table"></i>Products<i class="fas fa-angle-right dropdown"></i></a>
        <div class="sub-menu">
        <a href="{{route('products.index')}}" class="sub-item">Products</a>
        <a href="{{route('brand.index')}}" class="sub-item">Brand</a>
        <!-- <a href="#" class="sub-item">Sub Item 03</a> -->
        </div>
    </div>
    <div class="item"><a href="{{route('user.index')}}"><i class="fas fa-th"></i>Users</a></div>
   
    </div>
</div>

<!-- End Sidebar -->