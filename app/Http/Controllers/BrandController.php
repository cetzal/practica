<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\BrandView;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{

    public function index()
    {
        $brand_all = BrandView::where('is_active', true)->get();
        return view('brand.create', compact('brand_all'));
    }

    public function list(Request $request){
        $this->validate($request, [
            'brand' => ['sometimes', 'required', 'max:255'],
            'is_active' => ['sometimes', 'boolean']
        ]);

        $data = BrandView::select(['id', 'name', 'description', 'is_active'])
                ->filter($request)->get();

        return response()->json(['data' =>$data]);
    }

    public function store(Request $request)
    {
        $request->name = preg_replace('/\s+/', ' ', $request->name);
        $this->validate($request, [
            'name' => [
                'max:255',
                Rule::unique('view_brands')->where(function ($query) {
                    return $query->where('is_active', 1);
                })
            ],
            'description' => ['required']
        ]);

        $input = $request->except('image');
        $input['is_active'] = true;
       
        // $image = $request->image;
        // if ($image) {
        //     $ext = pathinfo($image->getClientOriginalName(), PATHINFO_EXTENSION);
        //     $imageName = preg_replace('/[^a-zA-Z0-9]/', '', $input['title']);
        //     $imageName = $imageName . '.' . $ext;
        //     $image->move('public/images/brand', $imageName);
        //     $input['image'] = $imageName;
        // }
        Brand::create($input);
        return response()->json(['status' => 'succes', 'message' => 'La marca se guardo con exito']);
    }

    public function edit($id)
    {
        $brand_data = BrandView::select(['id', 'name', 'description'])
                        ->findOrFail($id);
        return $brand_data;
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => [
                'max:255',
                Rule::unique('view_brands')->ignore($request->brand_id)->where(function ($query) {
                    return $query->where('is_active', 1)->whereNull('deleted_at');
                }),
            ],
            'description' => ['required']
        ]);

        $brand_data = Brand::findOrFail($request->brand_id);
        $brand_data->name = $request->name;
        $brand_data->description = $request->description;
        $brand_data->save();
        
        return response()->json(['status' => 'succes', 'message' => 'La marca se guardo con exito']); 
    }

    public function desactivarBySelection(Request $request)
    {
        $request->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        Brand::whereIn('id', $request['brandIdArray'])->update(['is_active' => false]);
        
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido desactiva']); 
    }

    public function activarBySelection(Request $request)
    {
        $request->validate($request, [
            'brandIdArray' => ['required', 'array', 'min:1']
        ]);

        Brand::whereIn('id', $request['brandIdArray'])->update(['is_active' => true]);

        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido activado']); 
    }

    public function desactivar($id)
    {
        $brand_data = Brand::findOrFail($id);
        $brand_data->is_active = false;
        $brand_data->save();
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido desactiva']);
    }

    public function activar($id)
    {
        $brand_data = Brand::findOrFail($id);
        $brand_data->is_active = true;
        $brand_data->save();
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido activado']); 
    }

    public function destroy($id){
        $brand_data = Brand::findOrFail($id);
        $brand_data->delete();
        return response()->json(['status' => 'succes', 'message' => 'La marca ha sido eliminado']); 
    }
}
