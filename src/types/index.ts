
export interface SoapData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface IcdReview {
  id: string;
  term: string;
  title: string;
  icdCode: string;
  reasons: string;
  feedback: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface FeedbackForm {
  isCorrect: boolean;
  feedbackText: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  mrn: string;
  lastVisit?: string;
  status: 'active' | 'inactive' | 'pending';
}
