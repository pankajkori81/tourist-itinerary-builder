// import React from 'react';

// export default function LoadingScreen() {
//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0f172a]">
      
//       {/* Rolling Gradient Ring */}
//       <div className="relative w-16 h-16 mb-6">
//         {/* Outer spinning gradient */}
//         <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-transparent animate-spin"></div>
//         {/* Inner dark circle to create the "ring" effect */}
//         <div className="absolute inset-[4px] bg-[#0f172a] rounded-full"></div>
//       </div>

//       {/* Pulsing Gradient Text */}
//       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold tracking-widest uppercase text-sm animate-pulse">
//         Loading Workspace...
//       </span>
      
//     </div>
//   );
// }



// "use client";

// import React from 'react';

// export default function LoadingScreen() {
//   // We use 4 items to match the 4 circles in the animation
//   const circles = [0, 1, 2, 3];

//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] gap-10">
      
//       {/* --- UIVERSE ANIMATION --- */}
//       {/* We pass a custom CSS variable to easily control the color */}
//       <div className="flex justify-center items-center" style={{ '--loader-color': '#8b5cf6' } as React.CSSProperties}>
//         {circles.map((i) => (
//           <div
//             key={i}
//             className="relative flex items-center justify-center w-5 h-5 mx-2.5 border-2 rounded-full bg-transparent"
//             style={{
//               borderColor: 'var(--loader-color)',
//               animation: `circle-keys 2s ease-in-out infinite ${i * 0.3}s` // Dynamic delay
//             }}
//           >
//             {/* The Inner Dot */}
//             <div
//               className="absolute w-4 h-4 rounded-full"
//               style={{
//                 backgroundColor: 'var(--loader-color)',
//                 animation: `dot-keys 2s ease-in-out infinite ${i * 0.3}s` // Dynamic delay
//               }}
//             />
//             {/* The Expanding Outline */}
//             <div
//               className="absolute w-5 h-5 rounded-full"
//               style={{
//                 animation: `outline-keys 2s ease-in-out infinite ${0.9 + i * 0.3}s` // Offset delay
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* --- PULSING GRADIENT TEXT --- */}
//       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold tracking-widest uppercase text-sm animate-pulse">
//         Loading Workspace...
//       </span>

//       {/* --- CUSTOM KEYFRAMES --- */}
//       {/* We inject the complex animations directly into the component so it remains portable */}
//       <style dangerouslySetInnerHTML={{
//         __html: `
//         @keyframes circle-keys {
//           0% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.5); opacity: 0.5; }
//           100% { transform: scale(1); opacity: 1; }
//         }
        
//         @keyframes dot-keys {
//           0% { transform: scale(1); }
//           50% { transform: scale(0); }
//           100% { transform: scale(1); }
//         }
        
//         @keyframes outline-keys {
//           0% {
//             transform: scale(0);
//             outline: solid 20px var(--loader-color);
//             outline-offset: 0;
//             opacity: 1;
//           }
//           100% {
//             transform: scale(1);
//             outline: solid 0 transparent;
//             outline-offset: 20px;
//             opacity: 0;
//           }
//         }
//       `}} />
      
//     </div>
//   );
// } 











// "use client";

// import React from 'react';

// export default function LoadingScreen() {
//   // Define the 6 faces of the 3D cube and their specific 3D transforms
//   const cubeFaces = [
//     { id: 1, transform: 'rotateX(90deg) translateZ(50px)' },
//     { id: 2, transform: 'rotateX(-90deg) translateZ(50px)' },
//     { id: 3, transform: 'translateZ(50px)' },
//     { id: 4, transform: 'rotateY(90deg) translateZ(50px)' },
//     { id: 5, transform: 'rotateY(-90deg) translateZ(50px)' },
//     { id: 6, transform: 'rotateY(180deg) translateZ(50px)' },
//   ];

//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] gap-12">
      
//       {/* --- 3D CUBE LOADER --- */}
//       <div className="w-[100px] h-[100px] [perspective:600px]">
//         <div 
//           className="w-full h-full [transform-style:preserve-3d]"
//           style={{ animation: 'rotate-cube 4s linear infinite' }}
//         >
//           {cubeFaces.map((face) => (
//             <div
//               key={face.id}
//               className="absolute w-full h-full bg-gradient-to-tr from-[#3498db] to-[#e74c3c] opacity-80 border-[0.5px] border-white rounded-[25%] flex items-center justify-center shadow-inner"
//               style={{ transform: face.transform }}
//             >
//               {/* Added Travdek Text */}
//               <span className="text-white font-black text-sm tracking-wider drop-shadow-md">
//                 TRAVDEK
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- PULSING GRADIENT TEXT --- */}
//       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold tracking-widest uppercase text-sm animate-pulse mt-4">
//         Loading Workspace...
//       </span>

//       {/* --- CUSTOM KEYFRAMES --- */}
//       <style dangerouslySetInnerHTML={{
//         __html: `
//         @keyframes rotate-cube {
//           0% { transform: rotateX(0deg) rotateY(0deg); }
//           100% { transform: rotateX(360deg) rotateY(360deg); }
//         }
//       `}} />
      
//     </div>
//   );
// } 















"use client";

import React from 'react';

export default function LoadingScreen() {
  const cubeFaces = [
    { id: 1, transform: 'rotateX(90deg) translateZ(50px)' },
    { id: 2, transform: 'rotateX(-90deg) translateZ(50px)' },
    { id: 3, transform: 'translateZ(50px)' },
    { id: 4, transform: 'rotateY(90deg) translateZ(50px)' },
    { id: 5, transform: 'rotateY(-90deg) translateZ(50px)' },
    { id: 6, transform: 'rotateY(180deg) translateZ(50px)' },
  ];

  return (
    // 1. Darker base background to make the glowing gradients pop
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#05080f] z-0">
      
      {/* --- EYE-CATCHING BLURRED GRADIENT BACKGROUND (MESH GLOW) --- */}
      {/* Top Left Blue Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      
      {/* Bottom Right Rose/Red Glow (Matches the cube) */}
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-rose-600/20 blur-[120px] pointer-events-none"></div>
      
      {/* Center Pulsing Purple Glow */}
      <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none animate-pulse"></div>

      {/* --- CONTENT WRAPPER --- */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        
        {/* --- 3D CUBE LOADER --- */}
        <div className="w-[100px] h-[100px] [perspective:600px]">
          <div 
            className="w-full h-full [transform-style:preserve-3d]"
            style={{ animation: 'rotate-cube 4s linear infinite' }}
          >
            {cubeFaces.map((face) => (
              <div
                key={face.id}
                // Added a slight backdrop blur and inner shadow for a "glassmorphism" feel
                className="absolute w-full h-full bg-gradient-to-tr from-[#3498db] to-[#e74c3c] opacity-80 border-[0.5px] border-white/50 rounded-[25%] flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                style={{ transform: face.transform }}
              >
                <span className="text-white font-black text-sm tracking-wider drop-shadow-lg">
                  TRAVDEK
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- TEXT & POLISH --- */}
        <div className="flex flex-col items-center gap-3">
          {/* Updated gradient to include rose to tie the whole color scheme together */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 font-extrabold tracking-[0.2em] uppercase text-sm animate-pulse">
            Loading Workspace
          </span>
          
          {/* Added 3 tiny bouncing dots for extra UI polish */}
          <div className="flex gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

      </div>

      {/* --- CUSTOM KEYFRAMES --- */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes rotate-cube {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}} />
      
    </div>
  );
}