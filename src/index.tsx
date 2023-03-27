import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutMain } from './components/LayoutMain';
import { MainPage } from './pages/Main';

import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <HashRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<LayoutMain />}>
          <Route path='/' element={<Navigate to='/main' />} />
          <Route path='/main' element={<MainPage />} />
        </Route>
      </Route>
    </Routes>
  </HashRouter>
);
