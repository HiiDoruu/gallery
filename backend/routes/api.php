<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\FotoController;
use App\Http\Controllers\KomentarController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware(['auth:sanctum'])->group(function () {
    //kategori
    Route::post('kategori',[KategoriController::class,'store']);
    Route::get('kategori/{id}',[KategoriController::class,'show']);
    Route::match(['put', 'post'], 'kategori-update/{id}', [KategoriController::class, 'update']);
    Route::delete('kategori-delete/{id}', [KategoriController::class,'destroy']);        
    
    //gambar
    Route::post('foto',[FotoController::class,'store']);
    Route::match(['put', 'post'], 'foto-update/{id}', [FotoController::class, 'update']);
    Route::delete('foto-delete/{id}', [FotoController::class,'destroy']);    
    
    //like
    Route::post('like',[LikeController::class,'store']);
    Route::delete('like-delete/{id}', [LikeController::class,'destroy']);

    //comment
    Route::post('komentar',[KomentarController::class,'store']);
});

Route::get('kategori',[KategoriController::class,'index']);

Route::get('foto',[FotoController::class,'index']);
Route::get('foto/{id}',[FotoController::class,'show']);

Route::get('like/{id}',[LikeController::class,'show']);
Route::get('jumlah-like/{id}',[LikeController::class,'byGambar']);

Route::get('komentar/{id}',[KomentarController::class,'show']);

