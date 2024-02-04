import Kategori from '../Kategori/Kategori';
import Komentar from '../Komentar/Komentar';
import Topbar from '../Topbar/Topbar';
import './HeaderMain.css';
import { Route, Routes } from 'react-router-dom';

const HeaderMain = () => {
  return (
    <div className='h_main'>
    <Topbar/>
    <Routes>
      <Route index element={<Kategori/>} />
      <Route path="komentar-gambar/:id" element={<Komentar/>} />
      </Routes>
    </div>
  )
}

export default HeaderMain