import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UploadContainer = styled.div`
  text-align: center;
  padding: 60px;
  background-color: transparent;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
`;

const Title = styled.h1`
  margin-top: 5rem;
  font-family: 'Playfair Display', serif;
  color: ${props => props.theme.colors.primary}; /* Use theme color */
  margin-bottom: 10rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 3rem;
  letter-spacing: 1.5px;
`;

const UploadButton = styled.button`
  background: linear-gradient(to bottom, #FF4500, #FF8C00); /* Gradient for button */
  color: white;
  font-size: 1.25rem;
  padding: 15px 20px; /* Increased button size */
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  margin: 20px 0; /* Add margin between buttons */
  width: auto; /* Auto width to fit the label */
  white-space: nowrap; /* Prevent text from wrapping */

  &:hover {
    background: linear-gradient(to bottom, #FF8C00, #FF4500); /* Gradient on hover */
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
`;

const FileInput = styled.input`
  display: none; /* Hide the default file input */
`;

const FileLabel = styled.label`
  background: linear-gradient(to bottom, #FF4500, #FF8C00); /* Gradient for label */
  color: white;
  font-size: 1.25rem;
  padding: 15px 20px; /* Increased button size */
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  margin: 20px 0; /* Add margin between buttons */
  width: auto; /* Auto width to fit the label */
  white-space: nowrap; /* Prevent text from wrapping */

  &:hover {
    background: linear-gradient(to bottom, #FF8C00, #FF4500); /* Gradient on hover */
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 0; /* Remove top margin to move the image up */
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: transparent; /* Transparent background */
  color: white; /* White text */
  border: none;
  cursor: pointer;
  font-size: 1rem; /* Adjust font size */
  display: flex;
  align-items: center;
  gap: 4px; /* Space between "X" and "Delete" */
  padding: 4px; /* Add padding for better clickability */
`;

window.filename = "";

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    window.filename = file.name;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
    window.filename = file.name;
    reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const runCommand = async () => {
    var filename = window.filename
    console.log("filename")
    console.log(filename)
    try {
      const response = await fetch("http://localhost:5000/run-command", { method: "POST", headers: {
        "Content-Type": "application/json",
    }, body: JSON.stringify({filename, filename}),
    });
      const data = await response.json();
      console.log("Command output:", data);
    } catch (error) {
      console.error("Error running command:", error);
    }
    navigate('/damage-level'); // Navigate to the damage level page
};


  return (
    <UploadContainer>
      <Title>Upload Environment Picture</Title>
      {!selectedImage && ( // Only show "Choose a Picture" button if no image is selected
        <FileLabel>
          Choose a Picture
          <FileInput type="file" accept="image/*" onChange={handleImageUpload} />
        </FileLabel>
      )}
      {selectedImage && ( // Show image preview and "Submit Picture" button if an image is selected
        <div>
          <ImagePreviewContainer>
            <ImagePreview src={selectedImage} alt="Uploaded Preview" />
            <CloseButton onClick={handleRemoveImage}>× Delete</CloseButton>
          </ImagePreviewContainer>
          <UploadButton onClick={runCommand}>Submit Picture</UploadButton>
        </div>
      )}
    </UploadContainer>
  );
}

export default ImageUpload;