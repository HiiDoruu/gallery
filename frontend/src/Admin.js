import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './admin/Navbar';
import Sidebar from './admin/Sidebar';
import Footer from './admin/Footer';
import Dashboard from './admin/Dashboard';
import Kategori from './admin/kategori';
import KategoriTambah from './admin/kategori/tambah';
import KategoriEdit from './admin/kategori/edit';
import Foto from './admin/foto';
import FotoTambah from './admin/foto/tambah';
import FotoEdit from './admin/foto/edit';
import { useAuth } from './auth/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Admin() {
    const { authToken } = useAuth(); // Use the useAuth hook for authentication state

    const [isSidebarToggled, setSidebarToggled] = useState(false);

    if (!authToken) {
        return <Navigate to="/login" />;
    }

    const toggleSidebar = () => {
        setSidebarToggled(!isSidebarToggled);
    };

    return (
            <div id="wrapper">
                <Sidebar isToggled={isSidebarToggled} onToggleSidebar={toggleSidebar} />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Navbar onToggleSidebar={toggleSidebar} />
                        <Routes>
                            <Route path="kategori" element={<Kategori/>} />
                            <Route path="kategori/tambah" element={<KategoriTambah/>} />
                            <Route path="kategori/edit/:id" element={<KategoriEdit />} />
                            <Route path="foto" element={<Foto/>} />
                            <Route path="foto/tambah" element={<FotoTambah/>} />
                            <Route path="foto/edit/:id" element={<FotoEdit />} />
                            <Route index element={<Dashboard />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </div>
    );
}

export default Admin;
