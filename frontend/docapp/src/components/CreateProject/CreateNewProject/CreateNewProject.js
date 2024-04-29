// Import React and hooks
import React, { useState } from 'react';
// Import CSS for styling
import './CreateNewProject.css';
// Import a button component
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/themes/theme-blue.css";
// Import a helper for Axios with multipart data support
import multiAxios from '../../../helper/multipart_axios';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';


// Define the CreateNewProject component with props
const CreateNewProject = ({ nextStep, values, handleChange, onFileChange, setFields, setIsHandwritten }) => {
    // State hooks for managing loading and extracted text
    const [loading, setLoading] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [entrel,setentrel]=useState('');
    const location = useLocation();
    const {  userId } = useAuth();
 //   const [errorMessage, setErrorMessage] = useState('');
   // const userId = location.state?.userId
    // Handler for continuing after form submission
    const Continue = async (e) => {
        e.preventDefault();
        const { file, name } = values;
        // Calls submit only, and the flow stops here unless explicitly called elsewhere
        await submit(file);
        await updateUploads(name);
    };
    
    const updateUploads = async (documentName) => {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/user/upload', {
                    userId,
                    documentName
                });
                if (response.status === 200) {
                    console.log('Upload added successfully');
        //             setErrorMessage('');
                    return true;
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                 //   setErrorMessage('Document name already taken, please use another document name.');
                } else {
                    console.error('Error updating user uploads:', error.response ? error.response.data : error.message);
                }
                return false;
            }
        };
        
    // Function to handle file submission and text extraction
    const visualizeGraph = async () => {
        try {
            // Loop to download each graph based on their ID
            for (let i = 1; i <= 3; i++) {
                const response = await axios({
                    url: `http://127.0.0.1:5003/visualize/${i}`,
                    method: 'GET',
                    responseType: 'blob',  // Important for getting the file
                });
                // Create a URL for the received file blob
                const url = window.URL.createObjectURL(new Blob([response.data]));
                // Create a temporary link to trigger download
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `graph${i}.html`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }
        } catch (error) {
            console.error('Error visualizing graphs:', error);
        }
    };
  
    
    const submit = async (file) => {
        setLoading(true);
        const data = new FormData();
        data.append('file', file);
    
        try {
            const response = await multiAxios.post('http://localhost:5000/extract-text', data);
            if (response.data.text) {
                console.log(response.data.text);
               await setExtractedText(response.data.text);
                // Separate out the processing function call
               await submitTextForProcessing(response.data.text);
                visualizeGraph()
                console.log(userId);
            } else {
                console.error("Error extracting text or no text found");
            }
        } catch (error) {
            console.error("Error submitting file:", error);
        }
        setLoading(false);
    };
    

    // Handle file input changes
    const onChange = (e) => {
        onFileChange(e.target.files[0]);
    };

    // Handle changes in the checkbox for handwritten detection
    const checkboxChange = (e) => {
        setIsHandwritten(e.target.checked);
    };

    // Button rendering based on loading state
    const button = () => {
        return !loading ? (
            <AwesomeButton type="primary" onClick={Continue}>Submit</AwesomeButton>
        ) : (
            <AwesomeButton type="disabled">LOADING...</AwesomeButton>
        );
    };

    

    const submitTextForProcessing = async (extractedText) => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5002/process-text', {
                text: extractedText
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const result = response.data;
            if (result && result.entities && result.relations) {
                setentrel(result);
            } else {
                setentrel({ entities: [], relations: [] });  
                console.error("No entities or relations found in the response.");
            }
        } catch (error) {
            console.error("Error processing text:", error.response ? error.response.data : error.message);
            setentrel({ entities: [], relations: [] });  
        } finally {
            setLoading(false);
        }
    };
    
  
    


  
return (
    <div className='container'>
        <div className='header text-center'>
            <h1>Create New Project</h1>
        </div>
        <div className='form-container row'>
            <div className='col-md-3'></div>
            <div className='col-md-6'>
                <form onSubmit={Continue}>
                    <div className="mb-3">
                        <label htmlFor="floatingInput">Document Name</label>
                        <input type="text" className="form-control" id="floatingInput" placeholder="My Document" value={values.name} onChange={handleChange('name')} required />
                    </div>
                    <div className="upload">
                        <input type="file" accept="image/png, image/jpeg" className="form-control" id="floatingPassword" onChange={onChange} required />
                        <label htmlFor="floatingPassword">Upload Document</label>
                    </div>
            {/* {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>} */}

                    {/* <div className="checkbox mb-3">
                        <input type="checkbox" id="handwrittenCheck" onChange={checkboxChange} />
                        <label htmlFor="handwrittenCheck">Is Handwritten?</label>
                    </div> */}
                   <div className="button-container d-grid gap-2 mt-5" style={{ display: 'flex column', alignItems: 'center' }}>
    {button()}
    {/* <button onClick={visualizeGraph}>Submit & Visualize Graph</button> */}
</div>


                </form>
                {extractedText && (
                    <div className="extracted-text">
                        <h3>Entities and relations</h3>
                        <div>
                            <h4>Entities:</h4>
                            <ul>
                                {entrel.entities && entrel.entities.map((entity, index) => (
                                    <li key={index}>{entity.title}-{entity.label}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4>Relations:</h4>
                            <ul>
                                {entrel.relations && entrel.relations.map((relation, index) => (
                                    <li key={index}>{relation.source} - {relation.target} ({relation.type})</li>
                                ))}
                            </ul>
                        {/* <div> 
                        <button onClick={visualizeGraph}>Visualize Graph</button>


                        </div> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

};


export default CreateNewProject;
