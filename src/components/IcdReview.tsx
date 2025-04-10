
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
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Feedback Provided</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-medical-700">
          Review ICD Codes
        </CardTitle>
        <CardDescription className="text-center">
          Review and provide feedback on the generated ICD codes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">S.No</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>ICD Code</TableHead>
              <TableHead className="w-[150px]">Reasons</TableHead>
              <TableHead className="w-[150px]">Feedback</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {icdReviews.map((review, index) => (
              <TableRow key={review.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{review.term}</TableCell>
                <TableCell>{review.title}</TableCell>
                <TableCell className="font-mono">{review.icdCode}</TableCell>
                <TableCell className="text-sm">{review.reasons}</TableCell>
                <TableCell className="text-sm">
                  {review.feedback ? review.feedback : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReviewClick(review)}
                    disabled={isProcessing}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {allIcdCodesApproved && (
          <div className="mt-6 flex justify-center">
            <Button className="bg-green-600 hover:bg-green-700 flex items-center">
              <FileText className="mr-2 h-4 w-4" />
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
