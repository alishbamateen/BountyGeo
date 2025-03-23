import React from 'react';
import styled from 'styled-components';

const NearbyAidsContainer = styled.div`
  text-align: center;
  padding: 60px;
  background-color: transparent;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
`;

const Section = styled.div`
  background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #FF8C00; /* Orange color */
  margin-bottom: 1rem;
`;

const SectionContent = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #E2E8F0; /* Light gray color */
  margin: 0;
`;

function NearbyAids() {
  const aidSpots = [
    {
      title: 'Optimal Aid Spot',
      distance: '5 km away',
      description: 'This is the most optimal aid spot with full medical and emergency supplies.',
    },
    {
      title: 'Second Optimal Aid Spot',
      distance: '8 km away',
      description: 'This aid spot has limited medical supplies but is well-stocked with food and water.',
    },
    {
      title: 'Third Optimal Aid Spot',
      distance: '12 km away',
      description: 'This aid spot provides basic shelter and first-aid supplies.',
    },
  ];

  return (
    <NearbyAidsContainer>
      {aidSpots.map((spot, index) => (
        <Section key={index}>
          <SectionTitle>{spot.title}</SectionTitle>
          <SectionContent><strong>Distance:</strong> {spot.distance}</SectionContent>
          <SectionContent><strong>Description:</strong> {spot.description}</SectionContent>
        </Section>
      ))}
    </NearbyAidsContainer>
  );
}

export default NearbyAids;