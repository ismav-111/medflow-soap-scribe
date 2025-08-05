
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header with Patient Info */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="button-hover"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="card-elevated p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="heading-3">{currentPatient?.name || 'Patient'}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-mono">#{currentPatient?.mrn || 'Unknown'}</span>
                  <span>•</span>
                  <span>{currentPatient?.gender || ''}</span>
                  {currentPatient?.age && (
                    <>
                      <span>•</span>
                      <span>{currentPatient.age} years old</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Tabs */}
        <Tabs 
          value={currentStep} 
          onValueChange={handleTabChange}
          className="w-full space-y-8"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-4xl mx-auto h-14 p-1 bg-surface-variant">
            <TabsTrigger value="upload" className="flex items-center gap-2 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Document Upload</span>
              <span className="sm:hidden">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="soapReview" className="flex items-center gap-2 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">SOAP Review</span>
              <span className="sm:hidden">SOAP</span>
            </TabsTrigger>
            <TabsTrigger value="icdReview" className="flex items-center gap-2 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">ICD Review</span>
              <span className="sm:hidden">ICD</span>
            </TabsTrigger>
            <TabsTrigger value="complete" className="flex items-center gap-2 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Complete</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="card-elevated p-8 min-h-[600px]">
            <TabsContent value="upload" className="mt-0">
              <FileUpload />
            </TabsContent>
            
            <TabsContent value="soapReview" className="mt-0">
              <SoapReview />
            </TabsContent>
            
            <TabsContent value="icdReview" className="mt-0">
              <IcdReview />
            </TabsContent>
            
            <TabsContent value="complete" className="mt-0">
              <DocumentPreview />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Workflow;
