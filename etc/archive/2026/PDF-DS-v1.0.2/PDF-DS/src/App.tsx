import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Guide from './pages/Guide';
import EditorPage from './pages/editor/EditorPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Guide />} />
      <Route path="/editor/*" element={<EditorPage />} />
    </Routes>
  );
}
