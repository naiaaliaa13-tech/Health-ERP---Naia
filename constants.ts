import { Patient, FinancialRecord, InventoryItem } from './types';

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', mrn: 'MRN-2024-001', firstName: 'Eleanor', lastName: 'Rigby', dob: '1945-02-12', gender: 'F', lastVisit: '2024-05-20', status: 'Admitted', roomNumber: 'ICU-04' },
  { id: 'p2', mrn: 'MRN-2024-002', firstName: 'Jude', lastName: 'Lawson', dob: '1980-11-05', gender: 'M', lastVisit: '2024-05-21', status: 'Outpatient' },
  { id: 'p3', mrn: 'MRN-2024-003', firstName: 'Maxwell', lastName: 'Edison', dob: '1995-06-30', gender: 'M', lastVisit: '2024-05-22', status: 'Admitted', roomNumber: 'Gen-102' },
];

export const MOCK_FINANCIALS: FinancialRecord[] = [
  { id: 'TX-9901', date: '2024-05-22', description: 'Ins. Claim #4492 - BlueCross', amount: 12500.00, type: 'CREDIT', category: 'REVENUE', status: 'POSTED', riskScore: 2 },
  { id: 'TX-9902', date: '2024-05-22', description: 'Vendor Payout - MedSupply Co', amount: 4500.00, type: 'DEBIT', category: 'EXPENSE', status: 'POSTED', riskScore: 5 },
  { id: 'TX-9903', date: '2024-05-22', description: 'Bulk Purchase - Nitrile Gloves', amount: 55000.00, type: 'DEBIT', category: 'EXPENSE', status: 'FLAGGED', riskScore: 88 }, // Anomaly
  { id: 'TX-9904', date: '2024-05-21', description: 'Cafeteria Revenue', amount: 1200.50, type: 'CREDIT', category: 'REVENUE', status: 'POSTED', riskScore: 1 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', sku: 'RX-AMOX-500', name: 'Amoxicillin 500mg', category: 'PHARMA', stockLevel: 450, reorderPoint: 500, expiryDate: '2025-12-01', predictedDemand: 600 },
  { id: 'inv2', sku: 'SURG-KIT-A', name: 'Sterile Surgical Kit Type A', category: 'SURGICAL', stockLevel: 22, reorderPoint: 30, expiryDate: '2024-08-15', predictedDemand: 25 },
  { id: 'inv3', sku: 'RX-INS-GLAR', name: 'Insulin Glargine', category: 'PHARMA', stockLevel: 15, reorderPoint: 50, expiryDate: '2024-11-20', predictedDemand: 80 },
];
