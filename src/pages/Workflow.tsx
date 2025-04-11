
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
import { ArrowLeft, FileText, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <Card className="p-4 shadow-sm flex items-center space-x-4 bg-white">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{currentPatient?.name || 'Patient'}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>MRN: {currentPatient?.mrn || 'Unknown'}</span>
                <span className="mx-2">•</span>
                <span>{currentPatient?.gender || ''}</span>
                {currentPatient?.age && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{currentPatient.age} years</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Tabs 
          value={currentStep} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8 w-full max-w-2xl mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="soapReview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">SOAP Review</span>
            </TabsTrigger>
            <TabsTrigger value="icdReview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">ICD Review</span>
            </TabsTrigger>
            <TabsTrigger value="complete" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Complete</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Workflow;
