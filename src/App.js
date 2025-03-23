import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import ImageUpload from './ImageUpload';
import DamageLevel from './DamageLevel'; // New component
import AidPlaces from './AidPlaces'; // New component
import { theme } from './theme';
import logo from './darkfire.png';
import './App.css';

const AppContainer = styled.div`
  text-align: center;
  background-color: transparent;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 10vh;
  font-size: calc(10px + 2vmin);
  color: ${props => props.theme.colors.text};
  font-family: 'Poppins', sans-serif;
`;


const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 3.5rem;
  letter-spacing: 1.5px;
  animation: fadeIn 1.5s ease-in-out;
  margin-top: 10;
`;

const Button = styled.button`
  background-color: rgba(255, 140, 0, 0.7); /* Lighter and less bright orange with 70% opacity */
  color: white; /* White text */
  font-size: 1.0rem;
  padding: 15px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  margin: 50px 0;
  width: auto;
  white-space: nowrap;

  &:hover {
    background-color: rgba(255, 140, 0, 0.9); /* Slightly more opaque on hover */
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
`;

const Logo = styled.img`
  width: 300px;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
  border: none; /* Ensure no border */
  outline: none; /* Ensure no outline */
  box-shadow: none; /* Ensure no box shadow */
  background: transparent; /* Ensure transparent background */
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function WelcomePage() {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/upload');
  };



  return (
    <div>
      <Logo src={logo} alt="Fireshield Logo" />
      <Title>Welcome to FireShield</Title>
      <ButtonContainer>
        <Button onClick={handleUploadClick}>Upload Environment Picture</Button>
      </ButtonContainer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/upload" element={<ImageUpload />} />
            <Route path="/damage-level" element={<DamageLevel />} /> {/* New route */}
            <Route path="/aid-places" element={<AidPlaces />} /> {/* New route */}
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;