
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedFlow } from '@/context/MedFlowContext';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import SoapReview from '@/components/SoapReview';
import IcdReview from '@/components/IcdReview';
import Completion from '@/components/Completion';
import DocumentPreview from '@/components/DocumentPreview';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Workflow = () => {
  const navigate = useNavigate();
  const { currentPatient, currentStep, setCurrentStep } = useMedFlow();

  useEffect(() => {
    // Redirect to dashboard if no patient is selected
    if (!currentPatient) {
      navigate('/');
    }
  }, [currentPatient, navigate]);

  const handleTabChange = (value: string) => {
    setCurrentStep(value as 'upload' | 'soapReview' | 'icdReview' | 'complete');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-medical-700">
                {currentPatient?.name || 'Patient'} Record
              </h1>
              <p className="text-gray-500">
                MRN: {currentPatient?.mrn || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        <Tabs 
          value={currentStep} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8 w-full max-w-2xl mx-auto">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="soapReview">SOAP Review</TabsTrigger>
            <TabsTrigger value="icdReview">ICD Review</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <FileUpload />
          </TabsContent>
          
          <TabsContent value="soapReview">
            <SoapReview />
          </TabsContent>
          
          <TabsContent value="icdReview">
            <IcdReview />
          </TabsContent>
          
          <TabsContent value="complete">
            <DocumentPreview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Workflow;
