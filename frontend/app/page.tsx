"use client";

import { useState } from "react";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [hiringVolume, setHiringVolume] = useState("");

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCompany = async () => {
    setLoading(true);

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
      setResult(data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center">
          SaleSmart.AI
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">

          <input
            className="w-full border p-3 rounded"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Employee Count"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
          />

          <select
            className="w-full border p-3 rounded"
            value={hiringVolume}
            onChange={(e) => setHiringVolume(e.target.value)}
          >
            <option value="">Select Hiring Volume</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button
            onClick={analyzeCompany}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Analyze Company"}
          </button>
        </div>

        {result && (
          <div className="mt-10 space-y-6">

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-bold text-xl mb-2">
                Company Summary
              </h2>
              <p>{result.company_summary}</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-bold text-xl mb-2">
                Top Pain Points
              </h2>

              <ul className="list-disc pl-5">
                {result.top_pain_points.map(
                  (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-bold text-xl mb-2">
                ATS Features
              </h2>

              {result.ats_features.map(
                (feature: any, index: number) => (
                  <div key={index} className="mb-3">
                    <p className="font-semibold">
                      {feature.feature}
                    </p>
                    <p>{feature.solves}</p>
                  </div>
                )
              )}
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-bold text-xl mb-2">
                Discovery Questions
              </h2>

              <ul className="list-disc pl-5">
                {result.discovery_questions.map(
                  (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-bold text-xl mb-2">
                Sales Pitch
              </h2>

              <p>{result.sales_pitch}</p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}