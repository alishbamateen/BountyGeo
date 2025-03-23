import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DamageLevelContainer = styled.div`
  text-align: center;
  padding: 60px;
  background-color: transparent;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
`;
const DamageTitle = styled.h1`
  margin-top: 5rem;
  font-family: 'Playfair Display', serif;
  color: #FF8C00;
  margin-bottom: 3rem;
  font-size: 3rem;
  letter-spacing: 1.5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2; /* Adjust line-height */
`;

const DamageDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  color: #E2E8F0;
  margin-bottom: 2rem;
`;

const Button = styled.button`
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

function DamageLevel() {
  const navigate = useNavigate();

  // Simulate damage level detection (replace with actual logic)
  const getDamageLevel = () => {
    const levels = [
      "Destroyed (>50%)",
      "Major (26-50%)",
      "Minor (10-25%)",
      "Affected (1-9%)",
      "No Damage",
    ];
    const randomIndex = Math.floor(Math.random() * levels.length);
    return levels[randomIndex];
  };

  const damageLevel = getDamageLevel();

  const handleFindAidPlaces = () => {
    navigate('/aid-places');
  };

  return (
    <DamageLevelContainer>
      <DamageTitle>Damage Assessment</DamageTitle>
      <DamageDescription>
        The assessed damage level is: <strong>{damageLevel}</strong>
      </DamageDescription>
      <Button onClick={handleFindAidPlaces}>Find Aid Places</Button>
    </DamageLevelContainer>
  );
}

export default DamageLevel;