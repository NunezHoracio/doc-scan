import React, { useState } from 'react';
import { Document, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfExtractor = ({ pdfFile }) => {
    const [name, setName] = useState('');
    const [bviCompanyNumber, setBviCompanyNumber] = useState('');
    const [jurisdiction, setJurisdiction] = useState('');
    const [date, setDate] = useState('');

    function onDocumentLoadSuccess() {
        extractText(pdfFile);
    }

    function extractText(pdfFile) {
        const loadingTask = pdfjs.getDocument(pdfFile);
        loadingTask.promise.then((pdf) => {

            const extractPageText = (page) => {
                return page.getTextContent().then((textContent) => {
                    const pageText = textContent.items.map((s) => s.str).join(' ');
                    return pageText;
                });
            };

            const regexName = /in respect of incorporation having been complied with,\s*([\s\S]*?)\s*BVI COMPANY NUMBER:/;
            const regexCompanyNumber = /BVI COMPANY NUMBER:\s*(\d+)/;
            const regexJurisdiction = /is incorporated in the\s+([A-Z\s]+)\s+as a BVI BUSINES COMPANY,/;
            const regexDate = /as a BVI BUSINES COMPANY, this(.*?)\./s;

            const extractAllPagesText = async () => {
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const pageText = await extractPageText(page);

                    const matchName = pageText.match(regexName);
                    if (matchName) {
                        setName(matchName[1].trim());
                    }

                    const matchCompanyNumber = pageText.match(regexCompanyNumber);
                    if (matchCompanyNumber) {
                        setBviCompanyNumber(matchCompanyNumber[1]);
                    }

                    const matchJurisdiction = pageText.match(regexJurisdiction);
                    if (matchJurisdiction) {
                        setJurisdiction(matchJurisdiction[1].trim());
                    }

                    const matchDate = pageText.match(regexDate);
                    if (matchDate) {
                        setDate(matchDate[1]);
                    }
                }
            };

            extractAllPagesText();
        });
    }

    return (
        <div>
            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}></Document>
            <div>
                <h2>Formulario con datos extraídos del PDF:</h2>
                <form>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} readOnly />

                    <label htmlFor="bviCompanyNumber">BVI Company Number:</label>
                    <input type="text" id="bviCompanyNumber" value={bviCompanyNumber} readOnly />

                    <label htmlFor="jurisdiction">Jurisdiction:</label>
                    <input type="text" id="jurisdiction" value={jurisdiction} readOnly />

                    <label htmlFor="date">Date:</label>
                    <input type="text" id="date" value={date} readOnly />
                </form>
            </div>
        </div>
    );
};

export default PdfExtractor;
