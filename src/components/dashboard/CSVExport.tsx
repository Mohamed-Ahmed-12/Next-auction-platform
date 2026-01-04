"use client";

import { exportData } from "@/services/ExportDataService";
import { Button, Checkbox, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaFileCsv } from "react-icons/fa6";
import { toast } from "react-toastify";

export function CSVExport({ columns, modelLabel, filters }: { columns: any, modelLabel: string, filters?: any }) {
    const t = useTranslations('dashboard')
    const [openModal, setOpenModal] = useState(false);
    const [selectedCols, setSelectedCols] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const colValue = e.target.value;
        const isChecked = e.target.checked;

        setSelectedCols((prev) => {
            if (isChecked) {
                if (!prev.includes(colValue)) {
                    return [...prev, colValue];
                }
            } else {
                // REMOVE: Filter out the unchecked value to return a NEW array.
                return prev.filter((col) => col !== colValue);
            }
            // Return the previous state if no change was made
            return prev;
        });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await exportData({ columns: selectedCols, modelLabel , filters })
            setOpenModal(false)
            setSelectedCols([])
            toast.success("Data exported successfully")
        } catch (err: any) {
            console.log()
            toast.error(err.message || "an error occurred")
        }

    }

    return (
        <>
            <Button color="alternative" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaFileCsv color="green" size={20} className="me-1" /> {t("export")}
            </Button>
            <Modal show={openModal} size="7xl" position="top-center" popup onClose={() => { setOpenModal(false); setSelectedCols([]) }} >
                <ModalHeader className="m-4 border-b-gray-300 border-b">Export Data</ModalHeader>
                <ModalBody className="space-y-6">
                    <form className="flex flex-col gap-y-8" onSubmit={handleSubmit}>
                        <h2 className="text-md ">Select Columns to export <strong className="text-primary-500">"if not selected the default will be all columns"</strong></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {
                                columns.length > 0 &&
                                (
                                    columns.map((col: any) => (
                                        <div key={col.field} className="flex items-center gap-2"> {/* Added key to the outer div */}
                                            {/* Note: Checkbox uses checked prop if you want to reflect state on mount/close */}
                                            <Checkbox
                                                name="cols"
                                                id={col.field}
                                                value={col.field}
                                                onChange={handleChange}
                                                checked={selectedCols.includes(col.field)} // Optional: Reflect state
                                            />
                                            <Label htmlFor={col.field}>{col.headerName}</Label>
                                        </div>

                                    ))
                                )
                            }
                        </div>
                        <div>
                            <Button type="submit" color={'green'}>Export</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}