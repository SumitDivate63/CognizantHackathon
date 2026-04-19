import { useState } from 'react';
import { Bot, CheckCircle2, CircleDashed, Loader2, Download, ChevronDown, ChevronUp, FileText, User, ShieldAlert, Award } from 'lucide-react';

export default function RightPanel({ isProcessing, processingStep, results }) {
  const [expandedCard, setExpandedCard] = useState(-1);

  const agents = [
    { id: 1, name: 'Document Classifier Agent', icon: <FileText className="w-5 h-5" /> },
    { id: 2, name: 'Data Extraction Agent', icon: <Bot className="w-5 h-5" /> },
    { id: 3, name: 'Policy Validator Agent', icon: <ShieldAlert className="w-5 h-5" /> },
    { id: 4, name: 'Claim Eligibility Agent', icon: <User className="w-5 h-5" /> },
    { id: 5, name: 'Final Report Agent', icon: <Award className="w-5 h-5" /> }
  ];

  if (!isProcessing && !results) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-white to-slate-50">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Bot className="w-12 h-12 text-slate-300" />
        </div>
        <h3 className="text-xl font-semibold text-navy-800 mb-2">Ready for Analysis</h3>
        <p className="text-slate-500 max-w-sm">
          Upload your documents, configure the details on the left, and start the AI analysis to view results and recommendations here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-navy-900 px-6 py-4 border-b border-navy-800 flex justify-between items-center sticky top-0 z-10 w-full shrink-0">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-400" />
          {results ? 'Analysis Results' : 'AI Processing Tracker'}
        </h2>
        {results && (
          <button className="flex items-center gap-2 text-xs bg-navy-800 hover:bg-navy-700 text-white px-3 py-1.5 rounded-lg border border-navy-700 transition-colors">
            <Download className="w-3 h-3" /> Export PDF
          </button>
        )}
      </div>

      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        {/* Agent Tracker */}
        {(!results || isProcessing) && (
          <div className="space-y-6 max-w-md mx-auto py-8">
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 -z-10"></div>
              {agents.map((agent) => {
                const isCompleted = processingStep > agent.id;
                const isCurrent = processingStep === agent.id || (processingStep === 0 && agent.id === 1 && isProcessing);
                const isPending = processingStep < agent.id && !(processingStep === 0 && agent.id === 1);

                return (
                  <div key={agent.id} className="flex gap-4 mb-6 last:mb-0 items-start">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white ${isCompleted ? 'bg-teal-50 text-teal-600' : isCurrent ? 'bg-amber-100 text-amber-600 shadow-md transform scale-110 transition-transform' : 'bg-slate-100 text-slate-400'}`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isCurrent ? <Loader2 className="w-6 h-6 animate-spin" /> : <CircleDashed className="w-6 h-6" />}
                    </div>
                    <div className="pt-2 flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-amber-700 text-lg' : isCompleted ? 'text-navy-900 text-lg' : 'text-slate-400'}`}>
                        {agent.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {isCompleted ? 'Completed seamlessly' : isCurrent ? 'Analyzing documentation...' : 'Awaiting input'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Container */}
        {results && !isProcessing && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 ease-out fade-in">
            {/* Eligibility Banner */}
            <div className={`p-4 rounded-xl border flex gap-4 ${
              results.eligibility.status === 'Eligible' ? 'bg-green-50 border-green-200 text-green-900' :
              results.eligibility.status === 'Not Eligible' ? 'bg-red-50 border-red-200 text-red-900' :
              'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="mt-1">
                {results.eligibility.status === 'Eligible' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <ShieldAlert className="w-6 h-6 text-red-600" />}
              </div>
              <div>
                <h3 className="font-bold text-lg">{results.eligibility.status}</h3>
                <p className="text-sm opacity-90">{results.eligibility.message}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Claim Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Policyholder</span><span className="text-sm font-medium text-navy-900">{results.summary.name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Policy Type</span><span className="text-sm font-medium text-navy-900">{results.summary.policyType}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Claim</span><span className="text-sm font-medium text-navy-900">{results.summary.claimType}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-slate-500">Documents</span><span className="text-sm font-medium text-navy-900">{results.summary.docCount} analyzed</span></div>
                </div>
              </div>

              {/* Extracted Data */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Data Extracted</h4>
                <div className="space-y-2">
                  {results.extractedData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-200 last:border-0 pb-1.5 last:pb-0">
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-sm font-mono text-navy-900 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent Findings */}
            <div>
              <h4 className="text-sm font-bold text-navy-900 mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-teal-600" /> Agent Network Findings
              </h4>
              <div className="space-y-2">
                {results.agentFindings.map((agent, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <button 
                      onClick={() => setExpandedCard(expandedCard === index ? -1 : index)}
                      className="w-full flex justify-between items-center px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-navy-800 flex items-center gap-2">
                        {agents[index]?.icon} {agent.agent}
                      </span>
                      {expandedCard === index ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                    </button>
                    {expandedCard === index && (
                      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                        <p className="text-sm text-slate-600">{agent.finding}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Final Recommendation */}
            <div className="bg-navy-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10"><Award className="w-24 h-24" /></div>
              <h4 className="text-sm font-bold text-teal-400 mb-2 relative z-10">AI Final Recommendation</h4>
              <p className="text-sm text-slate-200 leading-relaxed relative z-10">
                {results.finalRecommendation}
              </p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
