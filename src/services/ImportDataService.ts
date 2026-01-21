import * as XLSX from "xlsx";
import { axiosInstance } from "@/lib/network";

// strategies/FileParserStrategy.ts
export interface FileParserStrategy {
    parse(file: File): Promise<any[]>;
}

// strategies/ExcelParser.ts
export class ExcelParser implements FileParserStrategy {
    async parse(file: File): Promise<any[]> {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    }
}

// strategies/CSVParser.ts
export class CSVParser implements FileParserStrategy {
    async parse(file: File): Promise<any[]> {
        const text = await file.text();
        const rows = text.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        return rows.slice(1).map((row) =>
            headers.reduce((acc, header, i) => {
                acc[header] = row[i];
                return acc;
            }, {} as Record<string, string>)
        );
    }
}

// strategies/JSONParser.ts
export class JSONParser implements FileParserStrategy {
    async parse(file: File): Promise<any[]> {
        const text = await file.text();
        return JSON.parse(text);
    }
}

// strategies/ParserFactory.ts
type ParserConstructor = new () => FileParserStrategy;
export class ParserFactory {
    private static parsers: Record<string, ParserConstructor> = {
        "text/csv": CSVParser,
        "application/json": JSONParser,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ExcelParser,
        "application/vnd.ms-excel": ExcelParser,
    };
    static normalizeType(type: string): string {
        if (type.includes("csv")) return "text/csv";
        if (type.includes("json")) return "application/json";
        if (type.includes("excel") || type.includes("spreadsheet")) {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
        return type;
    }
    static getParser(file: File): FileParserStrategy {
        const normalized = this.normalizeType(file.type);
        const Parser = this.parsers[normalized];
        if (!Parser) throw new Error(`Unsupported file type: ${file.type}`);
        return new Parser();
    }
}


export async function importData({ modelLabel, data }: { modelLabel: string, data: string[] }): Promise<void> {
    await axiosInstance.post('import-data/', {
        'dj_model': modelLabel,
        'data': data,
    });
}