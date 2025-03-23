import React from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from './theme';
import logo from './fireshield.svg'; // Import your logo as SVG

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const WelcomeContainer = styled.div`
  text-align: center;
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: ${props => props.theme.colors.text};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const LogoContainer = styled.div`
  margin-bottom: 3rem;
`;

const Logo = styled.img`
  width: 200px; // Adjust size as needed
  height: auto;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif; // Use Montserrat for a modern look
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-shadow: ${props => props.theme.shadow};
`;

const UploadLink = styled(Link)`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadow};
  transition: ${props => props.theme.transition};
  text-decoration: none;

  &:hover {
    background-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.background};
    transform: translateY(-5px);
  }
`;

function WelcomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/upload');
  };

  return (
    <ThemeProvider theme={theme}>
      <WelcomeContainer>
        <LogoContainer>
          <Logo src={logo} alt="Fireshield Logo" />
        </LogoContainer>
        <Title>Welcome to Fireshield</Title>
        <UploadLink onClick={handleClick}>Upload Picture</UploadLink>
      </WelcomeContainer>
    </ThemeProvider>
  );
}

export default WelcomePage;