import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import ImageSlider from './components/ImagesSlider';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <ImageSlider/>
      </div>
    </BrowserRouter>
  );
}

export default App;