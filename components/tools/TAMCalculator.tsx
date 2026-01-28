"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateTAM, type TAMInputs, type TAMResults } from "@/lib/utils/calculations";
import { INDUSTRIES, COMMON_ROLES, COMPANY_SIZES, GEOGRAPHIC_FILTERS, DATA_SOURCES } from "@/lib/constants";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false });

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

export default function TAMCalculator() {
  const [inputs, setInputs] = useState<TAMInputs>({
    industries: [],
    roles: [],
    companySizes: [],
    geographicFilters: ["US"],
    dataSource: "LinkedIn",
    customMultiplier: undefined,
  });
  const [results, setResults] = useState<TAMResults | null>(null);
  const [customIndustry, setCustomIndustry] = useState("");
  const [customRole, setCustomRole] = useState("");

  const handleIndustryToggle = useCallback((industry: string) => {
    setInputs((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }));
  }, []);

  const handleRoleToggle = useCallback((role: string) => {
    setInputs((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  }, []);

  const handleCompanySizeToggle = useCallback((size: string) => {
    setInputs((prev) => ({
      ...prev,
      companySizes: prev.companySizes.includes(size)
        ? prev.companySizes.filter((s) => s !== size)
        : [...prev.companySizes, size],
    }));
  }, []);

  const addCustomIndustry = useCallback(() => {
    if (customIndustry.trim() && !inputs.industries.includes(customIndustry.trim())) {
      setInputs((prev) => ({
        ...prev,
        industries: [...prev.industries, customIndustry.trim()],
      }));
      setCustomIndustry("");
    }
  }, [customIndustry, inputs.industries]);

  const addCustomRole = useCallback(() => {
    if (customRole.trim() && !inputs.roles.includes(customRole.trim())) {
      setInputs((prev) => ({
        ...prev,
        roles: [...prev.roles, customRole.trim()],
      }));
      setCustomRole("");
    }
  }, [customRole, inputs.roles]);

  const calculate = useCallback(() => {
    if (inputs.industries.length === 0 || inputs.roles.length === 0 || inputs.companySizes.length === 0) {
      alert("Please select at least one industry, role, and company size");
      return;
    }

    const calculated = calculateTAM(inputs);
    setResults(calculated);
  }, [inputs]);

  const industryChartData = results
    ? Object.entries(results.breakdown.byIndustry).map(([industry, value]) => ({
        name: industry.replace(/_/g, " "),
        value: Math.round(value),
      }))
    : [];

  const roleChartData = results
    ? Object.entries(results.breakdown.byRole).map(([role, value]) => ({
        name: role.replace(/_/g, " "),
        value: Math.round(value),
      }))
    : [];

  const companySizeChartData = results
    ? Object.entries(results.breakdown.byCompanySize).map(([size, value]) => ({
        name: size,
        value: Math.round(value),
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">TAM Calculator</h1>
        <p className="text-muted-foreground">
          Calculate Total Addressable Market based on industry, roles, and company size.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Configure your market parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Industries</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => handleIndustryToggle(industry)}
                    className={`p-2 text-sm rounded border transition-colors ${
                      inputs.industries.includes(industry)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground"
                    }`}
                  >
                    {industry.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Custom industry..."
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomIndustry()}
                />
                <Button onClick={addCustomIndustry}>Add</Button>
              </div>
            </div>

            <div>
              <Label>Target Roles / Job Titles</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {COMMON_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleToggle(role)}
                    className={`p-2 text-sm rounded border transition-colors ${
                      inputs.roles.includes(role)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground"
                    }`}
                  >
                    {role.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Custom role..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomRole()}
                />
                <Button onClick={addCustomRole}>Add</Button>
              </div>
            </div>

            <div>
              <Label>Company Size (Employees)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleCompanySizeToggle(size)}
                    className={`p-2 text-sm rounded border transition-colors ${
                      inputs.companySizes.includes(size)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="geographic-filter">Geographic Filter</Label>
              <select
                id="geographic-filter"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                value={inputs.geographicFilters[0] || "US"}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, geographicFilters: [e.target.value] }))
                }
              >
                {GEOGRAPHIC_FILTERS.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="data-source">Data Source</Label>
              <select
                id="data-source"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                value={inputs.dataSource}
                onChange={(e) => setInputs((prev) => ({ ...prev, dataSource: e.target.value }))}
              >
                {DATA_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="custom-multiplier">Custom Multiplier (optional)</Label>
              <Input
                id="custom-multiplier"
                type="number"
                step="0.1"
                min="0.1"
                value={inputs.customMultiplier || ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    customMultiplier: e.target.value ? parseFloat(e.target.value) : undefined,
                  }))
                }
                placeholder="1.0"
              />
            </div>

            <Button onClick={calculate} className="w-full" size="lg">
              Calculate TAM
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Total Addressable Market Analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Estimated Reachable Market</p>
                  <p className="text-3xl font-bold text-primary">
                    {results.estimatedReachable.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Base Market Size</p>
                  <p className="text-2xl font-bold">{results.baseMarketSize.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Confidence Interval</p>
                  <p className="text-lg font-semibold text-primary">
                    {results.confidenceInterval.lower.toLocaleString()} - {results.confidenceInterval.upper.toLocaleString()}
                  </p>
                </div>
              </div>

              {industryChartData.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Market Size by Industry</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={industryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value) => (value ? Number(value).toLocaleString() : "0")} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {roleChartData.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Market Size by Role</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roleChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roleChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => (value ? Number(value).toLocaleString() : "0")} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {companySizeChartData.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Market Size by Company Size</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={companySizeChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => (value ? Number(value).toLocaleString() : "0")} />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

