
import { useState } from 'react';
import { useMedFlow } from '@/context/MedFlowContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DocumentPreview = () => {
  const { soapData, icdReviews, currentPatient } = useMedFlow();
  const [downloading, setDownloading] = useState(false);

  if (!soapData || !currentPatient) return null;

  const approvedIcds = icdReviews.filter(review => review.status === 'approved');

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-medical-700">
              Clinical Documentation Summary
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                disabled={downloading}
                className="flex items-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={handlePrint}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="print:text-black">
            <div className="mb-8 border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">{currentPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">MRN</p>
                  <p className="font-medium">{currentPatient.mrn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{currentPatient.dob}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{currentPatient.gender}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">SOAP Documentation</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-medical-600">Subjective</h4>
                <p className="mt-1 text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">{soapData.subjective}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-medical-600">Objective</h4>
                <p className="mt-1 text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">{soapData.objective}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-medical-600">Assessment</h4>
                <p className="mt-1 text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">{soapData.assessment}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-medical-600">Plan</h4>
                <p className="mt-1 text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">{soapData.plan}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">ICD-10 Codes</h3>
              {approvedIcds.length > 0 ? (
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-32">ICD Code</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedIcds.map((icd) => (
                      <TableRow key={icd.id}>
                        <TableCell className="font-mono font-medium">{icd.icdCode}</TableCell>
                        <TableCell>{icd.term}</TableCell>
                        <TableCell>{icd.title}</TableCell>
                        <TableCell>{icd.reasons || "None"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 italic">No approved ICD codes</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t bg-gray-50 text-gray-500 text-sm">
          <div className="w-full flex justify-between items-center">
            <p>Generated via MedCode Scribe</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentPreview;
