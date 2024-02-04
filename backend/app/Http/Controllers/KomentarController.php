<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Komentar;
use Illuminate\Support\Facades\Validator;
use App\Models\Foto;

class KomentarController extends Controller
{

    public function store(Request $request)
    {
        $rules = [
            'id_foto' => 'required|string|max:258',
            'id_user' => 'required|string|max:258',
            'isi_komentar' => 'required|string|max:258',
            'tanggal_komentar' => 'required|date',
        ];

        $messages = [
            'id_foto.required' => 'Foto is required',
            'id_user.required' => 'User is required',
            'isi_komentar.required' => 'Komentar is required',
            'tanggal_komentar.required' => 'Tanggal Komentar is required',

        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json( $validator->errors(), 400);
        }

        try {

            Komentar::create([
                'id_foto' => $request->input('id_foto'),
                'id_user' => $request->input('id_user'),
                'isi_komentar' => $request->input('isi_komentar'),
                'tanggal_komentar' => $request->input('tanggal_komentar'),
            ]);

            Foto::where('id_foto', $request->input('id_foto'))->increment('jumlah_komentar');

            return response()->json([
                'message' => "Kategori successfully created."
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
        $komentar = Komentar::where('id_foto',$id)
            ->leftJoin('users', 'komentar.id_user', '=', 'users.id')
            ->select('komentar.*', 'users.nama_lengkap')
            ->get();

        if (!$komentar) {
            return response()->json([
                'message' => "komentar Not Found"
            ], 404);
        }

        return response()->json($komentar, 200);
    }

    public function destroy(string $id)
    {
        $komentar = Komentar::where('id_komentar', $id)->first();

        if (!$komentar) {
            return response()->json([
                'message' => "komentar Not Found"
            ], 404);
        }

        Komentar::where('id_komentar', $id)->delete();

        return response()->json([
            'message' => "komentar successfully deleted."
        ], 200);
    }
}
