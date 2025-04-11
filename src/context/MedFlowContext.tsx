import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SoapData, IcdReview, FeedbackForm, Patient } from '@/types';
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
  setCurrentStep: (step: 'upload' | 'soapReview' | 'icdReview' | 'complete') => void;
  handleFileUpload: (file: File) => Promise<void>;
  confirmSoap: () => Promise<void>;
  provideFeedback: (id: string, feedback: FeedbackForm) => Promise<void>;
  allIcdCodesApproved: boolean;
  resetWorkflow: () => void;
  addIcdReview: (review: IcdReview) => void;
  updateIcdReview: (review: IcdReview) => void;
  deleteIcdReview: (id: string) => void;
  patients: Patient[];
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  selectedIcdCodes: string[];
  toggleIcdCodeSelection: (id: string) => void;
  selectAllIcdCodes: (selected: boolean) => void;
}

const MedFlowContext = createContext<MedFlowContextType | undefined>(undefined);

export const MedFlowProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soapData, setSoapData] = useState<SoapData | null>(null);
  const [icdReviews, setIcdReviews] = useState<IcdReview[]>([]);
  const [soapConfirmed, setSoapConfirmed] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'soapReview' | 'icdReview' | 'complete'>('upload');
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      dob: '1979-05-15',
      mrn: 'MRN-12345',
      lastVisit: '2023-03-10',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      dob: '1992-11-22',
      mrn: 'MRN-23456',
      lastVisit: '2023-04-05',
      status: 'active'
    }
  ]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>([]);

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

  const addPatient = (patient: Patient) => {
    try {
      setPatients(prev => [...prev, patient]);
      toast({
        title: "Success",
        description: `Patient ${patient.name} added successfully`,
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      });
    }
  };

  const updatePatient = (patient: Patient) => {
    try {
      setPatients(prev => 
        prev.map(p => p.id === patient.id ? patient : p)
      );
      toast({
        title: "Success",
        description: `Patient ${patient.name} updated successfully`,
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient",
        variant: "destructive",
      });
    }
  };

  const deletePatient = (id: string) => {
    try {
      const patientToDelete = patients.find(p => p.id === id);
      setPatients(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success", 
        description: patientToDelete 
          ? `Patient ${patientToDelete.name} deleted successfully` 
          : "Patient deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    }
  };

  const toggleIcdCodeSelection = (id: string) => {
    setSelectedIcdCodes(prev => {
      if (prev.includes(id)) {
        return prev.filter(codeId => codeId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAllIcdCodes = (selected: boolean) => {
    if (selected) {
      setSelectedIcdCodes(icdReviews.map(review => review.id));
    } else {
      setSelectedIcdCodes([]);
    }
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
    setCurrentStep,
    handleFileUpload,
    confirmSoap,
    provideFeedback,
    allIcdCodesApproved,
    resetWorkflow,
    addIcdReview,
    updateIcdReview,
    deleteIcdReview,
    patients,
    currentPatient,
    setCurrentPatient,
    addPatient,
    updatePatient,
    deletePatient,
    selectedIcdCodes,
    toggleIcdCodeSelection,
    selectAllIcdCodes
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
