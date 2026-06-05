"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Building2,
  Users,
  Briefcase,
  Play,
  Clipboard,
  Check,
  HelpCircle,
  Layers,
  ArrowRight,
  Award,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Building,
  Target
} from "lucide-react";

// Pre-configured industry templates for ease of use
const PRESETS = [
  {
    name: "MedTech Solutions",
    industry: "Healthcare Technology",
    employeeCount: "120",
    hiringVolume: "Medium",
    desc: "Fast-growing medical software provider"
  },
  {
    name: "Nova Retail Group",
    industry: "E-commerce & Retail",
    employeeCount: "1200",
    hiringVolume: "High",
    desc: "Enterprise multi-channel retailer"
  },
  {
    name: "Apex Heavy Industry",
    industry: "Manufacturing & Steel",
    employeeCount: "450",
    hiringVolume: "Low",
    desc: "Established production company"
  },
  {
    name: "Vortex Logistics",
    industry: "Logistics & Supply Chain",
    employeeCount: "85",
    hiringVolume: "Medium",
    desc: "Mid-market freight distributor"
  }
];

// Rotating loading phrases to make the wait feel interactive and professional
const LOADING_STEPS = [
  "Analyzing company demographics...",
  "Querying Gemini ATS intelligence model...",
  "Synthesizing industry recruiting pain-points...",
  "Mapping optimal software solutions & features...",
  "Drafting consultative discovery playbook...",
  "Perfecting the consultative sales pitch..."
];

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [hiringVolume, setHiringVolume] = useState("");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Copy success states
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState<number | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedAllQuestions, setCopiedAllQuestions] = useState(false);

  // Loading text animator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setCurrentStepIdx(0);
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setCompanyName(preset.name);
    setIndustry(preset.industry);
    setEmployeeCount(preset.employeeCount);
    setHiringVolume(preset.hiringVolume);
  };

  const analyzeCompany = async () => {
    if (!companyName || !industry || !employeeCount || !hiringVolume) {
      alert("Please fill in all target company parameters.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          industry,
          employee_count: Number(employeeCount),
          hiring_volume: hiringVolume,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setResult(data.data);
      } else {
        alert("Error in backend processing. Raw response: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the backend server. Please verify the FastAPI server is running on http://127.0.0.1:8000");
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string, type: "pitch" | "questions" | number) => {
    navigator.clipboard.writeText(text);
    if (type === "pitch") {
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    } else if (type === "questions") {
      setCopiedAllQuestions(true);
      setTimeout(() => setCopiedAllQuestions(false), 2000);
    } else {
      setCopiedQuestionIdx(type);
      setTimeout(() => setCopiedQuestionIdx(null), 2000);
    }
  };

  return (
    <main className="min-h-screen py-6 px-4 md:px-8 max-w-[1600px] mx-auto w-full flex flex-col justify-between">

      {/* Premium Header/Navbar */}
      <header className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800/80 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 border border-indigo-500/30 p-2.5 rounded-xl text-indigo-400">
            <Sparkles className="h-6 w-6 pulse-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              SaleSmart.ai
            </h1>
            <p className="text-xs text-zinc-400">ATS Consultative Sales Intelligence & Strategy Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Gemini Backend Connected
          </div>
          <span className="text-zinc-500 text-xs">v1.1</span>
        </div>
      </header>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">

        {/* Left Side: Configurator Panel */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl border-zinc-800/60 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2.5 mb-6">
              <Building className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-zinc-100">Target Profile Config</h2>
            </div>

            <div className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    placeholder="Enter company name..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Industry</label>
                <div className="relative">
                  <Target className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    placeholder="e.g. Healthcare Tech, Fintech..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
              </div>

              {/* Employee Count & Hiring Volume Group */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Employees</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="number"
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                      placeholder="e.g. 150"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Hiring Volume</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                    <select
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
                      value={hiringVolume}
                      onChange={(e) => setHiringVolume(e.target.value)}
                    >
                      <option value="" className="bg-zinc-950">Select</option>
                      <option value="Low" className="bg-zinc-950">Low</option>
                      <option value="Medium" className="bg-zinc-950">Medium</option>
                      <option value="High" className="bg-zinc-950">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trigger Button */}
              <button
                onClick={analyzeCompany}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Synthesizing Insights...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    Run Sales Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Presets Card */}
          <div className="glass-card p-5 rounded-2xl border-zinc-800/60 shadow-xl">
            <h3 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">Demo Sandbox Presets</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => loadPreset(p)}
                  className="w-full text-left p-3 rounded-xl border border-zinc-800/40 bg-zinc-900/40 hover:bg-indigo-600/10 hover:border-indigo-500/20 transition group flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-xs text-zinc-200 group-hover:text-indigo-400 transition">{p.name}</span>
                    <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400">{p.hiringVolume} Hiring</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1">{p.desc} ({p.industry})</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Outputs & Results Dashboard */}
        <section className="lg:col-span-8">

          {/* EMPTY STATE */}
          {!result && !loading && (
            <div className="glass-card p-12 rounded-2xl border-zinc-800/60 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="bg-indigo-600/15 p-4 rounded-full text-indigo-400 mb-5 border border-indigo-500/10">
                <Sparkles className="h-10 w-10 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">No Target Active</h3>
              <p className="text-sm text-zinc-400 max-w-md mb-8">
                Enter target client parameters on the left or select a sandbox preset to synthesize consultative recruiting metrics, competitive pain points, and target sales scripts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                  <div className="bg-rose-500/10 text-rose-400 p-2 rounded-lg w-fit mb-3">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 mb-1">Pain Point Diagnostics</h4>
                  <p className="text-[11px] text-zinc-400">Expose hidden ATS bottlenecks based on hiring metrics.</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                  <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg w-fit mb-3">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 mb-1">Discovery Playbook</h4>
                  <p className="text-[11px] text-zinc-400">Unlock high-converting qualitative questions for sales calls.</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                  <div className="bg-violet-500/10 text-violet-400 p-2 rounded-lg w-fit mb-3">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 mb-1">Consultative Pitch</h4>
                  <p className="text-[11px] text-zinc-400">Ready-made consultative pitches designed for senior buyers.</p>
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="glass-card p-8 rounded-2xl border-zinc-800/60 space-y-6 min-h-[460px] flex flex-col justify-center">
              <div className="flex flex-col items-center text-center space-y-4 mb-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full border-4 border-indigo-600/10 border-t-indigo-500 animate-spin"></div>
                  <Sparkles className="h-5 w-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pulse-glow" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-zinc-200">Generating Intelligence</h3>
                  <p className="text-xs text-indigo-400 font-mono tracking-wider animate-pulse uppercase">
                    {LOADING_STEPS[currentStepIdx]}
                  </p>
                </div>
              </div>

              {/* Skeleton structure simulating output layout */}
              <div className="space-y-4 pt-4">
                <div className="h-8 shimmer-skeleton rounded-lg w-1/3"></div>
                <div className="h-24 shimmer-skeleton rounded-xl w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 shimmer-skeleton rounded-xl"></div>
                  <div className="h-32 shimmer-skeleton rounded-xl"></div>
                </div>
              </div>
            </div>
          )}

          {/* RESULT STATE */}
          {result && (
            <div className="space-y-6 fade-in-slide">

              {/* Summary Dashboard Banner */}
              <div className="glass-card p-6 rounded-2xl border-zinc-800/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-48 w-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
                  <span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full font-semibold">
                    {industry}
                  </span>
                  <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {result.employee_count || employeeCount} Employees
                  </span>
                  <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> {result.hiring_volume || hiringVolume} Volume
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-zinc-100 mb-2">
                  {companyName} Intelligence Analysis
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {result.company_summary}
                </p>
              </div>

              {/* Grid: Pain Points and Solutions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Diagnostic Pain Points */}
                <div className="glass-card p-6 rounded-2xl border-zinc-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-rose-500/10 text-rose-400 p-2 rounded-lg">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-md text-zinc-200">Critical Pain Points</h4>
                    </div>

                    <div className="space-y-4">
                      {(result.top_pain_points || []).map((point: string, idx: number) => {
                        const matter = (result.why_it_matters || [])[idx] || "Impacting operational timelines and candidate conversion rates.";
                        return (
                          <div key={idx} className="border-l-2 border-rose-500/30 pl-3 py-0.5">
                            <h5 className="font-semibold text-xs text-zinc-200">{point}</h5>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-normal">{matter}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* recommended ATS Solutions */}
                <div className="glass-card p-6 rounded-2xl border-zinc-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">
                        <Layers className="h-4 w-4" />
                      </div>
                      <h4 className="font-bold text-md text-zinc-200">Value Positionings</h4>
                    </div>

                    <div className="space-y-4">
                      {(result.ats_features || []).map((feature: any, idx: number) => (
                        <div key={idx} className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full"></span>
                            <h5 className="font-bold text-xs text-emerald-400">{feature.feature}</h5>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-normal">{feature.solves}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* discovery playbooks Section */}
              <div className="glass-card p-6 rounded-2xl border-zinc-800/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/60 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500/10 text-amber-400 p-2 rounded-lg">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-md text-zinc-200">Consultative Discovery Playbook</h4>
                      <p className="text-[10px] text-zinc-500">Uncover operational limits using targeted qualifying prompts</p>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard((result.discovery_questions || []).join("\n"), "questions")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700/80 rounded-lg text-xs font-semibold text-zinc-300 transition cursor-pointer select-none"
                  >
                    {copiedAllQuestions ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied Playbook
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-3.5 w-3.5" />
                        Copy Playbook
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(result.discovery_questions || []).map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 p-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/30 hover:border-zinc-800 transition group"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-[11px] font-bold text-zinc-500 bg-zinc-800 h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{item}</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(item, idx)}
                        className="opacity-0 group-hover:opacity-100 transition shrink-0 p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        title="Copy Question"
                      >
                        {copiedQuestionIdx === idx ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Clipboard className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* sales pitch Card */}
              <div className="glass-card p-6 rounded-2xl border-zinc-800/60 relative overflow-hidden bg-gradient-to-br from-indigo-950/20 to-zinc-950">
                <div className="absolute -bottom-12 -right-12 h-36 w-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/20 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-500/15 text-indigo-400 p-2 rounded-lg border border-indigo-500/10">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-md text-indigo-300">Consultative Pitch</h4>
                      <p className="text-[10px] text-zinc-500">Hook recruitment stakeholders with customized metrics and value</p>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(result.sales_pitch, "pitch")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition cursor-pointer select-none shadow-md shadow-indigo-600/10"
                  >
                    {copiedPitch ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied Pitch
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-3.5 w-3.5" />
                        Copy Pitch
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/10 border border-indigo-900/30">
                  <p className="text-xs text-indigo-200 leading-relaxed font-medium italic">
                    "{result.sales_pitch}"
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-500 font-medium">
                  <Lightbulb className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Use this structured outline during cold email sequences or live outreach scripts.</span>
                </div>
              </div>

            </div>
          )}

        </section>

      </div>

      {/* Footer Branding */}
      <footer className="text-center border-t border-zinc-900 mt-12 pt-6 text-[10px] text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 SaleSmart.ai. Built with Next.js & Gemini 2.5 Flash. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-zinc-400 transition">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-zinc-400 transition">Privacy Operations</a>
        </div>
      </footer>

    </main>
  );
}