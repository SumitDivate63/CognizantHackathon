import { useState, useRef } from 'react';
import { UploadCloud, X, FileText, FileImage, Cpu, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function LeftPanel({ onAnalyze, isProcessing }) {
  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState('Medical Bill / Hospital Invoice');
  const [policyType, setPolicyType] = useState('Health Insurance');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  
  // User details
  const [formData, setFormData] = useState({
    fullName: '',
    policyNumber: '',
    dob: '',
    claimType: 'New Claim',
    incidentDate: '',
    description: ''
  });

  const fileInputRef = useRef(null);

  const documentTypes = [
    'Medical Bill / Hospital Invoice',
    'Discharge Summary',
    'Prescription / Lab Report',
    'Policy Document',
    'Claim Form',
    'Identity Proof',
    'Other'
  ];

  const policyTypes = [
    'Health Insurance',
    'Life Insurance',
    'Motor / Vehicle Insurance',
    'Home / Property Insurance',
    'Travel Insurance',
    'Term Insurance'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (newFiles) => {
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
    const validFiles = Array.from(newFiles).filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return validExtensions.includes(ext);
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please upload at least one document.");
      return;
    }

    setIsUploading(true);
    setUploadMessage('Uploading to Cloudinary...');
    
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        // Using "c6kz7q3l" as the preset you just created
        uploadData.append("upload_preset", "c6kz7q3l"); 
        uploadData.append("cloud_name", "dnoa7cbml");

        const res = await fetch("https://api.cloudinary.com/v1_1/dnoa7cbml/upload", {
          method: "POST",
          body: uploadData,
        });

        const cloudRes = await res.json();
        if (cloudRes.secure_url) {
          uploadedUrls.push(cloudRes.secure_url);
        } else {
          console.error("Cloudinary Error:", cloudRes);
          // If you get an error here, the upload preset might not exist or isn't named "unsigned"
          throw new Error(cloudRes.error?.message || "Failed to upload image. Please verify your unsigned upload preset name.");
        }
      }

      setUploadMessage('Saving to Firebase...');
      
      const docRef = await addDoc(collection(db, "documents"), {
        ...formData,
        docType,
        policyType,
        documentUrls: uploadedUrls,
        createdAt: new Date().toISOString()
      });

      console.log("Document written with ID: ", docRef.id);
      
      setIsUploading(false);
      onAnalyze({ ...formData, docType, policyType, files, documentUrls: uploadedUrls });

    } catch (error) {
      console.error("Error storing claim: ", error);
      alert(error.message || "An error occurred during upload/save. Check console for details.");
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-navy-900 px-6 py-4 border-b border-navy-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-teal-400" />
          Input Configuration
        </h2>
      </div>

      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Upload Section */}
          <section className="space-y-3">
            <label className="block text-sm font-medium text-navy-800">1. Document Upload</label>
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-100 hover:border-teal-400 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-navy-800 mb-1">Drag and drop your files here</p>
              <p className="text-xs text-slate-500 mb-4">Accepts: PDF, JPG, PNG, DOCX</p>
              <button type="button" className="bg-white border border-slate-300 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors pointer-events-none">
                Browse Files
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileInput} 
                className="hidden" 
                multiple 
                accept=".pdf,.jpg,.jpeg,.png,.docx"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {file.name.endsWith('.pdf') ? <FileText className="text-red-500 w-5 h-5 flex-shrink-0" /> : <FileImage className="text-blue-500 w-5 h-5 flex-shrink-0" />}
                      <div className="truncate">
                        <p className="text-sm font-medium text-navy-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length === 0 && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                <AlertCircle className="w-3 h-3" /> Document required to proceed
              </p>
            )}
          </section>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="space-y-2">
              <label className="block text-sm font-medium text-navy-800">Document Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={docType} onChange={e => setDocType(e.target.value)}>
                {documentTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </section>
            
            <section className="space-y-2">
              <label className="block text-sm font-medium text-navy-800">Policy Type</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={policyType} onChange={e => setPolicyType(e.target.value)}>
                {policyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </section>
          </div>

          <div className="h-px bg-slate-200 w-full my-4"></div>

          {/* User Details */}
          <section className="space-y-4">
            <label className="block text-sm font-medium text-navy-800">2. Claim Details</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Policy Number</label>
                <input type="text" name="policyNumber" value={formData.policyNumber} onChange={handleChange} placeholder="POL-12345" className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Incident/Treatment Date</label>
                <input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <label className="text-xs font-medium text-slate-600 block">Claim Type</label>
              <div className="flex gap-4">
                {['New Claim', 'Renewal', 'Reimbursement'].map(type => (
                  <label key={type} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="claimType" value={type} checked={formData.claimType === type} onChange={handleChange} className="text-teal-600 focus:ring-teal-500" />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Brief Description (Max 300 chars)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} maxLength="300" rows="3" placeholder="Describe the incident or treatment..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"></textarea>
            </div>
          </section>

          <div className="pt-4 pb-2">
            <button 
              type="submit" 
              disabled={isProcessing || isUploading}
              className={`w-full py-4 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-md ${
                (isProcessing || isUploading) ? 'bg-navy-700 cursor-not-allowed opacity-80' : 'bg-teal-500 hover:bg-teal-600 hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              {(isProcessing || isUploading) ? (
                <>
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Cpu className="w-6 h-6 animate-pulse" />}
                  {isUploading ? uploadMessage : 'Agents Running...'}
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Analyze with AI Agents
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
