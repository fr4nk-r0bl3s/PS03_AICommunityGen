import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ContentGenerator from './ContentGenerator';
import axios from 'axios';

function App() {
    const [entities, setEntities] = useState([]);
    const [communityName, setCommunityName] = useState('');
    const [location, setLocation] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [writingStyle, setWritingStyle] = useState([]);
    const [language, setLanguage] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [selectedAPI, setSelectedAPI] = useState('openai');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleEntitiesExtracted = (extractedEntities) => {
        setEntities(extractedEntities);
    };

    const handleWritingStyleChange = (event) => {
        const value = Array.from(event.target.selectedOptions, (option) => option.value);
        setWritingStyle(value);
    };

    const handleGenerateContent = async () => {
        if (!communityName || !location || !targetAudience || !writingStyle.length || !language || !entities.length) {
            alert('Please fill all the fields before generating content.');
            return;
        }

        setIsGenerating(true);
    
        try {
            const response = await axios.post('http://localhost:8000/generate-content/', {
                communityName,
                location,
                entities,
                targetAudience,
                writingStyle,
                language,
                selectedAPI
            });
            
            if (response.status === 413) {
                alert('File too large. Please upload a file less than 5MB.');
                return;
            }

            setGeneratedContent(response.data.generated_text);
        } catch (error) {
            console.error('Error generating content:', error);
            alert('An error occurred while generating content.');
        }

        setIsGenerating(false);
    };

    return (
        <div className="m-5 font-sans bg-slate-900 text-white">
            <div className="flex items-center mb-4">
                <h1 className="text-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 400 400" className="fill-current">
                <path d="M77.971 51.131 C 41.309 61.019,13.697 92.181,7.554 130.602 C 4.109 152.145,16.624 149.520,23.090 127.344 C 32.208 96.073,49.368 75.881,84.375 55.230 C 99.903 46.070,98.965 45.469,77.971 51.131 M157.813 55.781 C 127.017 70.402,100.000 107.914,100.000 136.055 C 100.000 147.385,111.749 146.644,114.257 135.156 C 121.635 101.361,139.060 78.582,173.254 58.033 C 196.784 43.892,186.129 42.338,157.813 55.781 M107.066 57.991 C 79.826 71.565,58.138 100.977,54.204 129.678 C 51.866 146.735,63.770 151.683,67.386 135.156 C 74.693 101.764,97.603 72.381,129.688 55.255 L 139.063 50.250 131.082 50.125 C 126.693 50.056,115.886 53.596,107.066 57.991 M232.813 68.054 C 264.151 83.046,279.045 105.847,284.164 146.666 C 290.993 201.131,322.106 236.281,368.750 242.226 L 382.813 244.019 371.066 239.556 C 331.540 224.537,303.519 187.573,298.441 143.750 C 292.718 94.361,272.370 69.204,233.881 63.932 L 220.313 62.074 232.813 68.054 M192.899 67.518 C 191.858 68.559,196.897 73.883,204.097 79.348 C 222.827 93.566,233.302 114.869,237.321 146.920 C 243.123 193.197,264.760 223.462,302.001 237.396 C 326.243 246.466,336.967 245.623,316.801 236.233 C 280.723 219.435,255.439 184.284,251.402 145.313 C 247.372 106.401,235.206 83.459,212.443 71.846 C 199.525 65.256,195.952 64.464,192.899 67.518 M169.511 81.739 C 166.775 84.475,167.280 87.324,171.591 93.458 C 183.400 110.265,187.890 122.892,190.644 147.044 C 196.656 199.758,227.317 235.019,273.438 242.259 L 285.938 244.222 269.419 236.265 C 231.798 218.144,208.907 185.264,203.414 141.457 C 198.485 102.146,180.603 70.647,169.511 81.739 M30.555 160.763 C 69.615 179.021,95.669 214.348,100.259 255.272 C 105.731 304.073,130.560 334.092,165.625 334.304 L 176.563 334.370 163.405 327.857 C 135.078 313.836,120.115 289.366,115.586 249.659 C 109.515 196.429,77.255 161.489,28.125 154.931 L 14.063 153.053 30.555 160.763 M65.625 155.777 C 110.039 170.871,141.858 209.132,146.922 253.534 C 151.979 297.876,174.974 331.250,200.469 331.250 C 210.584 331.250,212.408 326.384,203.368 323.515 C 184.278 317.456,166.866 286.294,162.322 250.056 C 155.389 194.767,122.645 159.636,73.438 154.692 C 62.516 153.595,60.164 153.921,65.625 155.777 M121.244 158.647 C 161.815 175.964,193.233 216.426,193.613 251.847 C 193.877 276.493,212.298 318.831,222.701 318.702 C 233.775 318.565,235.265 313.249,227.194 302.669 C 216.120 288.150,212.499 277.337,209.286 249.190 C 203.209 195.968,170.114 159.699,122.939 154.561 L 107.813 152.913 121.244 158.647 M286.458 255.208 C 285.313 256.354,284.375 259.681,284.375 262.601 C 284.375 286.735,252.247 325.445,217.112 343.644 L 198.438 353.317 212.500 351.380 C 256.502 345.317,293.108 309.608,298.940 267.056 C 300.801 253.477,294.331 247.335,286.458 255.208 M331.173 261.141 C 329.496 265.550,328.125 270.518,328.125 272.182 C 328.125 289.650,296.123 326.681,268.852 340.768 L 251.563 349.699 262.500 349.781 C 297.120 350.040,340.312 307.204,345.800 267.168 C 348.097 250.407,336.993 245.832,331.173 261.141 M378.125 260.438 C 378.125 283.581,342.218 328.468,311.982 343.124 C 294.716 351.492,306.344 352.783,329.113 345.025 C 367.485 331.950,416.590 253.125,386.362 253.125 C 379.809 253.125,378.125 254.620,378.125 260.438 "/>
                </svg>
            <span className="text-white mr-1">Propertyshelf</span> <span className="text-rose-700">AI</span>
            </h1>
            <div className="ml-6 relative inline-block text-left">
                    <div>
                        <button
                            type="button"
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 transition-colors bg-slate-800 text-sm font-medium text-gray-400 hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-300"
                            id="api-select-button"
                            aria-haspopup="listbox"
                            aria-expanded="true"
                            aria-labelledby="api-select-label"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {selectedAPI === 'openai' ? 'ChatGPT 3.5' : selectedAPI === 'anthropic' ? 'Claude 3' : 'Gemini Pro'}
                            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 12z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {isDropdownOpen && (
    <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="api-select-button">
            <button
                className={`${selectedAPI === 'openai' ? 'bg-slate-800 text-gray-400' : 'text-gray-500'} block w-full text-left px-4 py-2 text-sm`}
                role="menuitem"
                onClick={() => {
                    setSelectedAPI('openai');
                    setIsDropdownOpen(false);
                }}
            >
                ChatGPT 3.5 {selectedAPI === 'openai' && '✓'}
            </button>
            <button
                className={`${selectedAPI === 'anthropic' ? 'bg-slate-800 text-gray-400' : 'text-gray-500'} block w-full text-left px-4 py-2 text-sm`}
                role="menuitem"
                onClick={() => {
                    setSelectedAPI('anthropic');
                    setIsDropdownOpen(false);
                }}
            >
                Claude 3 {selectedAPI === 'anthropic' && '✓'}
            </button>
            <button
                className={`${selectedAPI === 'gemini' ? 'bg-slate-800 text-gray-400' : 'text-gray-500'} block w-full text-left px-4 py-2 text-sm`}
                role="menuitem"
                onClick={() => {
                    setSelectedAPI('gemini');
                    setIsDropdownOpen(false);
                }}
            >
                Gemini Pro {selectedAPI === 'gemini' && '✓'}
            </button>
        </div>
    </div>
)}    
                </div>
            </div>
            <h2 className="text-base font-bold mb-4">AICommunityGen - Ver. 0.1</h2>
            <p className="mb-6 text-sm">This AI-enhanced tool allows you to create customized content for real estate communities effortlessly, with just a few clicks.</p>
            <div className="flex gap-8">
                <div className="flex-1 p-6 rounded-lg bg-slate-800">
                    <div className="mb-6">
                        <label className="block font-bold text-lg mb-3 text-rose-400">Community Name</label>
                        <input 
                            type="text" 
                            value={communityName} 
                            onChange={e => setCommunityName(e.target.value)} 
                            placeholder="E.g. Gran Pacifica Beach & Golf Resort" 
                            className="w-full p-3 border rounded mb-4 text-sm bg-slate-800 text-white"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-lg mb-3 text-rose-400">Location</label>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="E.g. Flamingo Beach, Costa Rica" 
                            className="w-full p-3 border rounded mb-4 text-sm bg-slate-800 text-white"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-lg mb-3 text-rose-400">Target Audience</label>
                        <select 
                            className="w-full p-3 border rounded text-sm mb-4 bg-slate-800 text-white" 
                            value={targetAudience} 
                            onChange={(e) => setTargetAudience(e.target.value)}
                        >
                            <option value="">Please select</option>
                            <option value="young_professionals">Young Professionals / Singles</option>
                            <option value="couples">Couples / Newlyweds</option>
                            <option value="families">Growing Families</option>
                            <option value="investors">Real Estate Investors</option>
                            <option value="retirees">Retirees / Seeking a Second Home</option>
                            <option value="expats">Expats / International Buyers</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-lg mb-3 text-rose-400">Writing Style</label>
                        <select 
                            multiple={true} 
                            className="w-full p-3 border rounded text-sm mb-4 bg-slate-800 text-white" 
                            value={writingStyle} 
                            onChange={handleWritingStyleChange}
                        >
                            <option value="seo_friendly">SEO-friendly</option>
                            <option value="descriptive">Descriptive</option>
                            <option value="narrative">Narrative</option>
                            <option value="persuasive">Persuasive</option>
                            <option value="informative">Informative</option>
                            <option value="testimonial">Testimonial</option>
                            <option value="educational">Educational</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-lg mb-3 text-rose-400">Language</label>
                        <select 
                            className="w-full p-3 border rounded text-sm mb-4 bg-slate-800 text-white" 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="">Please select</option>
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold text-lg mb-3 text-rose-400">Community Information</label>
                        <p className="text-sm mb-6">Upload a PDF document with community details for information extraction.</p>
                        <FileUpload onEntitiesExtracted={handleEntitiesExtracted} />
                    </div>

                <button
                    onClick={handleGenerateContent}
                    className="transition-colors bg-rose-900 hover:bg-rose-800 text-white uppercase font-bold py-2 px-4 rounded w-full text-sm mt-4"
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Content...
                        </>
                    ) : (
                        'Generate'
                    )}
                </button>    
                </div>
                <div className="flex-1 p-6 rounded-lg bg-slate-50">
                    <ContentGenerator generatedContent={generatedContent} />
                </div>
            </div>
        </div>
    );
}

export default App;
