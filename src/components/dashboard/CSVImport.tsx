"use client";

import { Button, Checkbox, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FaFileCsv } from "react-icons/fa6";
import { toast } from "react-toastify";

export function CSVImport({ columns, modelLabel }: { columns: any, modelLabel: string }) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleSubmit = () => {

    }
    return (
        <>
            <Button color="alternative" className="cursor-pointer" onClick={() => setOpenModal(true)}>
                <FaFileCsv color="green" size={20} className="me-1" /> Import File
            </Button>
            <Modal show={openModal} size="lg" popup onClose={() => { setOpenModal(false) }} >
                <ModalHeader className="m-4 border-b-gray-300 border-b">Import Data</ModalHeader>
                <ModalBody className="space-y-6">
                    <form className="flex flex-col gap-y-8" onSubmit={handleSubmit}>
                        <h2 className="text-md ">Select File to import <strong className="text-primary-500">"if not selected the default will be all columns"</strong></h2>
                        
                        <Button type="submit">Import</Button>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}