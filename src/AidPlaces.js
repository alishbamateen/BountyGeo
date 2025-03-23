import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AidPlacesContainer = styled.div`
  text-align: center;
  padding: 60px;
  background-color: transparent;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
`;

const AidTitle = styled.h1`
  margin-top: 5rem;
  font-family: 'Playfair Display', serif;
  color: #FF8C00;
  margin-bottom: 3rem;
  font-size: 3rem;
  letter-spacing: 1.5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2; /* Adjust line-height */
`;

const AidList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AidItem = styled.li`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #E2E8F0;
  margin: 10px 0;
`;

const DoneButton = styled.button`
  background: linear-gradient(to bottom, #FF4500, #FF8C00);
  color: white;
  font-size: 1.25rem;
  padding: 15px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  margin: 20px 0;
  width: auto;
  white-space: nowrap;

  &:hover {
    background: linear-gradient(to bottom, #FF8C00, #FF4500);
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
`;

function AidPlaces() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDone = () => {
    navigate('/'); // Navigate back to the first page (WelcomePage)
  };

  const aidPlaces = [
    'Emergency Shelter A',
    'Medical Aid Center B',
    'Food Distribution Center C',
    'Temporary Housing D',
  ];

  return (
    <AidPlacesContainer>
      <AidTitle>Nearby Aid Places</AidTitle>
      <AidList>
        {aidPlaces.map((place, index) => (
          <AidItem key={index}>{place}</AidItem>
        ))}
      </AidList>
      <DoneButton onClick={handleDone}>Done</DoneButton> {/* Add Done button */}
    </AidPlacesContainer>
  );
}

export default AidPlaces;