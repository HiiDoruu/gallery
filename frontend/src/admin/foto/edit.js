import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

const FotoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authToken, Id } = useAuth();
    const [kategoriOptions, setKategoriOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [originalImage, setOriginalImage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        id_kategori: '',
        id_user: Id,
        id_album: '',
        judul: '',
        lokasi_file: '',
        deskripsi: '',
        tanggal_unggah: '',

    });

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/kategori`,{
                    headers:{
                        'Authorization' :`Bearer ${authToken}`
                    },
                });
                setKategoriOptions(response.data);
            } catch (error) {
                console.error('Error fetching kategori:', error.message);
            }
        };

        const fetchFotoDetail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/foto/${id}`,{
                    headers:{
                        'Authorization' :`Bearer ${authToken}`
                    },
                });
                const fotoDetail = response.data;

                setOriginalImage(fotoDetail.lokasi_file);//ku edit

                setFormData({
                    id_kategori: fotoDetail.id_kategori,
                    id_user: fotoDetail.id_user,
                    id_album: fotoDetail.id_album,
                    judul: fotoDetail.judul,
                    lokasi_file: '',
                    deskripsi: fotoDetail.deskripsi,
                    tanggal_unggah: fotoDetail.tanggal_unggah,
                });
            } catch (error) {
                console.error('Error fetching foto detail:', error.message);
            }
        };

        fetchKategori();
        fetchFotoDetail();
    }, [id]);

    const handleChange = (e) => {
        if (e.target.name === 'lokasi_file') { //ku edit
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
            document.querySelector('input[name="lokasi_file"]').value = '';
    
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const formDataObj = new FormData();
            formDataObj.append('id_kategori', formData.id_kategori);
            formDataObj.append('id_user', formData.id_user);
            formDataObj.append('id_album', formData.id_album);
            formDataObj.append('judul', formData.judul);
            formDataObj.append('tanggal_unggah', formData.tanggal_unggah);
    
            if (selectedFile) {
                // Jika user memilih foto baru
                formDataObj.append('foto', selectedFile);
            } else {
                FormData.foto = originalImage;
            }
    
            formDataObj.append('deskripsi', formData.deskripsi);
    
            const response = await axios.post(`http://127.0.0.1:8000/api/foto-update/${id}`, formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
    
            if (response && response.data) {
                console.log(response.data);
    
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Berhasil memperbarui data.',
                    showConfirmButton: false,
                });
    
                setTimeout(() => {
                    navigate('/admin/foto');
                }, 1000);
            } else {
                // Handle the case where response or response.data is undefined
                console.error('Invalid response format:', response);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Respon tidak sesuai format yang diharapkan.',
                });
            }
        } catch (error) {
            console.error('Error updating foto:', error.response ? error.response.data : error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan dalam memperbarui data!',
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
      <div className="container-fluid">
        <div>
          <h1 className="h3 mb-3 text-gray-800">Edit Foto</h1>

          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-end align-items-center">
              <Link to="/admin/foto" className="btn btn-danger">
                <i className="bi bi-arrow-bar-left"></i>
                <span> Kembali</span>
              </Link>
              <button
                type="button"
                className="btn btn-success ml-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                <i className="bi bi-file-earmark-check"></i>
                <span> Simpan</span>
              </button>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-6">
                    <p className="fw-bold">Kategori Foto</p>
                    <select
                      name="id_kategori"
                      onChange={handleChange}
                      value={formData.id_kategori}
                      className="form-control"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoriOptions.map((kategori) => (
                        <option
                          key={kategori.id_kategori}
                          value={kategori.id_kategori}
                        >
                          {kategori.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <p className="fw-bold">Judul Foto</p>
                    <input
                      type="text"
                      name="judul"
                      onChange={handleChange}
                      value={formData.judul}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <p className="fw-bold">Tanggal Unggah</p>
                    <input
                      type="date"
                      name="tanggal_unggah"
                      onChange={handleChange}
                      value={formData.tanggal_unggah}
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <p className="fw-bold">Album</p>
                    <input
                      type="text"
                      name="id_album"
                      onChange={handleChange}
                      value={formData.id_album}
                      className="form-control"
                    />
                  </div>
                </div>
                <p className="fw-bold mt-3">Lokasi File</p>
                <input
                  type="file"
                  name="lokasi_file"
                  onChange={handleChange}
                  className="form-control"
                />
                <div className="image-preview-container">
                  {previewImage ? (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          maxWidth: "50%",
                          height: "50%",
                          borderRadius: "5%",
                        }}
                      />
                      <a
                        role="button"
                        onClick={handleChange}
                        className="cancel-button"
                      >
                        <i className="fas fa-times text-danger"></i>
                      </a>
                    </div>
                  ) : (
                    originalImage && ( // Check if originalImage exists
                      <div className="mt-2">
                        <img
                          src={`http://localhost:8000/files/` + originalImage}
                          alt="Original Preview"
                          style={{
                            maxWidth: "50%",
                            height: "50%",
                            borderRadius: "5%",
                          }}
                        />
                      </div>
                    )
                  )}
                </div>

                <p className="fw-bold mt-3">Deskripsi Foto</p>
                <textarea
                  name="deskripsi"
                  onChange={handleChange}
                  value={formData.deskripsi}
                  className="form-control"
                ></textarea>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default FotoEdit;
