
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SoapData, IcdReview, FeedbackForm } from '@/types';
import { processPdf, processIcdCodes, processFeedback } from '@/services/mockService';
import { toast } from '@/hooks/use-toast';

interface MedFlowContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  isProcessing: boolean;
  soapData: SoapData | null;
  icdReviews: IcdReview[];
  soapConfirmed: boolean;
  currentStep: 'upload' | 'soapReview' | 'icdReview' | 'complete';
  handleFileUpload: (file: File) => Promise<void>;
  confirmSoap: () => Promise<void>;
  provideFeedback: (id: string, feedback: FeedbackForm) => Promise<void>;
  allIcdCodesApproved: boolean;
  resetWorkflow: () => void;
  addIcdReview: (review: IcdReview) => void;
  updateIcdReview: (review: IcdReview) => void;
  deleteIcdReview: (id: string) => void;
}

const MedFlowContext = createContext<MedFlowContextType | undefined>(undefined);

export const MedFlowProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soapData, setSoapData] = useState<SoapData | null>(null);
  const [icdReviews, setIcdReviews] = useState<IcdReview[]>([]);
  const [soapConfirmed, setSoapConfirmed] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'soapReview' | 'icdReview' | 'complete'>('upload');

  const handleFileUpload = async (file: File) => {
    try {
      setFile(file);
      setIsProcessing(true);
      const data = await processPdf(file);
      setSoapData(data);
      setCurrentStep('soapReview');
      toast({
        title: "Success",
        description: "Discharge summary processed successfully",
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to process discharge summary",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmSoap = async () => {
    try {
      setIsProcessing(true);
      if (!soapData) return;
      
      const reviews = await processIcdCodes(soapData);
      setIcdReviews(reviews);
      setSoapConfirmed(true);
      setCurrentStep('icdReview');
      toast({
        title: "Success",
        description: "SOAP data confirmed and ICD codes generated",
      });
    } catch (error) {
      console.error('Error processing ICD codes:', error);
      toast({
        title: "Error",
        description: "Failed to generate ICD codes",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const provideFeedback = async (id: string, feedback: FeedbackForm) => {
    try {
      setIsProcessing(true);
      const reviewToUpdate = icdReviews.find(review => review.id === id);
      if (!reviewToUpdate) return;
      
      const updatedReview: IcdReview = {
        ...reviewToUpdate,
        feedback: feedback.feedbackText,
        status: feedback.isCorrect ? 'approved' : 'rejected'
      };
      
      const processedReview = feedback.isCorrect 
        ? updatedReview 
        : await processFeedback(updatedReview);
      
      setIcdReviews(prev => 
        prev.map(review => review.id === id ? processedReview : review)
      );
      
      toast({
        title: feedback.isCorrect ? "Approved" : "Feedback Submitted",
        description: feedback.isCorrect 
          ? "ICD code has been approved" 
          : "Your feedback has been processed",
      });
      
      // Check if all reviews are approved to move to complete step
      const allApproved = icdReviews
        .filter(r => r.id !== id)
        .every(r => r.status === 'approved') && feedback.isCorrect;
      
      if (allApproved) {
        setCurrentStep('complete');
        toast({
          title: "All Approved",
          description: "All ICD codes have been approved. Report is being generated.",
        });
      }
    } catch (error) {
      console.error('Error processing feedback:', error);
      toast({
        title: "Error",
        description: "Failed to process feedback",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a new ICD review
  const addIcdReview = (review: IcdReview) => {
    try {
      setIcdReviews(prev => [...prev, review]);
      toast({
        title: "Success",
        description: `ICD code ${review.icdCode} added successfully`,
      });
    } catch (error) {
      console.error('Error adding ICD code:', error);
      toast({
        title: "Error",
        description: "Failed to add ICD code",
        variant: "destructive",
      });
    }
  };

  // Update an existing ICD review
  const updateIcdReview = (review: IcdReview) => {
    try {
      setIcdReviews(prev => 
        prev.map(r => r.id === review.id ? review : r)
      );
      toast({
        title: "Success",
        description: `ICD code ${review.icdCode} updated successfully`,
      });
    } catch (error) {
      console.error('Error updating ICD code:', error);
      toast({
        title: "Error",
        description: "Failed to update ICD code",
        variant: "destructive",
      });
    }
  };

  // Delete an ICD review
  const deleteIcdReview = (id: string) => {
    try {
      const reviewToDelete = icdReviews.find(r => r.id === id);
      setIcdReviews(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Success", 
        description: reviewToDelete 
          ? `ICD code ${reviewToDelete.icdCode} deleted successfully` 
          : "ICD code deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting ICD code:', error);
      toast({
        title: "Error",
        description: "Failed to delete ICD code",
        variant: "destructive",
      });
    }
  };

  const resetWorkflow = () => {
    setFile(null);
    setSoapData(null);
    setIcdReviews([]);
    setSoapConfirmed(false);
    setCurrentStep('upload');
  };

  const allIcdCodesApproved = icdReviews.every(review => review.status === 'approved');

  const value = {
    file,
    setFile,
    isProcessing,
    soapData,
    icdReviews,
    soapConfirmed,
    currentStep,
    handleFileUpload,
    confirmSoap,
    provideFeedback,
    allIcdCodesApproved,
    resetWorkflow,
    addIcdReview,
    updateIcdReview,
    deleteIcdReview
  };

  return <MedFlowContext.Provider value={value}>{children}</MedFlowContext.Provider>;
};

export const useMedFlow = () => {
  const context = useContext(MedFlowContext);
  if (context === undefined) {
    throw new Error('useMedFlow must be used within a MedFlowProvider');
  }
  return context;
};
