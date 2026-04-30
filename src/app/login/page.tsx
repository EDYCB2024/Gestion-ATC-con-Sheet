"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // No credentials needed for now as requested
    router.push("/");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style jsx global>{`
        .precision-bg {
          background: radial-gradient(circle at 0% 0%, rgba(0, 74, 198, 0.03) 0%, transparent 50%),
                      radial-gradient(circle at 100% 100%, rgba(0, 74, 198, 0.05) 0%, transparent 50%);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] precision-bg font-sans selection:bg-primary/10">
        <main className="w-full max-w-md px-6 py-10">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4 flex items-center justify-center w-14 h-14 bg-[#004ac6] rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                point_of_sale
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#0b1c30] mb-1 tracking-tight">POS CRM</h1>
            <p className="text-sm font-medium text-[#434655] opacity-80">Precision Performance Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-[#c3c6d7] rounded-3xl p-10 shadow-xl shadow-blue-900/5">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-[#0b1c30]">Welcome Back</h2>
              <p className="text-sm text-[#434655] mt-2">Access your terminal dashboard</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#434655] opacity-70" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#737686] text-[20px]">mail</span>
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8f9ff]/50 border border-[#c3c6d7] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all placeholder:text-[#c3c6d7]"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#434655] opacity-70" htmlFor="password">
                    Password
                  </label>
                  <a className="text-xs font-bold text-[#004ac6] hover:underline transition-all" href="#">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#737686] text-[20px]">lock</span>
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-[#f8f9ff]/50 border border-[#c3c6d7] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition-all placeholder:text-[#c3c6d7]"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <input
                  className="w-4 h-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]"
                  id="remember"
                  type="checkbox"
                />
                <label className="text-sm text-[#434655] cursor-pointer select-none" htmlFor="remember">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                className="w-full py-4 px-6 bg-[#004ac6] text-white font-bold rounded-xl hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                type="submit"
              >
                Sign In
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </form>

            {/* Secondary Actions */}
            <footer className="mt-10 pt-6 border-t border-[#c3c6d7]/50 text-center">
              <p className="text-sm text-[#434655]">
                Authorized access only.{" "}
                <a className="text-[#004ac6] font-bold hover:underline" href="#">
                  Contact Support
                </a>
              </p>
            </footer>
          </div>

          {/* System Status Indicator */}
          <div className="mt-10 flex items-center justify-center gap-3 py-3 px-6 bg-[#eff4ff] rounded-full border border-[#c3c6d7]/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004ac6]"></span>
            </span>
            <span className="text-[10px] font-bold text-[#434655] uppercase tracking-widest">Global Terminals Operational</span>
          </div>
        </main>

        {/* Background Decorative Image */}
        <div className="fixed inset-0 -z-10 overflow-hidden opacity-[0.04] pointer-events-none">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCad1SGz7u2aVG8xLyXOvivXRsCtlLV4SE7Doa0UdfmltZFGz3g4Lbd1VtWjVRa-A_1UVv9AHz-xobloN7yNSP1dxMl4qrqHfTxSedGBULI0_bG1mygFGBuRrPE7K2cAQSYGj5dR_6X-8K8-Jkoo8zpXnOG9zWQ3qSDaOyU0LbjiD1hEjr5msTHGf3XdqAkfvjt8BQrtUvOzL4TDNqmJJ4mMxKW_EK_o3ng2Cq60VwSrBWc0UeWlLWsZ7Ejbo3a9vU_QP4JKLWjlCw"
            alt="Minimalist data center aesthetic"
          />
        </div>
      </div>
    </>
  );
}
