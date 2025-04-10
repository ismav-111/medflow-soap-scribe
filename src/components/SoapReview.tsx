
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedFlow } from '@/context/MedFlowContext';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';

const SoapReview = () => {
  const { soapData, confirmSoap, isProcessing } = useMedFlow();

  if (!soapData) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-medical-700">
          Review SOAP Data
        </CardTitle>
        <CardDescription className="text-center">
          Please review the extracted SOAP data from the discharge summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-medical-600 mb-2">Subjective</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{soapData.subjective}</p>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-lg font-semibold text-medical-600 mb-2">Objective</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{soapData.objective}</p>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-lg font-semibold text-medical-600 mb-2">Assessment</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{soapData.assessment}</p>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-lg font-semibold text-medical-600 mb-2">Plan</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{soapData.plan}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          className="bg-medical-500 hover:bg-medical-600 text-white px-6"
          onClick={confirmSoap} 
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> 
              Confirm SOAP Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SoapReview;
