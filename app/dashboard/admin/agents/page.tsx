"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Ban, Building2, 
  Mail, Clock, Search, ShieldCheck, Loader2 
} from 'lucide-react';

// Defines the data structure coming from your MongoDB
interface Agent {
  _id: string;
  name: string;
  email: string;
  agencyName: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  createdAt: string;
}

export default function AgentApprovalDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Agents on Load
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/agents");
      const json = await res.json();
      if (json.success) {
        setAgents(json.data);
      }
    } catch (error) {
      console.error("Failed to load agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // 2. Handle Status Changes (Approve / Reject / Suspend)
  const handleStatusChange = async (agentId: string, newStatus: string) => {
    const isConfirmed = confirm(`Are you sure you want to mark this agent as ${newStatus.toUpperCase()}?`);
    if (!isConfirmed) return;

    try {
      setProcessingId(agentId); // Show spinner on the specific button
      
      const res = await fetch("/api/admin/agents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        // Update local state without reloading the whole page
        setAgents(prev => 
          prev.map(agent => agent._id === agentId ? { ...agent, status: newStatus as any } : agent)
        );
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Failed to update status. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // 3. Filter data for the table
  const filteredAgents = agents.filter(agent => {
    // Tab filter
    if (activeTab === 'pending' && agent.status !== 'pending') return false;
    if (activeTab === 'active' && !['active', 'suspended'].includes(agent.status)) return false;
    
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      (agent.name && agent.name.toLowerCase().includes(searchLower)) ||
      (agent.agencyName && agent.agencyName.toLowerCase().includes(searchLower)) ||
      (agent.email && agent.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-purple-600" size={28} /> 
            Agent Approvals
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage external B2B travel partners.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search agency, name, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${
            activeTab === 'pending' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock size={16} /> Pending Requests
          {activeTab === 'pending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
          
          {/* Badge Counter */}
          {agents.filter(a => a.status === 'pending').length > 0 && (
            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
              {agents.filter(a => a.status === 'pending').length}
            </span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-2 text-sm font-bold tracking-wide transition-colors flex items-center gap-2 relative ${
            activeTab === 'active' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} /> Active Directory
          {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-md"></span>}
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center items-center text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading partners...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-bold">Agency Name</th>
                  <th className="py-4 px-6 font-bold">Agent Contact</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold">Registration Date</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                
                {filteredAgents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">
                      No agents found in this category.
                    </td>
                  </tr>
                )}

                {filteredAgents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Agency Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200 flex-shrink-0">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{agent.agencyName || "Unknown Agency"}</p>
                          <p className="text-xs text-gray-500 font-medium tracking-wide">ID: {agent._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800">{agent.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {agent.email}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                        ${agent.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                          agent.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                          'bg-red-50 text-red-700 border-red-200'}
                      `}>
                        {agent.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {new Date(agent.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* If Pending: Show Approve/Reject */}
                        {agent.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(agent._id, 'active')}
                              disabled={processingId === agent._id}
                              className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
                            </button>
                            <button 
                              onClick={() => handleStatusChange(agent._id, 'rejected')}
                              disabled={processingId === agent._id}
                              className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
                            </button>
                          </>
                        )}

                        {/* If Active: Show Suspend */}
                        {agent.status === 'active' && (
                          <button 
                            onClick={() => handleStatusChange(agent._id, 'suspended')}
                            disabled={processingId === agent._id}
                            className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />} Suspend
                          </button>
                        )}

                        {/* If Suspended: Show Reactivate */}
                        {agent.status === 'suspended' && (
                           <button 
                           onClick={() => handleStatusChange(agent._id, 'active')}
                           disabled={processingId === agent._id}
                           className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                         >
                           {processingId === agent._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Reactivate
                         </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}