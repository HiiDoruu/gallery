import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../admin/css/sb-admin-2.css';
import '../admin/css/sb-admin-2.min.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, authToken } = useAuth();

    useEffect(() => {
        // Check if the user is already authenticated on component mount
        if (authToken) {
            navigate('/admin');
        }
    }, [authToken, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
            username,
            password,
        });

        if (response.data.success) {
            login(response.data.data.token, response.data.data.nama_lengkap, response.data.data.id, response.data.data.foto_user);
            navigate('/admin'); // Redirect to /admin on successful login
        } else {
            alert(response.data.message);
        }
        } catch (error) {
        console.error('Error during login:', error);
        }
    };

    return (
        <div className="container">
  {/* Outer Row */}
  <div className="row justify-content-center">
    <div className="col-xl-6 col-lg-12 col-md-9">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body bg-secondary p-0">
          {/* Nested Row within Card Body */}
          <div className="row">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-white mb-4">Selamat Datang!</h1>
                </div>
                <form className="user" onSubmit={handleLogin}>
                  <div className="form-group">
                  <input
                        type="text"
                        className="form-control form-control-user"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="Masukkan Username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                            </div>
                  <div className="form-group">
                  <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Masukkan Password.."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <button type="submit" className="btn btn-dark btn-user btn-block">
                        Login
                    </button>             
                </form>
                <hr />
                <div className="text-end">
                  <Link to="/register" className="small text-white">Register!</Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
};

export default Login;