// Simulating 3NF Database Structures

export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  FINANCE = 'FINANCE',
  EHR = 'EHR',
  INVENTORY = 'INVENTORY',
  BILLING = 'BILLING'
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  lastVisit: string;
  status: 'Admitted' | 'Discharged' | 'Outpatient';
  roomNumber?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  timestamp: string;
  author: string;
  content: string; // Unstructured text
  aiProcessed: boolean;
  structuredData?: {
    summary: string;
    icdCodes: string[];
    medications: string[];
  };
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: 'REVENUE' | 'EXPENSE' | 'ASSET' | 'LIABILITY';
  status: 'POSTED' | 'PENDING' | 'FLAGGED';
  riskScore: number; // 0-100, AI detected anomaly score
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'PHARMA' | 'SURGICAL' | 'GENERAL';
  stockLevel: number;
  reorderPoint: number;
  expiryDate: string;
  predictedDemand: number; // AI Forecast
}

export interface AnalysisResult {
  text: string;
  data?: any;
}
