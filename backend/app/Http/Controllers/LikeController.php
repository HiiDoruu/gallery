<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Like;
use App\Models\Foto;

class LikeController extends Controller
{

    public function store(Request $request)
    {
        $rules = [
            'id_foto' => 'required|string|max:258',
            'id_user' => 'required|string|max:258',
        ];

        $messages = [
            'id_foto.required' => 'Foto is required',
            'id_user.required' => 'User is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json( $validator->errors(), 400);
        }

        try {

            Like::create([
                'id_foto' => $request->input('id_foto'),
                'id_user' => $request->input('id_user'),
            ]);

            Foto::where('id_foto', $request->input('id_foto'))->increment('jumlah_like');
            
            return response()->json([
                'message' => "like successfully created."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went really wrong!",
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        $like = Like::where('id_user',$id)->get();

        if (!$like) {
            return response()->json([
                'message' => "like Not Found"
            ], 404);
        }

        return response()->json($like, 200);
    }

    public function byFoto(string $id)
    {
        $like = Like::where('id_foto',$id)->get();

        if (!$like) {
            return response()->json([
                'message' => "like Not Found"
            ], 404);
        }

        return response()->json($like, 200);
    }


    public function destroy(string $id)
    {
        $like = Like::where('id_foto', $id)->first();

        if (!$like) {
            return response()->json([
                'message' => "like Not Found"
            ], 404);
        } 
        Foto::where('id_foto', $id)->decrement('jumlah_like');

        Like::where('id_foto', $id)->delete();

        return response()->json([
            'message' => "like successfully deleted."
        ], 200);
    }

}