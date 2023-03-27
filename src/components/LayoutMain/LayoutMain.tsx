import { Outlet } from 'react-router-dom';
import './LayoutMain.scss';

export const LayoutMain = () => (
    <div className='layout-main'>
        <div className='outlet'><Outlet /></div>
    </div>
);
