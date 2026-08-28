
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

import React, { createContext, useContext, useState, useEffect, useCallback , useRef } from 'react';
import { saveItineraryToStorage, loadItineraryFromStorage, clearItineraryStorage, saveToLibrary, getItineraryById, StoredItineraryData, RoutingData } from '@/utils/itineraryStorage';

export type ItineraryStatus = 'draft' | 'pending_costing' | 'approved' | 'reedit_requested' | 'active' | 'archived';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export interface StepperStatus { intro: 'completed' | 'incomplete'; routing: 'locked' | 'unlocked' | 'completed'; createDay: 'locked' | 'unlocked' | 'completed'; review: 'locked' | 'unlocked' | 'completed'; costing: 'locked' | 'unlocked' | 'completed'; preview: 'locked' | 'unlocked' | 'completed'; }
export interface AuditLogEntry { version: string; action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS'; module: string; details: string; userRole: string; timestamp: string; }

export interface ItineraryData extends Omit<StoredItineraryData, 'status'> {
  includedOptionals: never[];
  companyMarkup: number; tripCategory: string; tripExperience: string; stepperStatus: StepperStatus; status: ItineraryStatus; currentVersion: string; auditLog: AuditLogEntry[];
}

interface ItineraryContextType {
  itineraryData: ItineraryData;
  updateItineraryData: (data: Partial<ItineraryData>) => void;
  updateRoutingData: (routingData: RoutingData) => void;
  saveItinerary: (type: 'quick' | 'full' | 'exit') => Promise<boolean>;
  // saveItinerary: (type: 'quick' | 'full' | 'exit', options?: { silent?: boolean }) => Promise<boolean>;
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
  saveStatus: SaveStatus;
  logAction: (action: 'ADD' | 'EDIT' | 'DELETE' | 'STATUS', module: string, details: string, userRole: string, isMajor?: boolean) => void;

  reorderDays: (startIndex: number, endIndex: number) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

const DEFAULT_ITINERARY: ItineraryData = {
  _id: '',
  tripId: '', numberOfTravelers: 2, isMasterItinerary: false, tripName: '', tripType: '', tripStyle: '', packageType: 'land', creatingFor: 'guest', showFlightDetails: false, showTravelerDetails: true, selectedCountries: [], selectedCurrency: 'USD', flights: [], travelers: [], agentTravelers: [], routingData: undefined, dayWiseActivities: [], tripCategory: '', tripExperience: '', status: 'draft', currentVersion: '1.0',
  auditLog: [{ version: '1.0', action: 'STATUS', module: 'System', details: 'Itinerary Created', userRole: 'system', timestamp: new Date().toISOString() }],
  stepperStatus: { intro: 'incomplete', routing: 'locked', createDay: 'locked', review: 'locked', costing: 'locked', preview: 'locked' },
  companyMarkup: 0, startDate: function (startDate: any): unknown { throw new Error('Function not implemented.'); },
  includedOptionals: []
};

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [itineraryData, setItineraryData] = useState<ItineraryData>(DEFAULT_ITINERARY);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
  //   setToastMessage({ message, type });
  //   setTimeout(() => setToastMessage(null), 3000); 
  // }, []);

