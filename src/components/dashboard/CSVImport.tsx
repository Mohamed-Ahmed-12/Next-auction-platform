"use client";
import * as XLSX from "xlsx";
import {
    Button,
    FileInput,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTitle,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FaFileCsv, FaUpload } from "react-icons/fa6";
import { FcProcess } from "react-icons/fc";
import { VscOpenPreview } from "react-icons/vsc";
import { BiFile } from "react-icons/bi";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import { importData } from "@/services/ImportDataService";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule ]);

type CSVImportProps = {
    columnsTable?: any;
    modelLabel: string;
    refetch: () => Promise<void>; // function to refetch data after import
};

export function CSVImport({ columnsTable, modelLabel, refetch }: CSVImportProps) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 25 * 1024 * 1024) {
            toast.error("File size exceeds 25MB limit.");
            return;
        }

        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "text/csv",
        ];
        if (!validTypes.includes(file.type)) {
            toast.error("Unsupported file type.");
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (!e.target?.result) return;
            try {
                const arrayBuffer = e.target.result as ArrayBuffer;
                const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setData(json);
                toast.success("File parsed successfully!");
            } catch {
                toast.error("Invalid file format or corrupted file.");
            }
        };

        reader.readAsArrayBuffer(file);
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

    useEffect(() => {
        console.log("Data to import:", data);
    }, [data]);

    return (
        <>
            <Button color="alternative" onClick={() => setOpenModal(true)}>
                <FaFileCsv color="green" size={20} className="me-1" /> Import File
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
                    <form className="flex flex-col gap-y-6 mt-3" onSubmit={handleSubmit}>
                        {/* Timeline */}
                        <Timeline horizontal>
                            <TimelineItem>
                                <TimelinePoint icon={FaUpload} />
                                <TimelineContent>
                                    <TimelineTitle>Upload File</TimelineTitle>
                                    <TimelineBody>
                                        Upload an XLSX or CSV file containing data to import into the system.
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

                        {/* File Upload / Preview */}
                        {selectedFile ? (
                            <div className="h-[500px]">
                                <AgGridReact
                                    rowData={data}
                                    columnDefs={columnsTable}
                                />
                            </div>
                        ) : (
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
                                        <p className="text-xs text-gray-500">xlsx , CSV (MAX 25mb)</p>
                                    </div>
                                    <FileInput
                                        id="dropzone-file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        name="file"
                                        ref={fileInputRef}
                                        multiple={false}
                                        accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    />
                                </Label>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {selectedFile && (
                                <>
                                    <Button
                                        color="gray"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setData([]);
                                        }}
                                    >
                                        Choose Another File
                                    </Button><Button type="submit" color="green" disabled={loading}>
                                        {loading ? "Importing..." : "Submit"}
                                    </Button>
                                </>
                            )}

                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}
