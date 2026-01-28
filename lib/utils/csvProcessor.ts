import Papa from "papaparse";

export interface CSVChunk {
  data: string[][];
  filename: string;
  size: number;
}

export interface CSVParsingResult {
  data: string[][];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

export function parseCSV(file: File): Promise<CSVParsingResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          data: results.data as string[][],
          errors: results.errors,
          meta: results.meta,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function chunkCSV(
  data: string[][],
  rowsPerChunk: number,
  maxChunks?: number
): string[][][] {
  if (data.length === 0) return [];

  const header = data[0];
  const rows = data.slice(1);
  const chunks: string[][][] = [];

  let currentChunk: string[][] = [header];
  let rowCount = 0;

  for (const row of rows) {
    if (maxChunks && chunks.length >= maxChunks) {
      break;
    }

    currentChunk.push(row);
    rowCount++;

    if (rowCount >= rowsPerChunk) {
      chunks.push(currentChunk);
      currentChunk = [header];
      rowCount = 0;
    }
  }

  if (currentChunk.length > 1 && (!maxChunks || chunks.length < maxChunks)) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export function csvToString(data: string[][]): string {
  return Papa.unparse(data);
}

export function downloadCSV(data: string[][], filename: string) {
  const csv = csvToString(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