  // useEffect(() => {
  //   const init = async () => {
  //     const editingId = sessionStorage.getItem('editing_itinerary_id');
  //     if (editingId) {
  //       await loadItineraryForEdit(editingId);
  //       sessionStorage.removeItem('editing_itinerary_id');
  //     } else {
  //       loadSavedItinerary();
  //     }
  //   };
  //   init();
  // }, []);


    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000); 
  }, []);

  // 🔧 NEW: single-flight guard so two saves never race each other and
  // create duplicate documents. autosaveTimerRef holds the debounce timer.
  // const isSavingRef = useRef(false);
  // const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const pendingAutosaveRef = useRef(false);
  // const isInitialLoadRef = useRef(true);

  // useEffect(() => {
  //   const init = async () => {
  //     const editingId = sessionStorage.getItem('editing_itinerary_id');
  //     if (editingId) {
  //       await loadItineraryForEdit(editingId);
  //       sessionStorage.removeItem('editing_itinerary_id');
  //     } else {
  //       loadSavedItinerary();
  //     }
  //     // 🔧 NEW: allow autosave to start only AFTER the initial load finishes,
  //     // so loading an existing trip for edit doesn't immediately re-trigger a save.
  //     isInitialLoadRef.current = false;
  //   };
  //   init();
  // }, []);


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

  // 🔧 NEW: DEBOUNCED SILENT AUTOSAVE
  // Fires ~2s after the user stops changing anything. Silent (no toast/spinner).
  // Guards: skip during initial load, skip if there's nothing worth saving yet,
  // and never run two saves concurrently (queues instead).
  // useEffect(() => {
  //   if (isInitialLoadRef.current) return;
  //   if (!itineraryData.tripName) return; // nothing meaningful to save yet

  //   if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

  //   autosaveTimerRef.current = setTimeout(async () => {
  //     if (isSavingRef.current) {
  //       // a save is already running — mark that another one is needed once it's done
  //       pendingAutosaveRef.current = true;
  //       return;
  //     }
  
  //     isSavingRef.current = true;
  //     try {
  //       await saveItinerary('quick', { silent: true }); // 🔧 CHANGED: silent autosave
  //     } finally {
  //       isSavingRef.current = false;
  //       if (pendingAutosaveRef.current) {
  //         pendingAutosaveRef.current = false;
  //         isSavingRef.current = true;
  //         try { await saveItinerary('quick', { silent: true }); } finally { isSavingRef.current = false; } // 🔧 CHANGED
  //       }
  //     }
  //   }, 2000);

  //   return () => {
  //     if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [itineraryData]);



  // 🌟 INDUSTRY STANDARD: EMERGENCY BACKUP & TAB PROTECTION 🌟
  useEffect(() => {
    // 1. Emergency Browser Backup (Saves every keystroke locally)
    if (itineraryData.tripName || itineraryData.id) {
        localStorage.setItem('emergency_itinerary_backup', JSON.stringify(itineraryData));
    }

    // 2. Tab Close Protection (Browser Warning)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (itineraryData.tripName && !saveSuccess) {
            e.preventDefault();
            e.returnValue = ''; // Triggers the browser's "Are you sure you want to leave?" popup
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [itineraryData, saveSuccess]);

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


  // 🌟 NEW: GLOBAL DRAG AND DROP REORDER LOGIC (SYNCED WITH ROUTING) 🌟
  const reorderDays = useCallback((startIndex: number, endIndex: number) => {
    setItineraryData(prev => {
      if (!prev.dayWiseActivities || prev.dayWiseActivities.length === 0) return prev;
      
      // 1. Reorder the days array
      const newDays = Array.from(prev.dayWiseActivities);
      const [movedDay] = newDays.splice(startIndex, 1);
      newDays.splice(endIndex, 0, movedDay);

      // 2. Re-index Day Numbers and Dates chronologically
      let runningDate = prev.routingData?.startDate ? new Date(prev.routingData.startDate) : new Date();

      const updatedDays = newDays.map((plan, index) => {
        const dateString = (prev.routingData?.startDate && !prev.isMasterItinerary)
            ? runningDate.toISOString().split('T')[0] : '';
        
        if (prev.routingData?.startDate && !prev.isMasterItinerary) {
            runningDate.setDate(runningDate.getDate() + 1);
        }
        return { ...plan, dayNumber: index + 1, date: dateString };
      });

      // 3. ✨ REBUILD ROUTING DATA ✨ (This prevents the disconnect in Routing/Create Day pages!)
      const newRoutes: any[] = [];
      if (updatedDays.length > 1) {
          let currentCity = updatedDays[0].city;
          let currentNights = 0;

          // Loop through to group cities back into nights (e.g., Rome x2)
          for (let i = 0; i < updatedDays.length - 1; i++) {
              const plan = updatedDays[i];
              if (plan.city === currentCity) {
                  currentNights++;
              } else {
                  newRoutes.push({ id: Date.now() + i, cities: [{ name: currentCity, type: 'city' }], nights: currentNights, transportMode: 'vehicle' });
                  currentCity = plan.city;
                  currentNights = 1;
              }
          }
          if (currentNights > 0) {
             newRoutes.push({ id: Date.now() + 1000, cities: [{ name: currentCity, type: 'city' }], nights: currentNights, transportMode: 'vehicle' });
          }
      }

      // 4. Save BOTH the new days AND the new routing to the global database
      const updatedItinerary = { 
          ...prev, 
          dayWiseActivities: updatedDays,
          routingData: {
              ...(prev.routingData || {}),
              routes: newRoutes.length > 0 ? newRoutes : (prev.routingData?.routes || [])
          } as any
      };
      
      saveItineraryToStorage(updatedItinerary);
      return updatedItinerary;
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

  // const clearSavedItinerary = () => {
  //   clearItineraryStorage();
  //   setItineraryData({ ...DEFAULT_ITINERARY, tripId: `TRIP-${Date.now().toString().slice(-6)}` });
  // };


  const clearSavedItinerary = () => {
    // 1. Check for abandoned emergency backup
    const backup = localStorage.getItem('emergency_itinerary_backup');
    
    if (backup) {
      try {
        const parsedBackup = JSON.parse(backup);
        // Only prompt if there is actual data (like a trip name or days added)
        if (parsedBackup.tripName || (parsedBackup.dayWiseActivities && parsedBackup.dayWiseActivities.length > 0)) {
            const wantsToRecover = window.confirm(`We found an unsaved itinerary draft for "${parsedBackup.tripName || 'Untitled'}". Would you like to recover it?\n\nClick OK to recover, or Cancel to discard it and start fresh.`);
            
            if (wantsToRecover) {
              setItineraryData(parsedBackup);
              saveItineraryToStorage(parsedBackup);
              return; // Stop here, load the backup!
            }
        }
      } catch (e) {
        console.error("Failed to parse backup", e);
      }
    }

    // 2. If they clicked Cancel (or no backup exists), wipe safely
    localStorage.removeItem('emergency_itinerary_backup');
    clearItineraryStorage();
 

    // 3. 🌟 THE FIX: Give it a Database Anchor (id), but leave the visual Trip ID BLANK!
    const newId = `TRIP-${Date.now().toString()}`;
    setItineraryData({ 
        ...DEFAULT_ITINERARY, 
        id: newId, // The hidden database anchor (Keep this!)
        tripId: '', // 👈 GLITCH FIXED: No more random numbers. Leave it blank until a country is chosen!
        status: 'draft'
    });
  };



  // const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
  //   setIsSaving(true);
  //   try {
  //     let finalStatus = itineraryData.status;

  //     // 👇 THE MAGIC STEP: If they click "Save & Exit" on a Master Template, 
  //     // publish it so it moves out of Drafts and into the Master Templates tab!
  //     if (type === 'exit' && itineraryData.isMasterItinerary && itineraryData.status === 'draft') {
  //         finalStatus = 'active';
  //     }

  //     const dataToSave = { 
  //         ...itineraryData, 
  //         status: finalStatus, // Use the new status
  //         selectedCurrency: itineraryData.selectedCurrency || 'USD' 
  //     };
      
  //     // Save locally first so UI feels fast
  //     saveItineraryToStorage(dataToSave);
      
  //     // Save to DB
  //     if (type === 'exit' || itineraryData.id) {
  //       await saveToLibrary(dataToSave);
  //       // Sync ID if the DB created a new one
  //       if (dataToSave.id && !itineraryData.id) {
  //          setItineraryData(prev => ({ ...prev, id: dataToSave.id }));
  //       }
  //     }

  //     if (type === 'exit') {
  //         clearItineraryStorage();
  //         localStorage.removeItem('emergency_itinerary_backup'); // Clear backup
  //     }
      
  //     setSaveSuccess(true);
  //     setTimeout(() => setSaveSuccess(false), 2000);
  //     showToast("Itinerary saved successfully!", "success");
  //     return true;
  //   } catch (e) {
  //     console.error(e);
  //     showToast("Failed to save itinerary.", "error");
  //     return false;
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };



  //   const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
  //   setIsSaving(true);
  //   try {
  //     let finalStatus = itineraryData.status;


  //   //   const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
  //   // // 🔧 NEW: cancel any pending autosave timer the instant a manual save
   
  //   // if (autosaveTimerRef.current) {
  //   //   clearTimeout(autosaveTimerRef.current);
  //   //   autosaveTimerRef.current = null;
  //   // }

  //   // setIsSaving(true);
  //   // try {
  //   //   let finalStatus = itineraryData.status;

  //   //   const saveItinerary = async (type: 'quick' | 'full' | 'exit', options?: { silent?: boolean }): Promise<boolean> => {
  //   // const silent = options?.silent === true; // 🔧 NEW

  //   // if (autosaveTimerRef.current) {
  //   //   clearTimeout(autosaveTimerRef.current);
  //   //   autosaveTimerRef.current = null;
  //   // }

  //   // 🔧 CHANGED: only toggle the button spinner for non-silent (manual) saves
  //   // if (!silent) setIsSaving(true);
  //   // setSaveStatus('saving'); // pill can still reflect this even when silent
  //   // try {
  //   //   let finalStatus = itineraryData.status;

  //     // 👇 THE MAGIC STEP: If they click "Save & Exit" on a Master Template, 
  //     // publish it so it moves out of Drafts and into the Master Templates tab!
  //     if (type === 'exit' && itineraryData.isMasterItinerary && itineraryData.status === 'draft') {
  //         finalStatus = 'active';
  //     }

  //     const dataToSave = { 
  //         ...itineraryData, 
  //         status: finalStatus, // Use the new status
  //         selectedCurrency: itineraryData.selectedCurrency || 'USD' 
  //     };
      
  //     // Save locally first so UI feels fast
  //     saveItineraryToStorage(dataToSave);
      
  //     // Save to DB
  //     if (type === 'exit' || itineraryData.id) {
  //       // 🔧 CHANGED: saveToLibrary now returns { success, id } instead of boolean —
  //       // capture the result so we can sync the REAL Mongo id back into React state.
  //       const result = await saveToLibrary(dataToSave);

  //       // 🔧 CHANGED: this is the actual bug fix — previously the real Mongo id
  //       // returned from the backend was only ever written to `dataToSave` (a
  //       // throwaway local copy) and localStorage, and NEVER pushed into the
  //       // itineraryData state that the rest of the app (and the Library page)
  //       // reads from. That's why the first save always looked "wrong" until a
  //       // second save (via Edit) accidentally picked up the real id.
  //       if (result.success && result.id) {
  //          setItineraryData(prev => ({ ...prev, id: result.id }));
  //          // keep the local draft copy consistent with the confirmed DB id too
  //          saveItineraryToStorage({ ...dataToSave, id: result.id });
  //       }

  //       if (!result.success) {
  //         showToast("Failed to save itinerary.", "error");
  //         return false;
  //       }
  //     }

  //     if (type === 'exit') {
  //         clearItineraryStorage();
  //         localStorage.removeItem('emergency_itinerary_backup'); // Clear backup
  //     }
      
  // //     setSaveSuccess(true);
  // //     setTimeout(() => setSaveSuccess(false), 2000);
  // //     showToast("Itinerary saved successfully!", "success");
  // //     return true;
  // //   } catch (e) {
  // //     console.error(e);
  // //     showToast("Failed to save itinerary.", "error");
  // //     return false;
  // //   } finally {
  // //     setIsSaving(false);
  // //   }
  // // };


  //       // 🔧 CHANGED: saveSuccess still updates (used by the tab-close warning),
  //     // but the toast only fires for non-silent (manual) saves.
  //     setSaveSuccess(true);
  //     setTimeout(() => setSaveSuccess(false), 2000);
  //     setSaveStatus('saved');
  //     setTimeout(() => setSaveStatus('idle'), 2000);
  //     if (!silent) showToast("Itinerary saved successfully!", "success");
  //     return true;
  //   } catch (e) {
  //     console.error(e);
  //     setSaveStatus('error');
  //     // 🔧 CHANGED: still show the error toast even when silent — a FAILED
  //     // autosave is worth interrupting the user for, since it's the one case
  //     // where staying silent could cause real data loss without them knowing.
  //     showToast("Failed to save itinerary.", "error");
  //     return false;
  //   } finally {
  //     if (!silent) setIsSaving(false);
  //   }
  // };
  



    const saveItinerary = async (type: 'quick' | 'full' | 'exit'): Promise<boolean> => {
    setIsSaving(true);
    try {
      let finalStatus = itineraryData.status;

      if (type === 'exit' && itineraryData.isMasterItinerary && itineraryData.status === 'draft') {
          finalStatus = 'active';
      }

      const dataToSave = {
          ...itineraryData,
          status: finalStatus,
          selectedCurrency: itineraryData.selectedCurrency || 'USD'
      };

      saveItineraryToStorage(dataToSave);

      if (type === 'exit' || itineraryData.id) {
        const result = await saveToLibrary(dataToSave);

        // Sync the real Mongo _id back into state — this is the fix that
        // makes the Trip ID show correctly on the very first Save & Exit,
        // and makes any later save on the same trip correctly UPDATE
        // instead of creating a duplicate.
        if (result.success && result.id) {
           setItineraryData(prev => ({ ...prev, id: result.id }));
           saveItineraryToStorage({ ...dataToSave, id: result.id });
        }

        if (!result.success) {
          showToast("Failed to save itinerary.", "error");
          return false;
        }
      }

      if (type === 'exit') {
          clearItineraryStorage();
          localStorage.removeItem('emergency_itinerary_backup');
      }

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
      toastMessage, showToast, isSaving, saveSuccess ,saveStatus , reorderDays
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

// function setSaveStatus(arg0: string) {
//   throw new Error('Function not implemented.');
// }
