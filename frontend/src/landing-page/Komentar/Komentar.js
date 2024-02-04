import { Card, Col, Row, Spinner, Container } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Komentar.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../auth/AuthContext';

const Komentar = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [komentar, setKomentar] = useState([]);
  const { authToken, Id } = useAuth();

  const [formData, setFormData] = useState({
    isi_komentar: '',
    tanggal_komentar: "y-m-d",
    id_foto: id,
    id_user: Id
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/komentar', formData,
        {   
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`,
              },
            }
        );
        console.log('berhasil');
        fetchData();
        setFormData({
          isi_komentar: '',
          tanggal_komentar: 'y-m-d',
        });
    } catch (error) {
        console.error('Error:', error.response.data);        
    } finally {
        setLoading(false);
    }
};

  const fetchData = async () => {
    try {
      const responseImages = await axios.get(`http://127.0.0.1:8000/api/foto/${id}`);
      const dataImages = responseImages.data;

      const responseKomentars = await axios.get(`http://127.0.0.1:8000/api/komentar/${id}`);
      const dataKomentars = responseKomentars.data;
      
      setKomentar(dataKomentars);
      setImages(dataImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Link to="/home" className="btn btn-sm btn-danger mb-3">
        <i className="bi bi-arrow-left"></i>
        <span> Kembali</span>
      </Link>
      <Card.Body className="mb-5">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status"></Spinner>
          </div>
        ) : (
          <Row className="d-flex">
            <Col xs={12} md={4} className="mb-3">
              {/* Left side (image and name) */}
              <Card>
                <Card.Body>
                  <img
                    src={`http://localhost:8000/files/` + images.lokasi_file}
                    alt="lokasi_file"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "3%",
                    }}
                  />
                  <p className="fw-bold mt-2">{images.judul}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={8}>
              <Card className="h-75 komentar-card">
                <Card.Body>
                  <div className="komentar-container">
                    {komentar.map((komentars) => (
                      <div className="komentar-box">
                        <p className="komentar-text">
                          {komentars.isi_komentar}
                        </p>
                        <span className="komentar-username">
                          {komentars.nama_lengkap}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
              <Row className="justify-content-center">
                <Col xs={12} md={11}>
                  <div className="mt-3">
                    <input
                      type="text"
                      name="isi_komentar"
                      className="form-control"
                      placeholder="Tambahkan komentar..."
                      onChange={handleChange}
                      value={formData.isi_komentar}
                    ></input>
                    <input
                      type="date"
                      hidden
                      name="isi_komentar"
                      className="form-control"
                      placeholder=""
                      onChange={handleChange}
                      value={formData.tanggal_komentar}
                  
                    ></input>
                  </div>
                </Col>
                <Col xs={12} md={1}>
                  <a
                    role="button"
                    className="btn btn-secondary mt-3"
                    onClick={handleSubmit}
                  >
                    <i className="bi bi-send"></i>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Container>
  );
}

export default Komentar;
