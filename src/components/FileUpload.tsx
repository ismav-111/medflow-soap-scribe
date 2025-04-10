
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedFlow } from '@/context/MedFlowContext';
import { FilePdf, Upload, X } from 'lucide-react';

const FileUpload = () => {
  const { handleFileUpload, isProcessing, file } = useMedFlow();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        handleFileUpload(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-medical-700">
          Upload Discharge Summary
        </CardTitle>
        <CardDescription className="text-center">
          Upload a patient's discharge summary PDF to extract SOAP data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center relative
            ${dragActive ? "border-medical-500 bg-medical-100" : "border-gray-300"}
            transition-all duration-200 ease-in-out`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleChange}
            className="hidden"
          />
          {file ? (
            <div className="flex flex-col items-center">
              <FilePdf size={48} className="text-medical-600 mb-2" />
              <p className="font-medium text-gray-700">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {!isProcessing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleFileUpload(file)}
                >
                  Process Again
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Upload size={48} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-700">
                  Drag and drop PDF file here
                </p>
                <p className="text-sm text-gray-500">
                  Or click to browse your files
                </p>
              </div>
              <Button 
                onClick={onButtonClick} 
                className="mt-2 bg-medical-500 hover:bg-medical-600"
              >
                Select File
              </Button>
            </div>
          )}
        </div>
        {isProcessing && (
          <div className="mt-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-medical-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-medical-700">Processing document...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
