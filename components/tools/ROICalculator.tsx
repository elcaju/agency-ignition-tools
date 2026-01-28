"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateROI, type ROIInputs, type ROIResults } from "@/lib/utils/calculations";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

export default function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    leads: 10000,
    outreachFrequency: "monthly",
    campaignDuration: 3,
    openRate: 25,
    replyRate: 5,
    meetingBookedRate: 30,
    meetingShowRate: 80,
    dealCloseRate: 20,
    averageDealValue: 10000,
    contractLength: 12,
    customerLTV: undefined,
    costPerLead: 1,
    toolCosts: 200,
    timeCosts: 1000,
    otherExpenses: 500,
  });
  const [results, setResults] = useState<ROIResults | null>(null);

  const handleInputChange = useCallback(
    (field: keyof ROIInputs, value: string | number | undefined) => {
      setInputs((prev) => ({
        ...prev,
        [field]: typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value,
      }));
    },
    []
  );

  const calculate = useCallback(() => {
    const calculated = calculateROI(inputs);
    setResults(calculated);
  }, [inputs]);

  const funnelData = results
    ? [
        { name: "Leads", value: inputs.leads },
        { name: "Opens", value: results.funnelBreakdown.opens },
        { name: "Replies", value: results.funnelBreakdown.replies },
        { name: "Meetings Booked", value: results.funnelBreakdown.meetingsBooked },
        { name: "Meetings Shown", value: results.funnelBreakdown.meetingsShown },
        { name: "Deals Closed", value: results.funnelBreakdown.dealsClosed },
      ]
    : [];

  const costBreakdownData = results
    ? [
        {
          name: "Lead Costs",
          value: inputs.leads * inputs.costPerLead,
        },
        {
          name: "Tool Costs",
          value: inputs.toolCosts * inputs.campaignDuration,
        },
        {
          name: "Time Costs",
          value: inputs.timeCosts,
        },
        {
          name: "Other Expenses",
          value: inputs.otherExpenses,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ROI Calculator</h1>
        <p className="text-muted-foreground">
          Estimate ROI for outreach and lead gen campaigns with detailed funnel metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Inputs</CardTitle>
            <CardDescription>Enter your campaign parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Campaign Volume</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leads">Number of Leads/Contacts</Label>
                  <Input
                    id="leads"
                    type="number"
                    value={inputs.leads}
                    onChange={(e) => handleInputChange("leads", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Outreach Frequency</Label>
                  <select
                    id="frequency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={inputs.outreachFrequency}
                    onChange={(e) => handleInputChange("outreachFrequency", e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="duration">Campaign Duration (months)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={inputs.campaignDuration}
                    onChange={(e) =>
                      handleInputChange("campaignDuration", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Conversion Funnel Metrics (%)</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="open-rate">Email Open Rate (%)</Label>
                  <Input
                    id="open-rate"
                    type="number"
                    step="0.1"
                    value={inputs.openRate}
                    onChange={(e) => handleInputChange("openRate", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="reply-rate">Email Reply Rate (%)</Label>
                  <Input
                    id="reply-rate"
                    type="number"
                    step="0.1"
                    value={inputs.replyRate}
                    onChange={(e) => handleInputChange("replyRate", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="meeting-booked-rate">Meeting Booked Rate (%)</Label>
                  <Input
                    id="meeting-booked-rate"
                    type="number"
                    step="0.1"
                    value={inputs.meetingBookedRate}
                    onChange={(e) =>
                      handleInputChange("meetingBookedRate", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="meeting-show-rate">Meeting Show-up Rate (%)</Label>
                  <Input
                    id="meeting-show-rate"
                    type="number"
                    step="0.1"
                    value={inputs.meetingShowRate}
                    onChange={(e) =>
                      handleInputChange("meetingShowRate", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deal-close-rate">Deal Close Rate (%)</Label>
                  <Input
                    id="deal-close-rate"
                    type="number"
                    step="0.1"
                    value={inputs.dealCloseRate}
                    onChange={(e) =>
                      handleInputChange("dealCloseRate", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Deal Metrics</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deal-value">Average Deal Value (ACV)</Label>
                  <Input
                    id="deal-value"
                    type="number"
                    value={inputs.averageDealValue}
                    onChange={(e) =>
                      handleInputChange("averageDealValue", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contract-length">Contract Length (months)</Label>
                  <Input
                    id="contract-length"
                    type="number"
                    value={inputs.contractLength}
                    onChange={(e) =>
                      handleInputChange("contractLength", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ltv">Customer Lifetime Value (optional override)</Label>
                  <Input
                    id="ltv"
                    type="number"
                    value={inputs.customerLTV || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "customerLTV",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Costs</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cpl">Cost per Lead</Label>
                  <Input
                    id="cpl"
                    type="number"
                    step="0.01"
                    value={inputs.costPerLead}
                    onChange={(e) =>
                      handleInputChange("costPerLead", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tool-costs">Tool Costs (monthly)</Label>
                  <Input
                    id="tool-costs"
                    type="number"
                    value={inputs.toolCosts}
                    onChange={(e) => handleInputChange("toolCosts", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="time-costs">Time Costs (total)</Label>
                  <Input
                    id="time-costs"
                    type="number"
                    value={inputs.timeCosts}
                    onChange={(e) => handleInputChange("timeCosts", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="other-expenses">Other Expenses</Label>
                  <Input
                    id="other-expenses"
                    type="number"
                    value={inputs.otherExpenses}
                    onChange={(e) =>
                      handleInputChange("otherExpenses", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </div>

            <Button onClick={calculate} className="w-full" size="lg">
              Calculate ROI
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">
                      ${results.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Costs</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${results.totalCosts.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.roi > 0 ? "+" : ""}
                      {results.roi.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">ROI Multiple</p>
                    <p className="text-2xl font-bold text-foreground">
                      {results.roiMultiple.toFixed(2)}x
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue per Lead</p>
                    <p className="text-xl font-semibold">${results.revenuePerLead.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost per Acquisition</p>
                    <p className="text-xl font-semibold">${results.costPerAcquisition.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Break-even Leads</p>
                    <p className="text-xl font-semibold">{results.breakEvenLeads.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deals Closed</p>
                    <p className="text-xl font-semibold">
                      {results.funnelBreakdown.dealsClosed.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funnel Visualization</CardTitle>
                <CardDescription>Conversion drop-off at each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Distribution of campaign costs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

