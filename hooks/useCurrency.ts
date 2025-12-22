// "use client";

// import { useState, useEffect, useCallback } from 'react';

// // Default Fallback Rates (in case API fails)
// const DEFAULT_RATES = {
//   INR: 1,
//   USD: 0.012,
//   EUR: 0.011,
//   GBP: 0.0095,
//   AED: 0.044,
// };

// export function useCurrency(baseCurrency = 'INR') {
//   const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
//   const [loading, setLoading] = useState(true);
//   const [currency, setCurrency] = useState('INR'); // Selected view currency

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {

//         const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY || 'fdb1ee0fbaf39f93b1988404';
     
// // NEW Line (Place your key after /v6/):
// const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
//         const data = await response.json();
//         setRates(data.rates);
//         setLoading(false);
//       } catch (error) {
//         console.error("Currency fetch failed, using defaults", error);
//         setLoading(false);
//       }
//     };

//     fetchRates();
//   }, [baseCurrency]);

//   // The Converter Function
//   const convert = useCallback((amountInBase: number, targetCurrency: string) => {
//     if (!amountInBase) return 0;
//     const rate = rates[targetCurrency] || 1;
//     return amountInBase * rate;
//   }, [rates]);

//   // Formatter
//   const formatPrice = (amount: number, curr: string) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: curr,
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   return { 
//     rates, 
//     loading, 
//     currency, 
//     setCurrency, 
//     convert, 
//     formatPrice 
//   };
// } 










// "use client";

// import { useState, useEffect, useCallback } from 'react';

// // Default Fallback Rates (Used if API fails)
// const DEFAULT_RATES: Record<string, number> = {
//   INR: 1,
//   USD: 0.012,
//   EUR: 0.011,
//   GBP: 0.0095,
//   AED: 0.044,
// };

// export function useCurrency(baseCurrency = 'INR') {
//   // Initialize with defaults so it's never undefined
//   const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
//   const [loading, setLoading] = useState(true);
//   const [currency, setCurrency] = useState('INR'); 

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//         // Use the key you provided
//         const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY || 'fdb1ee0fbaf39f93b1988404';
        
//         const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
        
//         if (!response.ok) {
//            console.warn("Currency API Error:", response.statusText);
//            setLoading(false);
//            return; // Stop here, keep default rates
//         }

//         const data = await response.json();

//         // SAFETY CHECK: Ensure the API actually returned rates before setting state
//         // V6 API returns 'conversion_rates', V4 returns 'rates'
//         const newRates = data.conversion_rates || data.rates;

//         if (newRates) {
//             setRates(newRates);
//         } else {
//             console.error("API returned data but no rates found:", data);
//         }
        
//       } catch (error) {
//         console.error("Currency fetch failed, using defaults", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRates();
//   }, [baseCurrency]);

//   // --- THE FIX IS HERE ---
//   const convert = useCallback((amountInBase: number, targetCurrency: string) => {
//     // 1. If amount is 0, return 0
//     if (!amountInBase) return 0;

//     // 2. SAFETY CHECK: If rates is somehow undefined, return base amount to prevent crash
//     if (!rates) return amountInBase;

//     // 3. Get rate (default to 1 if currency not found)
//     const rate = rates[targetCurrency] || 1;
    
//     return amountInBase * rate;
//   }, [rates]);

//   const formatPrice = (amount: number, curr: string) => {
//     try {
//       return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: curr,
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       }).format(amount);
//     } catch (e) {
//       // Fallback if currency code is invalid
//       return `${curr} ${amount.toFixed(0)}`;
//     }
//   };

//   return { 
//     rates, 
//     loading, 
//     currency, 
//     setCurrency, 
//     convert, 
//     formatPrice 
//   };
// } 


































"use client";

import { useState, useEffect, useCallback } from 'react';

// Default Fallback Rates (Used if API fails)
const DEFAULT_RATES: Record<string, number> = {
  USD: 1, // Base Currency
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
};

// CHANGE DEFAULT TO 'USD' HERE
export function useCurrency(baseCurrency = 'USD') {
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [loading, setLoading] = useState(true);
  
  // INITIALIZE WITH USD DIRECTLY
  const [currency, setCurrency] = useState('USD'); 

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY || 'fdb1ee0fbaf39f93b1988404';
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
        
        if (!response.ok) {
           console.warn("Currency API Error:", response.statusText);
           setLoading(false);
           return; 
        }

        const data = await response.json();
        const newRates = data.conversion_rates || data.rates;

        if (newRates) {
            setRates(newRates);
        }
      } catch (error) {
        console.error("Currency fetch failed, using defaults", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  const convert = useCallback((amountInBase: number, targetCurrency: string) => {
    if (!amountInBase) return 0;
    if (!rates) return amountInBase;

    // Safety: If target is same as base, return as is
    if (targetCurrency === 'USD') return amountInBase;

    if (!rates) return amountInBase;
    const rate = rates[targetCurrency] || 1;
    return amountInBase * rate;
  }, [rates]);

  const formatPrice = (amount: number, curr: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch (e) {
      return `${curr} ${amount.toFixed(0)}`;
    }
  };

  return { 
    rates, 
    loading, 
    currency, 
    setCurrency, 
    convert, 
    formatPrice 
  };
}