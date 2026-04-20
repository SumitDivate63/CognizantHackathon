import { Activity, Beaker, CheckCircle2 } from 'lucide-react';

export default function Header({ agentStatus }) {
  const getStatusColor = () => {
    switch(agentStatus) {
      case 'Processing': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'Ready': return 'text-teal-600 bg-teal-50 border-teal-200';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
    }
  };

  const getStatusIcon = () => {
    switch(agentStatus) {
      case 'Processing': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'Ready': return <CheckCircle2 className="w-4 h-4" />;
      default: return <div className="w-2 h-2 rounded-full bg-slate-400 m-1" />;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-navy-900 p-2 rounded-lg flex items-center justify-center shadow-inner">
            <Beaker className="text-teal-400 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-navy-900 hidden sm:block font-sans">
            InsurIQ <span className="text-slate-400 font-normal">| AI Document Processor</span>
          </h1>
          <h1 className="text-xl font-bold text-navy-900 sm:hidden">
            InsurIQ
          </h1>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-teal-600 transition-colors text-teal-600">Home</a>
          <a href="#" className="hover:text-teal-600 transition-colors">History</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Settings</a>
        </nav>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>AI Agents: {agentStatus}</span>
        </div>
      </div>
    </header>
  );
}
