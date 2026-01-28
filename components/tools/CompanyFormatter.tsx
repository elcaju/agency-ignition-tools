"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCompanyName, formatJobTitle, formatWithAI } from "@/lib/utils/formatter";
import { parseCSV, csvToString, downloadCSV } from "@/lib/utils/csvProcessor";

interface FormattedRow {
  original: string;
  formatted: string;
}

export default function CompanyFormatter() {
  const [mode, setMode] = useState<"free" | "ai">("free");
  const [apiKey, setApiKey] = useState("");
  const [inputData, setInputData] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [formattedData, setFormattedData] = useState<FormattedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataType, setDataType] = useState<"company" | "title">("company");

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }
    setInputFile(selectedFile);
    setInputData("");
    setError(null);
  }, []);

  const processData = useCallback(async () => {
    setIsProcessing(true);
    setError(null);
    setFormattedData([]);

    try {
      let lines: string[] = [];

      if (inputFile) {
        // Process CSV file
        const result = await parseCSV(inputFile);
        // Get the first column (assuming it's the column to format)
        lines = result.data.slice(1).map((row) => row[0] || "").filter(Boolean);
      } else if (inputData.trim()) {
        // Process pasted text
        lines = inputData
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
      } else {
        setError("Please provide input data");
        setIsProcessing(false);
        return;
      }

      const formatted: FormattedRow[] = [];

      if (mode === "free") {
        // Rule-based formatting
        for (const line of lines) {
          const formattedValue =
            dataType === "company" ? formatCompanyName(line) : formatJobTitle(line);
          formatted.push({ original: line, formatted: formattedValue });
        }
      } else {
        // AI-powered formatting
        if (!apiKey.trim()) {
          setError("Please enter your OpenAI API key");
          setIsProcessing(false);
          return;
        }

        for (const line of lines) {
          try {
            const formattedValue = await formatWithAI(line, dataType, apiKey);
            formatted.push({ original: line, formatted: formattedValue });
          } catch (err) {
            formatted.push({
              original: line,
              formatted: `Error: ${err instanceof Error ? err.message : "Failed to format"}`,
            });
          }
        }
      }

      setFormattedData(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process data");
    } finally {
      setIsProcessing(false);
    }
  }, [inputFile, inputData, mode, apiKey, dataType]);

  const downloadCSVExport = useCallback(() => {
    if (formattedData.length === 0) return;

    const csvData: string[][] = [
      dataType === "company" ? ["Original Company Name", "Formatted Company Name"] : ["Original Job Title", "Formatted Job Title"],
    ];

    formattedData.forEach((row) => {
      csvData.push([row.original, row.formatted]);
    });

    const filename = inputFile
      ? `${inputFile.name.replace(".csv", "")}_formatted.csv`
      : `formatted_${dataType}.csv`;
    downloadCSV(csvData, filename);
  }, [formattedData, dataType, inputFile]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Company Name & Job Title Formatter</h1>
        <p className="text-muted-foreground">
          Standardize company names and job titles with rule-based or AI-powered normalization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formatting Mode</CardTitle>
          <CardDescription>Choose between free rule-based or AI-powered formatting</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as "free" | "ai")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="free">Free (Rule-based)</TabsTrigger>
              <TabsTrigger value="ai">AI-Powered</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">OpenAI API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally and not sent to our servers.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          <CardDescription>Upload a CSV file or paste text data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="data-type">Data Type</Label>
            <select
              id="data-type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={dataType}
              onChange={(e) => setDataType(e.target.value as "company" | "title")}
            >
              <option value="company">Company Names</option>
              <option value="title">Job Titles</option>
            </select>
          </div>

          <Tabs defaultValue="paste">
            <TabsList>
              <TabsTrigger value="paste">Paste Text</TabsTrigger>
              <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            </TabsList>
            <TabsContent value="paste">
              <Textarea
                placeholder="Paste your data here, one item per line..."
                value={inputData}
                onChange={(e) => {
                  setInputData(e.target.value);
                  setInputFile(null);
                }}
                rows={10}
                className="font-mono text-sm"
              />
            </TabsContent>
            <TabsContent value="upload">
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) handleFileSelect(selectedFile);
                  }}
                />
                {inputFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {inputFile.name}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={processData} disabled={isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Format Data"}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {formattedData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Formatted Results</CardTitle>
                <CardDescription>Preview and download your formatted data</CardDescription>
              </div>
              <Button onClick={downloadCSVExport}>Download CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">
                      {dataType === "company" ? "Original Company Name" : "Original Job Title"}
                    </th>
                    <th className="text-left p-2 font-medium">
                      {dataType === "company" ? "Formatted Company Name" : "Formatted Job Title"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.slice(0, 100).map((row, index) => (
                    <tr key={index} className="border-b hover:bg-muted">
                      <td className="p-2">{row.original}</td>
                      <td className="p-2 font-medium">{row.formatted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {formattedData.length > 100 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Showing first 100 rows of {formattedData.length} total rows
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

