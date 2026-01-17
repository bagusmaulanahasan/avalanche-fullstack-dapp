'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useSwitchChain,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { avalancheFuji } from 'wagmi/chains';

const CONTRACT_ADDRESS: `0x${string}` = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || undefined;

const LOCK_ABI = [
  {
    "inputs": [],
    "name": "value",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_value", "type": "uint256" }],
    "name": "setValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { switchChain, isPending: isSwitchingNetwork } = useSwitchChain();

  const [inputValue, setInputValue] = useState('');

  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LOCK_ABI,
    functionName: 'value',
  });

  const {
    writeContract,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const handleSetValue = async () => {
    if (!inputValue) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: LOCK_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
    });
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-4 relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse-slow delay-700"></div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden z-10 relative">

        <div className="bg-slate-100/50 p-6 border-b border-slate-200 text-center backdrop-blur-sm">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Avalanche dApp
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Short Course Project • Fuji Testnet</p>
        </div>

        <div className="p-8 space-y-8">
          {writeError && (
            <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-600 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{writeError.message.slice(0, 50)}...</span>
            </div>
          )}

          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={isConnecting}
              className="w-full group relative px-6 py-3 font-bold text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 transition-all group-hover:brightness-110"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isConnecting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 001 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0115 5.293V4.5A1.5 1.5 0 0013.5 3h-11zM15 6.913l-6.598 3.185c-.438.211-.966.211-1.404 0L1 6.913v4.337a1.5 1.5 0 001.5 1.5h11a1.5 1.5 0 001.5-1.5V6.913z" clipRule="evenodd" /></svg>
                )}
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </span>
            </button>
          ) : (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Connected
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-slate-500 hover:text-red-500 transition-colors font-medium underline underline-offset-2"
                >
                  Disconnect
                </button>
              </div>
              <p className="font-mono text-xs text-slate-600 break-all bg-white p-2.5 rounded-lg border border-blue-100 shadow-sm">
                {address}
              </p>
            </div>
          )}

          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Current Value</p>

            <div className="relative group cursor-default">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-white ring-1 ring-slate-200 rounded-2xl p-6 flex items-center justify-center min-h-[100px] shadow-sm">
                {isReading ? (
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-800 drop-shadow-sm">
                    {value?.toString() ?? '0'}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => refetch()}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.43l-.31-.31a7 7 0 00-11.712 3.138.75.75 0 001.449.39 5.5 5.5 0 019.201-2.466l.312.311h-2.433a.75.75 0 000 1.5h4.242z" clipRule="evenodd" /></svg>
              Refresh Data
            </button>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-200">
            
            {isConnected && chainId !== avalancheFuji.id && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-amber-800">
                    <p className="font-bold text-sm">Unsupported Network</p>
                    <p className="text-xs mt-1">
                      Aplikasi ini berjalan di <strong>Avalanche Fuji</strong>. 
                      Klik tombol di bawah untuk pindah jaringan agar bisa melakukan update data.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => switchChain({ chainId: avalancheFuji.id })}
                  disabled={isSwitchingNetwork}
                  className="mt-3 w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  {isSwitchingNetwork ? 'Switching...' : 'Switch to Fuji Network 🔀'}
                </button>
              </div>
            )}

            <div className="relative">
              <label className="sr-only">New Value</label>
              <input
                type="number"
                placeholder="Enter a new number..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isConnected && chainId !== avalancheFuji.id}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-center font-bold text-xl shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={handleSetValue}
              disabled={isWriting || !inputValue || (isConnected && chainId !== avalancheFuji.id)}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
            >
              {isWriting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                <>
                  Update Value
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-3 text-center border-t border-slate-200">
          <p className="text-[11px] text-slate-500 font-medium">
            Secure dApp powered by Avalanche & Wagmi
          </p>
        </div>

      </div>
    </main>
  );
}