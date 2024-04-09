import React from 'react';
import axios from 'axios';

function FileUpload({ onEntitiesExtracted }) {
    const onFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:8000/extract-info/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response:', response.data);
            onEntitiesExtracted(response.data.entities);
            console.log("File successfully uploaded and processed");
        } catch (error) {
            console.error('Unable to extract info:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
        </div>
    );
}

export default FileUpload;
