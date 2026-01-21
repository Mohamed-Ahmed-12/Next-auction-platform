"use client";
import * as XLSX from "xlsx";
import {
    Button,
    FileInput,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTitle,
} from "flowbite-react";
import { useRef, useState } from "react";
import { FaFileCsv, FaUpload } from "react-icons/fa6";
import { FcProcess } from "react-icons/fc";
import { VscOpenPreview } from "react-icons/vsc";
import { BiFile } from "react-icons/bi";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import { importData, ParserFactory } from "@/services/ImportDataService";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useTranslations } from "next-intl";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type CSVImportProps = {
    columnsTable?: any;
    modelLabel: string;
    refetch: () => Promise<void>; // function to refetch data after import
};

export function CSVImport({ columnsTable, modelLabel, refetch }: CSVImportProps) {
    const t = useTranslations('dashboard');
    const formId = "import-data-form";
    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // const handleFileSelect = () => {
    //     fileInputRef.current?.click();
    // };

    const validateHeaders = (sheetData: any[]) => {
        if (sheetData.length === 0) return false;

        // 1. Get headers from the first row of the uploaded file
        const fileHeaders = Object.keys(sheetData[0]);
        console.log(fileHeaders)

        // 2. Get required fields from your Ag-Grid column definitions
        // We filter out any columns that don't have a 'field' property (like action buttons)
        const requiredFields = columnsTable
            .map((col: any) => col.field)
            .filter((field: string | undefined) => field !== undefined);

        // 3. Find missing columns
        const missing = requiredFields.filter((field: string) => !fileHeaders.includes(field));

        if (missing.length > 0) {
            toast.error(
                <div>
                    <p className="font-bold">Invalid File Structure</p>
                    <p className="text-xs">Missing columns: {missing.join(", ")}</p>
                </div>,
                { autoClose: 5000 }
            );
            return false;
        }

        return true;
    };

    const handleFileUpload = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const parser = ParserFactory.getParser(file);
            const json = await parser.parse(file);
            if (!validateHeaders(json)) {
                setSelectedFile(null);
                setData([]);
                if (fileInputRef.current) fileInputRef.current.value = ""; return;
            }
            setSelectedFile(file);
            setData(json);
            toast.success("File parsed successfully!");
        } catch (err: any) {
            toast.error(err.message || "Invalid file format or corrupted file.");
        }


       
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || data.length === 0) {
            toast.error("Please select a valid file to import.");
            return;
        }

        try {
            setLoading(true);
            await importData({
                modelLabel,
                data: data.map((row) => JSON.stringify(row)),
            });
            toast.success("Data imported successfully!");
            // Reset state
            setOpenModal(false);
            setSelectedFile(null);
            setData([]);
            await refetch();
        } catch (err: any) {
            toast.error(err.message || "An error occurred during import.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button color="alternative" onClick={() => setOpenModal(true)}>
                <FaFileCsv color="green" size={20} className="me-1" /> {t("import")}
            </Button>

            <Modal
                show={openModal}
                size="7xl"
                position="top-center"
                popup
                onClose={() => setOpenModal(false)}
            >
                <ModalHeader className="m-4 border-b-gray-300 border-b">
                    Import Data
                </ModalHeader>
                <ModalBody className="space-y-6">
                    <form id={formId} className="flex flex-col gap-y-6 mt-3 px-8" onSubmit={handleSubmit}>
                        {/* Timeline */}
                        <Timeline horizontal>
                            <TimelineItem>
                                <TimelinePoint icon={FaUpload} />
                                <TimelineContent>
                                    <TimelineTitle>Upload File</TimelineTitle>
                                    <TimelineBody>
                                        Upload an XLSX, CSV or JSON file containing data to import into the system.
                                    </TimelineBody>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelinePoint icon={FcProcess} />
                                <TimelineContent>
                                    <TimelineTitle>Validate Data</TimelineTitle>
                                    <TimelineBody>
                                        The system will validate the data in the file for any errors or inconsistencies.
                                    </TimelineBody>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelinePoint icon={VscOpenPreview} />
                                <TimelineContent>
                                    <TimelineTitle>Preview Data</TimelineTitle>
                                    <TimelineBody>
                                        Preview the data to be imported and make any necessary adjustments before finalizing the import.
                                    </TimelineBody>
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>

                        {/* Selected File Info */}
                        {selectedFile && (
                            <div className="flex gap-2 items-center text-sm text-gray-600">
                                <BiFile size={20} />
                                <span>Selected File: {selectedFile.name}</span>
                            </div>
                        )}


                        {selectedFile ? (
                            // Data Preview Table
                            <div className="h-[500px]">
                                <AgGridReact
                                    rowData={data}
                                    columnDefs={columnsTable}
                                />
                            </div>
                        ) : (
                            // Dropzone Area
                            <div
                                role="button"
                                tabIndex={0}
                                className="flex w-full items-center justify-center"
                            >
                                <Label
                                    htmlFor="dropzone-file"
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                                >
                                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                        <FaUpload className="mb-4 h-8 w-8 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">XLSX, CSV or JSON (MAX 25mb)</p>
                                    </div>
                                    <FileInput
                                        id="dropzone-file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        name="file"
                                        ref={fileInputRef}
                                        multiple={false}
                                        accept=".json, .xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    />
                                </Label>
                            </div>
                        )}

                    </form>
                </ModalBody>
                {/* 2. Move Actions to ModalFooter */}
                <ModalFooter className="flex justify-end gap-2">
                    {selectedFile && (
                        <>
                            <Button
                                color="alternative"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setData([]);
                                }}
                            >
                                Choose Another File
                            </Button>

                            {/* 3. Use the form attribute to link to the ID above */}
                            <Button
                                type="submit"
                                form={formId}
                                color="green"
                                disabled={loading}
                            >
                                {loading ? "Importing..." : `Save ${data.length} Records`}
                            </Button>
                        </>
                    )}
                </ModalFooter>
            </Modal>
        </>
    );
}
