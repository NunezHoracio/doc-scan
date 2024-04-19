import React, { useState, useRef } from 'react';
import PdfExtractor from '../pdfExtractor/PdfExtractor';
import './Upload.css';

const Upload = () => {
  const [pdf, setPdf] = useState(null);
  //const [pdfPath, setPdfPath] = useState('');
  const inputRef = useRef();
  const dropRef = useRef();

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setPdf(event.target.result);
      //setPdfPath(URL.createObjectURL(selectedFile));
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add('dragging');
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dropRef.current.classList.add('dragging');
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove('dragging');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove('dragging');
    const selectedFile = e.dataTransfer.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      setPdf(event.target.result);
      //setPdfPath(URL.createObjectURL(selectedFile));
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  if (pdf) {
    return (
      <div className="upload">
        <PdfExtractor pdfFile={pdf} />
      </div>
    );
  }

  return (
    <div
      className="dropzone"
      ref={dropRef}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h1>Drag and Drop File to Upload</h1>
      <h2>Or</h2>
      <input
        type="file"
        accept="application/pdf"
        hidden
        onChange={handlePdfChange}
        ref={inputRef}
      />
      <button onClick={() => inputRef.current.click()}>Select File</button>
    </div>
  );
};

export default Upload;
