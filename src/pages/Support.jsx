import React from 'react';
import { Search, MessageCircle, Mail, Phone, ExternalLink, HelpCircle, FileText, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();

  const faqs = [
    { title: 'Track My Order', desc: 'Real-time updates on your shipment status.' },
    { title: 'Returns & Refunds', desc: 'How to initiate a return or check refund status.' },
    { title: 'Payment Security', desc: 'Information about our encrypted payment gateway.' },
    { title: 'Product Warranty', desc: 'Details on our 1-year limited warranty policy.' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#0d0d12] border-b border-gray-800 pt-24 pb-16 px-6">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full"></div>
         
         <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">help you?</span></h1>
            <p className="text-gray-400 text-lg font-medium mb-10">Search our help center or select a category below to get started.</p>
            
            <div className="relative group max-w-2xl mx-auto">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Ask a question..."
                  className="w-full py-5 pl-16 pr-6 bg-[#12121a] border border-gray-800 rounded-[32px] outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-bold shadow-2xl"
               />
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-20">
         {/* FAQ Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {faqs.map((faq, idx) => (
               <div key={idx} className="bg-[#12121a] border border-gray-800 p-8 rounded-[36px] hover:border-pink-500 group cursor-pointer transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-pink-500/10 group-hover:text-pink-500 transition-all">
                     <HelpCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-white mb-2 leading-tight">{faq.title}</h4>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed">{faq.desc}</p>
               </div>
            ))}
         </div>

         {/* Contact Section */}
         <div className="bg-gradient-to-br from-[#12121a] to-[#0a0a0c] border border-gray-800 rounded-[50px] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/5 blur-[100px] rounded-full"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <div className="flex items-center gap-2 text-pink-500 mb-4">
                     <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Support Hub</span>
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-6">Need a expert? <br/>Our team is <span className="text-pink-500 italic">standing by.</span></h2>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm">
                    Whether it's technical issues, tracking shipments, or custom requests, we're here to help you 24/7.
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Live Chat', icon: MessageCircle, color: 'text-purple-400' },
                    { title: 'Email Us', icon: Mail, color: 'text-pink-400' },
                    { title: 'Call Center', icon: Phone, color: 'text-emerald-400' },
                    { title: 'Twitter @Nex', icon: ExternalLink, color: 'text-blue-400' }
                  ].map(c => (
                    <button key={c.title} className="flex flex-col items-center justify-center p-8 bg-[#0a0a0c]/50 backdrop-blur-sm border border-gray-800 rounded-[32px] hover:bg-gray-800/80 transition-all group">
                       <c.icon className={`w-8 h-8 mb-4 ${c.color} group-hover:scale-110 transition-transform`} />
                       <span className="text-xs font-black text-white uppercase tracking-widest">{c.title}</span>
                    </button>
                  ))}
               </div>
            </div>
         </div>
         
         <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">PCI Compliant</span></div>
            <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Privacy Policy</span></div>
         </div>
      </div>
    </div>
  );
}
