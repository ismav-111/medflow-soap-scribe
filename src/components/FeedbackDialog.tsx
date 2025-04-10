
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IcdReview, FeedbackForm } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FeedbackDialogProps {
  review: IcdReview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: FeedbackForm) => void;
}

const FeedbackDialog = ({ review, open, onOpenChange, onSubmit }: FeedbackDialogProps) => {
  const [feedback, setFeedback] = useState<FeedbackForm>({
    isCorrect: true,
    feedbackText: '',
  });

  const handleSubmit = () => {
    onSubmit(feedback);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Review the ICD code for {review.term} ({review.title}) and provide your feedback
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Term:</Label>
            <div className="col-span-3 font-medium">{review.term}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Title:</Label>
            <div className="col-span-3">{review.title}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">ICD Code:</Label>
            <div className="col-span-3 font-mono">{review.icdCode}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Reasons:</Label>
            <div className="col-span-3 text-sm">{review.reasons}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Is this information correct?</Label>
            <RadioGroup
              defaultValue="yes"
              onValueChange={(value) => 
                setFeedback(prev => ({ ...prev, isCorrect: value === 'yes' }))
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Provide additional feedback or suggest corrections..."
              value={feedback.feedbackText}
              onChange={(e) => 
                setFeedback(prev => ({ ...prev, feedbackText: e.target.value }))
              }
              className="h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-medical-500 hover:bg-medical-600"
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
