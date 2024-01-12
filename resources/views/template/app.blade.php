<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ env('APP_NAME') }}</title>

   @include('partials.head')

</head>

<body class="adminbody">

    <div id="main">

        @auth
            @include('partials.'.auth()->user()->role.'.navigation')
            @include('partials.'.auth()->user()->role.'.sidebar')
        @else
        {{-- se puede agregar un redirecion al login --}}
            @include('partials.guest.navigation')
            @include('partials.guest.sidebar')
        @endauth

        <div class="content-page">

            <!-- Start content -->
            <div class="content">

                <div class="container-fluid">
                    @yield('content')
                </div>
            </div>
        </div>
    </div>   

    @include('partials.footer')
    @include('partials.scripts')
    @yield('scripts')

</body>
</html>