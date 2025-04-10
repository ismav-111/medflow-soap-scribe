
import { MedFlowProvider } from '@/context/MedFlowContext';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import SoapReview from '@/components/SoapReview';
import IcdReview from '@/components/IcdReview';
import Completion from '@/components/Completion';
import { useMedFlow } from '@/context/MedFlowContext';
import { Separator } from '@/components/ui/separator';

// Wrapper component to use the context
const MedFlowSteps = () => {
  const { currentStep } = useMedFlow();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-center items-center mb-6">
          <StepIndicator 
            step={1} 
            label="Upload" 
            active={currentStep === 'upload'}
            completed={currentStep !== 'upload'} 
          />
          <StepConnector completed={currentStep !== 'upload'} />
          <StepIndicator 
            step={2} 
            label="SOAP Review" 
            active={currentStep === 'soapReview'}
            completed={['icdReview', 'complete'].includes(currentStep)} 
          />
          <StepConnector completed={['icdReview', 'complete'].includes(currentStep)} />
          <StepIndicator 
            step={3} 
            label="ICD Review" 
            active={currentStep === 'icdReview'}
            completed={currentStep === 'complete'} 
          />
          <StepConnector completed={currentStep === 'complete'} />
          <StepIndicator 
            step={4} 
            label="Complete" 
            active={currentStep === 'complete'}
            completed={false} 
          />
        </div>
      </div>
      
      {currentStep === 'upload' && <FileUpload />}
      {currentStep === 'soapReview' && <SoapReview />}
      {currentStep === 'icdReview' && <IcdReview />}
      {currentStep === 'complete' && <Completion />}
    </div>
  );
};

// Step indicator component
const StepIndicator = ({ 
  step, 
  label, 
  active = false, 
  completed = false 
}: { 
  step: number; 
  label: string; 
  active?: boolean; 
  completed?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
          ${active ? 'bg-medical-600' : completed ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        {step}
      </div>
      <div className={`mt-2 text-sm font-medium 
        ${active ? 'text-medical-700' : completed ? 'text-green-600' : 'text-gray-500'}`}>
        {label}
      </div>
    </div>
  );
};

// Connector between steps
const StepConnector = ({ completed = false }: { completed?: boolean }) => {
  return (
    <div className="w-16 mx-1">
      <Separator className={`${completed ? 'bg-green-500' : 'bg-gray-200'} h-0.5`} />
    </div>
  );
};

const Index = () => {
  return (
    <MedFlowProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 py-8">
          <MedFlowSteps />
        </main>
      </div>
    </MedFlowProvider>
  );
};

export default Index;
