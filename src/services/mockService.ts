
import { SoapData, IcdReview } from '@/types';

// This would be replaced with actual API calls in a production environment
export const processPdf = async (file: File): Promise<SoapData> => {
  console.log('Processing PDF:', file.name);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock SOAP data that would be extracted from PDF
  return {
    subjective: "Patient is a 45-year-old male presenting with chest pain that began 3 days ago. Pain is described as pressure-like, radiating to left arm, rated 7/10. Associated symptoms include shortness of breath and diaphoresis. No prior history of cardiac events.",
    objective: "Vital signs: BP 145/90, HR 92, RR 18, T 98.6°F, O2 96% on RA. Physical exam reveals regular rate and rhythm without murmurs. Lungs clear bilaterally. ECG shows ST elevation in leads V2-V4. Troponin I elevated at 2.1 ng/mL.",
    assessment: "Acute myocardial infarction (STEMI). Hypertension. Hyperlipidemia.",
    plan: "Admit to cardiac care unit. Initiate dual antiplatelet therapy with aspirin 325mg and clopidogrel 75mg daily. Schedule for cardiac catheterization within 24 hours. Cardiology consult ordered."
  };
};

export const processIcdCodes = async (soapData: SoapData): Promise<IcdReview[]> => {
  console.log('Processing ICD codes for:', soapData.assessment);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock ICD data that would be generated from assessment
  return [
    {
      id: '1',
      term: 'STEMI',
      title: 'ST elevation myocardial infarction',
      icdCode: 'I21.3',
      reasons: 'ECG showed ST elevation in leads V2-V4, elevated troponin levels',
      feedback: '',
      status: 'pending'
    },
    {
      id: '2',
      term: 'Hypertension',
      title: 'Essential hypertension',
      icdCode: 'I10',
      reasons: 'Elevated blood pressure of 145/90',
      feedback: '',
      status: 'pending'
    },
    {
      id: '3',
      term: 'Hyperlipidemia',
      title: 'Hyperlipidemia, unspecified',
      icdCode: 'E78.5',
      reasons: 'Noted in assessment, no specifics provided',
      feedback: '',
      status: 'pending'
    }
  ];
};

export const processFeedback = async (icdReview: IcdReview): Promise<IcdReview> => {
  console.log('Processing feedback for:', icdReview);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (icdReview.status === 'rejected') {
    // Simulate correction based on feedback
    return {
      ...icdReview,
      icdCode: icdReview.term === 'STEMI' ? 'I21.0' : icdReview.icdCode, // More specific code
      reasons: icdReview.reasons + " (Updated based on feedback)",
      status: 'pending'
    };
  }
  
  return icdReview;
};
