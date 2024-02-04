<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Foto;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class FotoController extends Controller
{
    public function index(Request $request)
    {
        $id_user = $request->query('id_user');

        $query = Foto::leftJoin('kategori', 'foto.id_kategori', '=', 'kategori.id_kategori')
            ->leftJoin('users', 'foto.id_user', '=', 'users.id')
            ->leftJoin('album', 'foto.id_album', '=', 'album.id_album');

        if ($id_user) {
            $query->where('foto.id_user', $id_user);
        }

        $foto = $query->latest()
            ->select('foto.*', 'kategori.nama_kategori', 'users.nama_lengkap', 'users.foto_user')
            ->get();

        return response()->json($foto, 200);
    }

    public function store(Request $request)
    {
        $rules = [
            'id_kategori' => 'required|string|max:255',
            'id_user' => 'required|string|max:255',
            'id_album' => 'required|string|max:255',
            'lokasi_file' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'tanggal_unggah' => 'required|date',
        ];

        $messages = [
            'id_kategori.required' => 'Kategori is required',
            'id_user.required' => 'User is required',
            'id_album.required' => 'Album is required',
            'lokasi_file.required' => 'Lokasi file is required',
            'judul.required' => 'Judul is required',
            'deskripsi.required' => 'Deskripsi is required',
            'tanggal_unggah.required' => 'Tanggal Unggah is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json( $validator->errors(), 400);
        }

        try {
            $file = $request->file('lokasi_file');
            $fileName = time() . '.' . $file->extension();
            $file->move(public_path('files'), $fileName);

            $foto = new Foto();
            $foto->id_kategori = $request->input('id_kategori');
            $foto->id_user = $request->input('id_user');
            $foto->id_album = $request->input('id_album');
            $foto->judul = $request->input('judul');
            $foto->deskripsi = $request->input('deskripsi');
            $foto->tanggal_unggah = $request->input('tanggal_unggah');
            $foto->lokasi_file = $fileName;
            $foto->save();

            return response()->json([
                'message' => "foto successfully created."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went wrong!",
                'details' => $e->getMessage()
            ], 500);
        }
    }


    public function show(string $id)
    {
        $foto = Foto::where('id_foto',$id)->first();

        if (!$foto) {
            return response()->json([
                'message' => "Foto Not Found"
            ], 404);
        }

        return response()->json($foto ,200);
    }


    public function update(Request $request, string $id)
    {
        $rules = [
            'id_kategori' => 'required|string|max:255',
            'id_user' => 'required|string|max:255',
            'id_album' => 'required|string|max:255',
            'lokasi_file' => 'image|mimes:jpeg,png,jpg|max:5120',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'tanggal_unggah' => 'required|date',
        ];

        $messages = [
            'id_kategori.required' => 'Kategori is required',
            'id_user.required' => 'User is required',
            'id_album.required' => 'Album is required',
            'judul.required' => 'Judul is required',
            'deskripsi.required' => 'Deskripsi is required',
            'tanggal_unggah.required' => 'Tanggal Unggah is required',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            $foto = Foto::where('id_foto', $id)->first();

            if (!$foto) {
                return response()->json([
                    'message' => "foto Not Found"
                ], 404);
            }

            $updatedData = [
                'id_kategori' => $request->input('id_kategori'),
                'id_user' => $request->input('id_user'),
                'id_album' => $request->input('id_album'),
                'judul' => $request->input('judul'),
                'deskripsi' => $request->input('deskripsi'),
                'tanggal_unggah' => $request->input('tanggal_unggah'),
            ];
//ini yg ku ubah
            if ($request->hasFile('lokasi_file')) {
                $file = $request->file('lokasi_file');
                $imageName = Str::random(32) . "." . $file->getClientOriginalExtension();
                $file->move(public_path('files'), $imageName);
                $updatedData['lokasi_file'] = $imageName;
            }

            Foto::where('id_foto', $id)->update($updatedData);

            return response()->json([
                'message' => "Foto successfully updated."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Something went really wrong"
            ], 500);
        }
    }


    public function destroy(string $id)
    {
        $foto = Foto::where('id_foto', $id)->first();

        if (!$foto) {
            return response()->json([
                'message' => "foto Not Found"
            ], 404);
        }

        $foto = $foto->foto;

        $filePath = public_path('files/' . $foto);

        if (file_exists($filePath)) {
            unlink($filePath);
        }

        Foto::where('id_foto', $id)->delete();

        return response()->json([
            'message' => "Foto successfully deleted."
        ], 200);
    }
}
