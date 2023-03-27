import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer';
import { Header } from '../Header';

import './Layout.scss';

export const Layout = () => (
    <div className='layout'>
        <Header />
        <Outlet />
        <Footer />
    </div>
);
