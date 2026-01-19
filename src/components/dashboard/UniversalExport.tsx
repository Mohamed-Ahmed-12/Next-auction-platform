"use client";

import { exportData } from "@/services/ExportDataService";
import { Button, Checkbox, Label, Modal, ModalBody, ModalHeader, Radio } from "flowbite-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { FaFileCsv, FaFileExcel, FaCode } from "react-icons/fa6";
import { toast } from "react-toastify";

type ExportFormat = 'xlsx' | 'csv' | 'json';

export function UniversalExport({ columns, modelLabel, filters, disabled }: { columns: any, modelLabel: string, filters?: any, disabled: boolean }) {
    const t = useTranslations('Exporter');
    const [openModal, setOpenModal] = useState(false);
    const [selectedCols, setSelectedCols] = useState<string[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('xlsx');

    const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const colValue = e.target.value;
        const isChecked = e.target.checked;
        setSelectedCols((prev) =>
            isChecked ? [...prev, colValue] : prev.filter((col) => col !== colValue)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await exportData({
                columns: selectedCols,
                modelLabel,
                filters,
                format: selectedFormat
            });
            setOpenModal(false);
            setSelectedCols([]);
            toast.success(t("export_success"));
        } catch (err: any) {
            toast.error(err.message || t("export_error"));
        }
    };

    return (
        <>
            <Button color="alternative" onClick={() => setOpenModal(true)} disabled={disabled}>
                <FaFileDownload className="me-2 text-green-600" size={18}/> {t("export_button")}
            </Button>

            <Modal show={openModal} size="5xl" position="top-center" popup onClose={() => { setOpenModal(false); setSelectedCols([]) }}>
                <ModalHeader className="m-4 border-b border-gray-200">
                    <span className="text-xl font-semibold">{t("modal_title")}</span>
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <section>
                            <h3 className="mb-4 font-medium text-gray-900">{t("section_format")}</h3>
                            <div className="flex flex-wrap gap-8 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Radio id="xlsx" name="format" value="xlsx" checked={selectedFormat === 'xlsx'} onChange={() => setSelectedFormat('xlsx')} />
                                    <Label htmlFor="xlsx" className="flex items-center gap-2 cursor-pointer">
                                        <FaFileExcel color="#1D6F42" /> {t("formats.xlsx")}
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Radio id="csv" name="format" value="csv" checked={selectedFormat === 'csv'} onChange={() => setSelectedFormat('csv')} />
                                    <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                                        <FaFileCsv color="#008000" /> {t("formats.csv")}
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Radio id="json" name="format" value="json" checked={selectedFormat === 'json'} onChange={() => setSelectedFormat('json')} />
                                    <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                                        <FaCode color="#F7DF1E" /> {t("formats.json")}
                                    </Label>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="mb-2 font-medium text-gray-900">{t("section_columns")}</h3>
                            <p className="text-sm text-gray-500 mb-4 italic">{t("columns_hint")}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2 border border-gray-100 rounded">
                                {columns.map((col: any) => (
                                    <div key={col.field} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                                        <Checkbox
                                            id={col.field}
                                            value={col.field}
                                            onChange={handleColumnChange}
                                            checked={selectedCols.includes(col.field)}
                                        />
                                        <Label htmlFor={col.field} className="text-sm cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                                            {col.headerName}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button color="gray" onClick={() => setOpenModal(false)}>{t("cancel")}</Button>
                            <Button type="submit" color="green">
                                {t("generate_btn", { format: selectedFormat.toUpperCase() })}
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}