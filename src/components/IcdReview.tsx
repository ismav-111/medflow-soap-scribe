
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMedFlow } from '@/context/MedFlowContext';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { IcdReview as IcdReviewType } from '@/types';
import FeedbackDialog from './FeedbackDialog';

const IcdReview = () => {
  const { icdReviews, provideFeedback, isProcessing, allIcdCodesApproved } = useMedFlow();
  const [selectedReview, setSelectedReview] = useState<IcdReviewType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReviewClick = (review: IcdReviewType) => {
    setSelectedReview(review);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="h-3 w-3 mr-1" /> Feedback</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/80 border border-gray-200 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-medical-700">
          Review ICD Codes
        </CardTitle>
        <CardDescription className="text-center">
          Review and provide feedback on the generated ICD codes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-gray-100">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-14 text-center">#</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="font-mono">Code</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[80px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {icdReviews.map((review, index) => (
                <TableRow key={review.id} className="hover:bg-gray-50/80">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{review.term}</TableCell>
                  <TableCell>{review.title}</TableCell>
                  <TableCell className="font-mono text-medical-700">{review.icdCode}</TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleReviewClick(review)}
                      disabled={isProcessing}
                      className="hover:bg-gray-100"
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {allIcdCodesApproved && (
          <div className="mt-6 flex justify-center">
            <Button className="bg-medical-600 hover:bg-medical-700 flex items-center gap-2 shadow-sm">
              <FileText className="h-4 w-4" />
              Generate Final Report
            </Button>
          </div>
        )}

        {selectedReview && (
          <FeedbackDialog 
            review={selectedReview}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={(feedback) => provideFeedback(selectedReview.id, feedback)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default IcdReview;
