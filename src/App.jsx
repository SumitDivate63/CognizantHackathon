import { useState } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0 to 5 (5 is done)
  const [results, setResults] = useState(null);
  const [agentStatus, setAgentStatus] = useState('Idle');

  const startAnalysis = (formData) => {
    setIsProcessing(true);
    setResults(null);
    setProcessingStep(0);
    setAgentStatus('Processing');

    // Simulate AI Agent processing steps:
    // Step 1: Document Classifier
    setTimeout(() => setProcessingStep(1), 1500);
    // Step 2: Data Extraction
    setTimeout(() => setProcessingStep(2), 3500);
    // Step 3: Policy Validator
    setTimeout(() => setProcessingStep(3), 5500);
    // Step 4: Claim Eligibility
    setTimeout(() => setProcessingStep(4), 7500);
    // Step 5: Final Report Agent
    setTimeout(() => {
      setProcessingStep(5);
      setIsProcessing(false);
      setAgentStatus('Ready');
      
      // Mock Results
      setResults({
        summary: {
          name: formData.fullName || 'John Doe',
          policyType: formData.policyType || 'Health Insurance',
          claimType: formData.claimType || 'New Claim',
          docCount: formData.files?.length || 1,
        },
        extractedData: [
          { label: 'Hospital Name', value: 'City General Hospital' },
          { label: 'Admission Date', value: formData.incidentDate || '2023-10-12' },
          { label: 'Diagnosis', value: 'Acute Appendicitis' },
          { label: 'Total Billed Amount', value: '$4,250.00' },
        ],
        eligibility: {
          status: 'Eligible', // 'Eligible', 'Not Eligible', 'Needs Review'
          message: 'Policy is active and covers surgical procedures.'
        },
        agentFindings: [
          { agent: 'Document Classifier', finding: 'Identified 1 Medical Bill and 1 Discharge Summary with 98% confidence.' },
          { agent: 'Data Extraction', finding: 'Hospital invoice parsed successfully. No mismatched totals found.' },
          { agent: 'Policy Validator', finding: 'Policy #'+(formData.policyNumber || 'X123')+' is active until 2026-12-31.' },
          { agent: 'Claim Eligibility', finding: 'Diagnosis falls under standard surgical coverage (Section 4b).' },
        ],
        finalRecommendation: 'The claim is supported by the provided documents and falls well within policy limits. Recommended for immediate auto-approval and payout to the policyholder via standard ECS.'
      });
    }, 10000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header agentStatus={agentStatus} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[45%] flex flex-col">
          <LeftPanel onAnalyze={startAnalysis} isProcessing={isProcessing} />
        </div>
        <div className="w-full lg:w-[55%] flex flex-col">
          <RightPanel isProcessing={isProcessing} processingStep={processingStep} results={results} />
        </div>
      </main>
    </div>
  );
}

export default App;
