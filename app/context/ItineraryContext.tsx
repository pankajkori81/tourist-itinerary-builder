
// "use client";

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { 
//   saveItineraryToStorage, 
//   loadItineraryFromStorage, 
//   clearItineraryStorage,
//   saveToLibrary, 
//   getItineraryById,
//   StoredItineraryData,
//   RoutingData 
// } from '@/utils/itineraryStorage';

// // --- 1. TYPE DEFINITIONS ---

// // Workflow Status
// // app/context/ItineraryContext.tsx

// export type ItineraryStatus = 'draft' | 'pending_costing' | 'approved' | 'reedit_requested' | 'active' | 'archived';
// // Stepper Locks
// export interface StepperStatus {
//   intro: 'completed' | 'incomplete';
//   routing: 'locked' | 'unlocked' | 'completed';
//   createDay: 'locked' | 'unlocked' | 'completed';
//   review: 'locked' | 'unlocked' | 'completed';
//   costing: 'locked' | 'unlocked' | 'completed';
//   preview: 'locked' | 'unlocked' | 'completed';
// }


// // 👇 NEW: Audit Log Interfaces
// export interface AuditLogEntry {
//   version: string;
//   action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS';
//   module: string;
//   details: string;
//   userRole: string;
//   timestamp: string;
// }

// // Main Data Interface
// export interface ItineraryData extends Omit<StoredItineraryData, 'status'> {
//   companyMarkup: number;
//   tripCategory: string;
//   tripExperience: string;
//   stepperStatus: StepperStatus;
//   status: ItineraryStatus; // Explicitly enforce our status type
//   // 👇 NEW FIELDS ADDED HERE
//   currentVersion: string; 
//   auditLog: AuditLogEntry[];

  
// }

// // Context Interface
// interface ItineraryContextType {
//   itineraryData: ItineraryData;
//   updateItineraryData: (data: Partial<ItineraryData>) => void;
//   updateRoutingData: (routingData: RoutingData) => void;
//   saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
//   loadSavedItinerary: () => void;
//   loadItineraryForEdit: (id: string) => boolean;
//   clearSavedItinerary: () => void;
  
//   // Workflow Actions
//   completeStep: (step: keyof StepperStatus) => void; 
//   submitForCosting: () => void;
//   approveCosting: () => void;

//   // 👇 ADD THIS NEW FUNCTION DEFINITION
//   rejectCosting: (reason: string) => void;

//   revertToPending: () => void;


//   requestReEdit: (reason: string) => void; // 👈 NEW (Employee)
//   allowReEdit: () => void;
  
//   // Toast Notification
//   toastMessage: { message: string, type: 'success' | 'error' } | null;
//   showToast: (msg: string, type: 'success' | 'error') => void;

//   isSaving: boolean;
//   saveSuccess: boolean;


//   // 👇 NEW METHOD ADDED HERE
//   logAction: (action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS', module: string, details: string, userRole: string, isMajor?: boolean) => void;
// }

// const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// // --- 2. DEFAULT STATE ---
// const DEFAULT_ITINERARY: ItineraryData = {
//   tripId: '',
//   numberOfTravelers: 2,
//   isMasterItinerary: false,
//   tripName: '',
//   tripType: '',
//   tripStyle: '',
//   packageType: 'land',
//   creatingFor: 'guest',
//   showFlightDetails: false,
//   showTravelerDetails: true,
//   selectedCountries: [],
//   selectedCurrency: 'USD',
//   flights: [],
//   travelers: [],
//   agentTravelers: [],
//   routingData: undefined,
//   dayWiseActivities: [],

//   // New fields
//   tripCategory: '',
//   tripExperience: '',
//   status: 'draft',

//   // 👇 NEW DEFAULTS ADDED HERE
//   currentVersion: '1.0',
//   auditLog: [{
//      version: '1.0',
//      action: 'STATUS',
//      module: 'System',
//      details: 'Itinerary Created',
//      userRole: 'system',
//      timestamp: new Date().toISOString()
//   }],

//   stepperStatus: {
//     intro: 'incomplete',
//     routing: 'locked',
//     createDay: 'locked',
//     review: 'locked',
//     costing: 'locked',
//     preview: 'locked'
//   },
//   companyMarkup: 0,
 
//   startDate: function (startDate: any): unknown {
//     throw new Error('Function not implemented.');
//   }
// };

// export function ItineraryProvider({ children }: { children: React.ReactNode }) {
//   const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   // --- 1. TOAST STATE (This was missing in your code) ---
//   const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

//   // --- 2. HELPER TO SHOW TOAST (This was missing) ---
//   const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
//     setToastMessage({ message, type });
//     setTimeout(() => setToastMessage(null), 3000); // Auto-hide after 3 seconds
//   }, []);

//   // --- 3. INITIALIZATION ---
//   useEffect(() => {
//     const editingId = sessionStorage.getItem('editing_itinerary_id');
//     if (editingId) {
//       loadItineraryForEdit(editingId);
//       sessionStorage.removeItem('editing_itinerary_id');
//     } else {
//       loadSavedItinerary();
//     }
//   }, []);

//   // --- 4. CORE UPDATERS ---
//   const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
//     setItineraryData(prev => ({ ...prev, ...data }));
//   }, []);

//   const updateRoutingData = useCallback((routingData: RoutingData) => {
//     setItineraryData(prev => {
//       if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
//       return { ...prev, routingData };
//     });
//   }, []);


//   // 👇 NEW: Function to record changes and bump versions
//   const logAction = useCallback((action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS', module: string, details: string, userRole: string, isMajor = false) => {
//     setItineraryData(prev => {
//       // Calculate new version
//       const [major, minor] = (prev.currentVersion || '1.0').split('.').map(Number);
//       const newVersion = isMajor ? `${major + 1}.0` : `${major}.${(minor || 0) + 1}`;

//       const newLog: AuditLogEntry = {
//         version: newVersion,
//         action,
//         module,
//         details,
//         userRole,
//         timestamp: new Date().toISOString()
//       };

//       const updated = { 
//           ...prev, 
//           currentVersion: newVersion,
//           auditLog: [newLog, ...(prev.auditLog || [])] // Push to top of list
//       };
      
//       saveItineraryToStorage(updated);
//       return updated;
//     });
//   }, []);

//   // --- 5. WORKFLOW ACTIONS ---

//   const completeStep = useCallback((step: keyof StepperStatus) => {
//     setItineraryData(prev => {
//         const newStatus = { ...prev.stepperStatus };
//         newStatus[step] = 'completed';

//         if (step === 'intro') newStatus.routing = 'unlocked';
//         if (step === 'routing') newStatus.createDay = 'unlocked';
//         if (step === 'createDay') newStatus.costing = 'unlocked'; 

//         const updatedData = { ...prev, stepperStatus: newStatus };
//         saveItineraryToStorage(updatedData);
//         return updatedData;
//     });
//   }, []);

//   // // Employee: Submit for Costing
//   // const submitForCosting = useCallback(() => {
//   //   setItineraryData(prev => {
//   //     const updated = {
//   //       ...prev,
//   //       status: 'pending_costing' as ItineraryStatus,
//   //     };
      
//   //     saveItineraryToStorage(updated);
//   //     saveToLibrary(updated);
//   //     return updated;
//   //   });
//   //   showToast("Request sent to Admin! Waiting for approval.", "success");
//   // }, [showToast]);

//   // // Admin: Approve Costing
//   // const approveCosting = useCallback(() => {
//   //   setItineraryData(prev => {
//   //     const newStepper = { 
//   //       ...prev.stepperStatus, 
//   //       costing: 'completed', 
//   //       preview: 'unlocked' 
//   //     } as StepperStatus;

//   //     const updated = {
//   //       ...prev,
//   //       status: 'approved' as ItineraryStatus,
//   //       stepperStatus: newStepper
//   //     };

//   //     saveItineraryToStorage(updated);
//   //     saveToLibrary(updated);
//   //     return updated;
//   //   });
//   //   showToast("Costing Approved! Employee can now see Preview.", "success");
//   // }, [showToast]);





//   // // 👇 ADD THIS NEW FUNCTION (The Logic for Rejection)
//   // const rejectCosting = useCallback((reason: string) => {
//   //   setItineraryData(prev => {
//   //     const updated = {
//   //       ...prev,
//   //       status: 'draft' as ItineraryStatus, // Unlock for employee
//   //       adminComment: reason, // Save the reason
//   //       // Reset stepper if needed, or keep as is
//   //     };
      
//   //     saveItineraryToStorage(updated);
//   //     saveToLibrary(updated);
//   //     return updated;
//   //   });
//   //   showToast("Returned to Employee for changes.", "error");
//   // }, [showToast]);


//   // // 👇 ADD THIS NEW FUNCTION
//   // const revertToPending = useCallback(() => {
//   //   setItineraryData(prev => {
//   //     const updated = {
//   //       ...prev,
//   //       status: 'pending_costing' as ItineraryStatus, // Move back to Pending
//   //     };
//   //     saveItineraryToStorage(updated);
//   //     saveToLibrary(updated);
//   //     return updated;
//   //   });
//   //   showToast("Costing Unlocked for corrections.", "success");
//   // }, [showToast]);


//   // // 👇 1. EMPLOYEE: REQUEST RE-EDIT
//   // const requestReEdit = useCallback((reason: string) => {
//   //   setItineraryData(prev => {
//   //     const updated = {
//   //       ...prev,
//   //       status: 'reedit_requested' as ItineraryStatus,
//   //       reEditReason: reason
//   //     };
//   //     saveItineraryToStorage(updated);
//   //     saveToLibrary(updated);
//   //     return updated;
//   //   });
//   //   showToast("Re-edit request sent to Admin.", "success");
//   // }, [showToast]);

//   // // 👇 2. ADMIN: ALLOW RE-EDIT (Reset to Draft)
//   // const allowReEdit = useCallback(() => {
//   //   setItineraryData(prev => {
//   //     const updated = {
//   //       ...prev,
//   //       status: 'draft' as ItineraryStatus, // Back to start
//   //       reEditReason: undefined, // Clear the reason
//   //       adminComment: "Re-edit request granted. Please make your changes."
//   //     };
//   //     saveItineraryToStorage(updated);
//   //     saveToLibrary(updated);
//   //     return updated;
//   //   });
//   //   showToast("Itinerary unlocked for Employee.", "success");
//   // }, [showToast]);



//   // Employee: Submit for Costing
//   const submitForCosting = useCallback(() => {
//     setItineraryData(prev => {
//       // 👇 Calculate Major Version Bump (e.g. 1.2 -> 2.0)
//       const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
//       const newVersion = `${major + 1}.0`;
//       const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Submitted Itinerary for Costing', userRole: 'Agent / Employee', timestamp: new Date().toISOString() };

//       const updated = {
//         ...prev,
//         status: 'pending_costing' as ItineraryStatus,
//         currentVersion: newVersion,
//         auditLog: [newLog, ...(prev.auditLog || [])]
//       };
      
//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//     showToast("Request sent to Admin! Waiting for approval.", "success");
//   }, [showToast]);

//   // Admin: Approve Costing
//   const approveCosting = useCallback(() => {
//     setItineraryData(prev => {
//       const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
//       const newVersion = `${major + 1}.0`;
//       const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Costing Approved & Finalized', userRole: 'Admin', timestamp: new Date().toISOString() };

//       const newStepper = { 
//         ...prev.stepperStatus, 
//         costing: 'completed', 
//         preview: 'unlocked' 
//       } as StepperStatus;

//       const updated = {
//         ...prev,
//         status: 'approved' as ItineraryStatus,
//         stepperStatus: newStepper,
//         currentVersion: newVersion,
//         auditLog: [newLog, ...(prev.auditLog || [])]
//       };

//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//     showToast("Costing Approved! Employee can now see Preview.", "success");
//   }, [showToast]);

//   // Admin: Reject Costing
//   const rejectCosting = useCallback((reason: string) => {
//     setItineraryData(prev => {
//       const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
//       const newVersion = `${major + 1}.0`;
//       const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: `Admin requested changes: "${reason}"`, userRole: 'Admin', timestamp: new Date().toISOString() };

//       const updated = {
//         ...prev,
//         status: 'draft' as ItineraryStatus, // Unlock for employee
//         adminComment: reason, // Save the reason
//         currentVersion: newVersion,
//         auditLog: [newLog, ...(prev.auditLog || [])]
//       };
      
//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//     showToast("Returned to Employee for changes.", "error");
//   }, [showToast]);

//   // Admin: Revert to Pending
//   const revertToPending = useCallback(() => {
//     setItineraryData(prev => {
//       const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
//       const newVersion = `${major + 1}.0`;
//       const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Unlocked Costing (Reverted to Pending)', userRole: 'Admin', timestamp: new Date().toISOString() };

//       const updated = {
//         ...prev,
//         status: 'pending_costing' as ItineraryStatus, // Move back to Pending
//         currentVersion: newVersion,
//         auditLog: [newLog, ...(prev.auditLog || [])]
//       };
//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//     showToast("Costing Unlocked for corrections.", "success");
//   }, [showToast]);

//   // Employee: Request Re-Edit
//   const requestReEdit = useCallback((reason: string) => {
//     setItineraryData(prev => {
//       const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
//       const newVersion = `${major + 1}.0`;
//       const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: `Requested Re-Edit: "${reason}"`, userRole: 'Agent / Employee', timestamp: new Date().toISOString() };

//       const updated = {
//         ...prev,
//         status: 'reedit_requested' as ItineraryStatus,
//         reEditReason: reason,
//         currentVersion: newVersion,
//         auditLog: [newLog, ...(prev.auditLog || [])]
//       };
//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//     showToast("Re-edit request sent to Admin.", "success");
//   }, [showToast]);

//   // Admin: Allow Re-Edit (Reset to Draft)
//   const allowReEdit = useCallback(() => {
//     setItineraryData(prev => {
//       const [major] = (prev.currentVersion || '1.0').split('.').map(Number);
//       const newVersion = `${major + 1}.0`;
//       const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Granted Re-Edit Request (Unlocked)', userRole: 'Admin', timestamp: new Date().toISOString() };

//       const updated = {
//         ...prev,
//         status: 'draft' as ItineraryStatus, // Back to start
//         reEditReason: undefined, // Clear the reason
//         adminComment: "Re-edit request granted. Please make your changes.",
//         currentVersion: newVersion,
//         auditLog: [newLog, ...(prev.auditLog || [])]
//       };
//       saveItineraryToStorage(updated);
//       saveToLibrary(updated);
//       return updated;
//     });
//     showToast("Itinerary unlocked for Employee.", "success");
//   }, [showToast]);



//   // --- 6. STORAGE HANDLERS ---

//   const loadSavedItinerary = () => {
//     const savedData = loadItineraryFromStorage();
//     if (savedData) {
//       const mergedData = { ...DEFAULT_ITINERARY, ...savedData } as ItineraryData;
      
//       if(!mergedData.stepperStatus) mergedData.stepperStatus = DEFAULT_ITINERARY.stepperStatus;
//       if(!mergedData.status) mergedData.status = 'draft';
      
//       setItineraryData(mergedData);
//     } else {
//       setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//       });
//     }
//   };

//   const loadItineraryForEdit = (id: string): boolean => {
//     const data = getItineraryById(id);
//     if (data) {
//       const raw = { ...DEFAULT_ITINERARY, ...data } as any;
//       const allowedStatuses = ['draft', 'pending_costing', 'approved', 'active', 'archived'];
//       const normalizedStatus = allowedStatuses.includes(raw.status) ? raw.status : 'draft';
//       const normalizedStepper = raw.stepperStatus ?? DEFAULT_ITINERARY.stepperStatus;

//       const mergedData: ItineraryData = {
//         ...DEFAULT_ITINERARY,
//         ...raw,
//         status: normalizedStatus,
//         stepperStatus: normalizedStepper
//       };

//       setItineraryData(mergedData);
//       saveItineraryToStorage(mergedData);
//       return true;
//     }
//     return false;
//   };

//   const clearSavedItinerary = () => {
//     clearItineraryStorage();
//     setItineraryData({ 
//         ...DEFAULT_ITINERARY, 
//         tripId: `TRIP-${Date.now().toString().slice(-6)}` 
//     });
//   };

//   const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
//     setIsSaving(true);
//     try {
//       const dataToSave = { 
//           ...itineraryData,
//           selectedCurrency: itineraryData.selectedCurrency || 'USD' 
//       };
      
//       saveItineraryToStorage(dataToSave);
      
//       if (type === 'exit' || itineraryData.id) {
//         saveToLibrary(dataToSave);
//       }
//       if (type === 'exit') {
//         clearItineraryStorage();
//       }
      
//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 2000);
//       showToast("Itinerary saved successfully!", "success");
//       return true;
//     } catch (e) {
//       console.error(e);
//       showToast("Failed to save itinerary.", "error");
//       return false;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <ItineraryContext.Provider value={{
//       itineraryData,
//       updateItineraryData,
//       updateRoutingData,
//       saveItinerary,
//       loadSavedItinerary,
//       loadItineraryForEdit,
//       clearSavedItinerary,
      
//       // Actions
//       completeStep,
//       submitForCosting,
//       approveCosting,
//       rejectCosting,
//       revertToPending,
//       requestReEdit,
//       allowReEdit,
//       logAction,
      
//       // Toast Values (Now properly defined)
//       toastMessage,
//       showToast,
      
//       isSaving,
//       saveSuccess
//     }}>
//       {children}
//     </ItineraryContext.Provider>
//   );
// }

// export function useItinerary() {
//   const context = useContext(ItineraryContext);
//   if (context === undefined) throw new Error('useItinerary must be used within Provider');
//   return context;
// } 







































"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveItineraryToStorage, loadItineraryFromStorage, clearItineraryStorage, saveToLibrary, getItineraryById, StoredItineraryData, RoutingData } from '@/utils/itineraryStorage';

export type ItineraryStatus = 'draft' | 'pending_costing' | 'approved' | 'reedit_requested' | 'active' | 'archived';
export interface StepperStatus { intro: 'completed' | 'incomplete'; routing: 'locked' | 'unlocked' | 'completed'; createDay: 'locked' | 'unlocked' | 'completed'; review: 'locked' | 'unlocked' | 'completed'; costing: 'locked' | 'unlocked' | 'completed'; preview: 'locked' | 'unlocked' | 'completed'; }
export interface AuditLogEntry { version: string; action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS'; module: string; details: string; userRole: string; timestamp: string; }

export interface ItineraryData extends Omit<StoredItineraryData, 'status'> {
  companyMarkup: number; tripCategory: string; tripExperience: string; stepperStatus: StepperStatus; status: ItineraryStatus; currentVersion: string; auditLog: AuditLogEntry[];
}

interface ItineraryContextType {
  itineraryData: ItineraryData;
  updateItineraryData: (data: Partial<ItineraryData>) => void;
  updateRoutingData: (routingData: RoutingData) => void;
  saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
  loadSavedItinerary: () => void;
  loadItineraryForEdit: (id: string) => Promise<boolean>;
  clearSavedItinerary: () => void;
  completeStep: (step: keyof StepperStatus) => void; 
  submitForCosting: () => Promise<void>;
  approveCosting: () => Promise<void>;
  rejectCosting: (reason: string) => Promise<void>;
  revertToPending: () => Promise<void>;
  requestReEdit: (reason: string) => Promise<void>; 
  allowReEdit: () => Promise<void>;
  toastMessage: { message: string, type: 'success' | 'error' } | null;
  showToast: (msg: string, type: 'success' | 'error') => void;
  isSaving: boolean;
  saveSuccess: boolean;
  logAction: (action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS', module: string, details: string, userRole: string, isMajor?: boolean) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

const DEFAULT_ITINERARY: ItineraryData = {
  tripId: '', numberOfTravelers: 2, isMasterItinerary: false, tripName: '', tripType: '', tripStyle: '', packageType: 'land', creatingFor: 'guest', showFlightDetails: false, showTravelerDetails: true, selectedCountries: [], selectedCurrency: 'USD', flights: [], travelers: [], agentTravelers: [], routingData: undefined, dayWiseActivities: [], tripCategory: '', tripExperience: '', status: 'draft', currentVersion: '1.0',
  auditLog: [{ version: '1.0', action: 'STATUS', module: 'System', details: 'Itinerary Created', userRole: 'system', timestamp: new Date().toISOString() }],
  stepperStatus: { intro: 'incomplete', routing: 'locked', createDay: 'locked', review: 'locked', costing: 'locked', preview: 'locked' },
  companyMarkup: 0, startDate: function (startDate: any): unknown { throw new Error('Function not implemented.'); }
};

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000); 
  }, []);

  useEffect(() => {
    const init = async () => {
      const editingId = sessionStorage.getItem('editing_itinerary_id');
      if (editingId) {
        await loadItineraryForEdit(editingId);
        sessionStorage.removeItem('editing_itinerary_id');
      } else {
        loadSavedItinerary();
      }
    };
    init();
  }, []);

  const updateItineraryData = useCallback((data: Partial<ItineraryData>) => {
    setItineraryData(prev => ({ ...prev, ...data }));
  }, []);

  const updateRoutingData = useCallback((routingData: RoutingData) => {
    setItineraryData(prev => {
      if (JSON.stringify(prev.routingData) === JSON.stringify(routingData)) return prev;
      return { ...prev, routingData };
    });
  }, []);

  const logAction = useCallback((action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS', module: string, details: string, userRole: string, isMajor = false) => {
    setItineraryData(prev => {
      const [major, minor] = (prev.currentVersion || '1.0').split('.').map(Number);
      const newVersion = isMajor ? `${major + 1}.0` : `${major}.${(minor || 0) + 1}`;
      const newLog: AuditLogEntry = { version: newVersion, action, module, details, userRole, timestamp: new Date().toISOString() };
      const updated = { ...prev, currentVersion: newVersion, auditLog: [newLog, ...(prev.auditLog || [])] };
      saveItineraryToStorage(updated);
      return updated;
    });
  }, []);

  const completeStep = useCallback((step: keyof StepperStatus) => {
    setItineraryData(prev => {
        const newStatus = { ...prev.stepperStatus };
        newStatus[step] = 'completed';
        if (step === 'intro') newStatus.routing = 'unlocked';
        if (step === 'routing') newStatus.createDay = 'unlocked';
        if (step === 'createDay') newStatus.costing = 'unlocked'; 
        const updatedData = { ...prev, stepperStatus: newStatus };
        saveItineraryToStorage(updatedData);
        return updatedData;
    });
  }, []);

  // 🌟 DB-AWARE WORKFLOW ACTIONS 🌟
  const submitForCosting = useCallback(async () => {
      const [major] = (itineraryData.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Submitted Itinerary for Costing', userRole: 'Agent / Employee', timestamp: new Date().toISOString() };

      const updated = { ...itineraryData, status: 'pending_costing' as ItineraryStatus, currentVersion: newVersion, auditLog: [newLog, ...(itineraryData.auditLog || [])] };
      
      setItineraryData(updated);
      saveItineraryToStorage(updated);
      await saveToLibrary(updated);
      showToast("Request sent to Admin! Waiting for approval.", "success");
  }, [itineraryData, showToast]);

  const approveCosting = useCallback(async () => {
      const [major] = (itineraryData.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Costing Approved & Finalized', userRole: 'Admin', timestamp: new Date().toISOString() };
      const newStepper = { ...itineraryData.stepperStatus, costing: 'completed', preview: 'unlocked' } as StepperStatus;

      const updated = { ...itineraryData, status: 'approved' as ItineraryStatus, stepperStatus: newStepper, currentVersion: newVersion, auditLog: [newLog, ...(itineraryData.auditLog || [])] };
      
      setItineraryData(updated);
      saveItineraryToStorage(updated);
      await saveToLibrary(updated);
      showToast("Costing Approved! Employee can now see Preview.", "success");
  }, [itineraryData, showToast]);

  const rejectCosting = useCallback(async (reason: string) => {
      const [major] = (itineraryData.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: `Admin requested changes: "${reason}"`, userRole: 'Admin', timestamp: new Date().toISOString() };

      const updated = { ...itineraryData, status: 'draft' as ItineraryStatus, adminComment: reason, currentVersion: newVersion, auditLog: [newLog, ...(itineraryData.auditLog || [])] };
      
      setItineraryData(updated);
      saveItineraryToStorage(updated);
      await saveToLibrary(updated);
      showToast("Returned to Employee for changes.", "error");
  }, [itineraryData, showToast]);

  const revertToPending = useCallback(async () => {
      const [major] = (itineraryData.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Unlocked Costing (Reverted to Pending)', userRole: 'Admin', timestamp: new Date().toISOString() };

      const updated = { ...itineraryData, status: 'pending_costing' as ItineraryStatus, currentVersion: newVersion, auditLog: [newLog, ...(itineraryData.auditLog || [])] };
      
      setItineraryData(updated);
      saveItineraryToStorage(updated);
      await saveToLibrary(updated);
      showToast("Costing Unlocked for corrections.", "success");
  }, [itineraryData, showToast]);

  const requestReEdit = useCallback(async (reason: string) => {
      const [major] = (itineraryData.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: `Requested Re-Edit: "${reason}"`, userRole: 'Agent / Employee', timestamp: new Date().toISOString() };

      const updated = { ...itineraryData, status: 'reedit_requested' as ItineraryStatus, reEditReason: reason, currentVersion: newVersion, auditLog: [newLog, ...(itineraryData.auditLog || [])] };
      
      setItineraryData(updated);
      saveItineraryToStorage(updated);
      await saveToLibrary(updated);
      showToast("Re-edit request sent to Admin.", "success");
  }, [itineraryData, showToast]);

  const allowReEdit = useCallback(async () => {
      const [major] = (itineraryData.currentVersion || '1.0').split('.').map(Number);
      const newVersion = `${major + 1}.0`;
      const newLog: AuditLogEntry = { version: newVersion, action: 'STATUS', module: 'System', details: 'Granted Re-Edit Request (Unlocked)', userRole: 'Admin', timestamp: new Date().toISOString() };

      const updated = { ...itineraryData, status: 'draft' as ItineraryStatus, reEditReason: undefined, adminComment: "Re-edit request granted. Please make your changes.", currentVersion: newVersion, auditLog: [newLog, ...(itineraryData.auditLog || [])] };
      
      setItineraryData(updated);
      saveItineraryToStorage(updated);
      await saveToLibrary(updated);
      showToast("Itinerary unlocked for Employee.", "success");
  }, [itineraryData, showToast]);

  // 🌟 STORAGE HANDLERS 🌟
  const loadSavedItinerary = () => {
    const savedData = loadItineraryFromStorage();
    if (savedData) {
      const mergedData = { ...DEFAULT_ITINERARY, ...savedData } as ItineraryData;
      if(!mergedData.stepperStatus) mergedData.stepperStatus = DEFAULT_ITINERARY.stepperStatus;
      if(!mergedData.status) mergedData.status = 'draft';
      setItineraryData(mergedData);
    } else {
      setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
    }
  };

  const loadItineraryForEdit = async (id: string): Promise<boolean> => {
    const data = await getItineraryById(id);
    if (data) {
      const raw = { ...DEFAULT_ITINERARY, ...data } as any;
      const allowedStatuses = ['draft', 'pending_costing', 'approved', 'active', 'archived'];
      const normalizedStatus = allowedStatuses.includes(raw.status) ? raw.status : 'draft';
      const normalizedStepper = raw.stepperStatus ?? DEFAULT_ITINERARY.stepperStatus;

      const mergedData: ItineraryData = { ...DEFAULT_ITINERARY, ...raw, status: normalizedStatus, stepperStatus: normalizedStepper };

      setItineraryData(mergedData);
      saveItineraryToStorage(mergedData);
      return true;
    }
    return false;
  };

  const clearSavedItinerary = () => {
    clearItineraryStorage();
    setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
  };

  const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
    setIsSaving(true);
    try {
      const dataToSave = { ...itineraryData, selectedCurrency: itineraryData.selectedCurrency || 'USD' };
      
      // Save locally first so UI feels fast
      saveItineraryToStorage(dataToSave);
      
      // Save to DB
      if (type === 'exit' || itineraryData.id) {
        await saveToLibrary(dataToSave);
        // Important: If it's a new trip, DB assigns an ID. Sync it.
        if (dataToSave.id && !itineraryData.id) {
           setItineraryData(prev => ({ ...prev, id: dataToSave.id }));
        }
      }

      if (type === 'exit') clearItineraryStorage();
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      showToast("Itinerary saved successfully!", "success");
      return true;
    } catch (e) {
      console.error(e);
      showToast("Failed to save itinerary.", "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ItineraryContext.Provider value={{
      itineraryData, updateItineraryData, updateRoutingData, saveItinerary, loadSavedItinerary, loadItineraryForEdit, clearSavedItinerary,
      completeStep, submitForCosting, approveCosting, rejectCosting, revertToPending, requestReEdit, allowReEdit, logAction,
      toastMessage, showToast, isSaving, saveSuccess
    }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (context === undefined) throw new Error('useItinerary must be used within Provider');
  return context;
}