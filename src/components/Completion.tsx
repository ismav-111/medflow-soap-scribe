
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedFlow } from '@/context/MedFlowContext';
import { CheckCircle, FileDown, RefreshCw } from 'lucide-react';

const Completion = () => {
  const { resetWorkflow, icdReviews } = useMedFlow();

  return (
    <Card className="w-full max-w-2xl mx-auto text-center">
      <CardHeader>
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-semibold text-center text-medical-700">
          All ICD Codes Approved
        </CardTitle>
        <CardDescription className="text-center">
          Your review has been completed successfully
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Summary of Approved Codes</h3>
          <ul className="space-y-2 text-left">
            {icdReviews.map((review) => (
              <li key={review.id} className="flex">
                <span className="text-green-600 mr-2">✓</span>
                <span className="font-medium mr-2">{review.term}:</span>
                <span className="font-mono">{review.icdCode}</span>
                <span className="mx-2">-</span>
                <span>{review.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button 
          variant="outline"
          className="flex items-center"
          onClick={resetWorkflow}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Review
        </Button>
        <Button
          className="bg-medical-500 hover:bg-medical-600 flex items-center"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Completion;
