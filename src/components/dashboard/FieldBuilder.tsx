import { FieldBuilderProps } from "@/types/formfield";
import { FileInput, Textarea, TextInput } from "flowbite-react"
import SelectWithOptions from "./SelectWithOptions";
import { Controller } from "react-hook-form";
import Editor, { EditorProvider } from "react-simple-wysiwyg"
import { MdDeleteForever } from "react-icons/md";
import { useState, useCallback } from "react";
import { Button, Progress } from "flowbite-react";
import { HiUpload, HiX, HiDocument } from "react-icons/hi";
import { BsCloudCheck, BsCloudCheckFill } from "react-icons/bs";

// Unified type for both existing and new files
type FileItem = {
    id: string | number;
    name: string;
    size?: number;
    previewUrl?: string;
    progress: number;
    isRemote?: boolean; // Flag to distinguish saved files
};

export function FileUploadField({ id, disabled, initialFiles = [] }: {
    id: string;
    disabled?: boolean;
    initialFiles?: any[];
}) {
    // Merge initial data into our unified state
    const [files, setFiles] = useState<FileItem[]>(
        initialFiles.map((f, i) => ({
            id: `remote-${i}`,
            name: f.name || "Existing File",
            previewUrl: f.image || f.url,
            progress: 100,
            isRemote: true,
            size: f.size
        }))
    );
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = (newFiles: FileList) => {
        const mapped = Array.from(newFiles).map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
            progress: 0,
            isRemote: false,
        }));

        setFiles((prev) => [...prev, ...mapped]);

        // Mocking the progress for UX (Replace with your actual S3/API upload logic)
        mapped.forEach((f) => simulateUpload(f.id));
    };

    const simulateUpload = (fileId: string) => {
        let p = 0;
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 30);
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
            }
            setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: p } : f));
        }, 400);
    };

    const removeFile = (fileId: string | number) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    return (
        <div className="w-full space-y-4">
            {/* Enhanced Dropzone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files) handleUpload(e.dataTransfer.files);
                }}
                className={`
                    relative group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 
                    transition-all duration-200 ease-in-out
                    ${isDragging ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100" : "border-gray-300 bg-gray-50 hover:bg-white hover:border-gray-400"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
            >
                <input
                    id={id} type="file" multiple className="hidden"
                    onChange={(e) => e.target.files && handleUpload(e.target.files)}
                    disabled={disabled}
                />

                <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                    <HiUpload className="h-6 w-6" />
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-700">
                    Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    SVG, PNG, JPG or PDF (max. 10MB)
                </p>

                <Button
                    size="xs" color="gray" className="mt-4"
                    onClick={() => document.getElementById(id)?.click()}
                >
                    Select Files
                </Button>
            </div>

            {/* Unified Preview Grid */}
            {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => (
                        <div key={file.id} className="group relative flex flex-col border border-gray-200 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                                    {file.previewUrl ? (
                                        <img src={file.previewUrl} className="h-full w-full object-cover" alt="" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                                            <HiDocument className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-gray-500">
                                            {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "Server"}
                                        </p>
                                        {file.isRemote && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-green-600">
                                                <BsCloudCheckFill className="h-3 w-3" /> Saved
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    aria-label="Remove file"
                                >
                                    <HiX className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Progress bar only for active uploads */}
                            {!file.isRemote && file.progress < 100 && (
                                <div className="mt-3">
                                    <Progress progress={file.progress} size="sm" color="blue" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export const FieldBuilder: React.FC<FieldBuilderProps> = ({ fieldType, ...props }) => {
    const {
        register,
        id,
        options,
        control,
        requireTextEditor,
        defaultValues,   // <-- make sure you pass this in
        isEditing,       // <-- flag for edit mode
        ...inputProps
    } = props;

    const registrationProps = register(id);
    const combinedProps = { ...inputProps, ...registrationProps };

    switch (fieldType) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'datetime-local':
            return <TextInput type={fieldType} {...combinedProps} />;

        case 'textarea':
            if (requireTextEditor) {
                return (
                    <Controller
                        name={registrationProps.name}
                        control={control}
                        render={({ field }) => (
                            <EditorProvider>
                                <Editor {...field} {...inputProps} />
                            </EditorProvider>
                        )}
                    />
                );
            }
            return <Textarea {...combinedProps} rows={5} />;

        case 'file':
        case 'image':
            return (
                <div className="space-y-2">
                    <FileUploadField id={id} disabled={inputProps.disabled} />

                    {/* Show existing files/images when editing */}
                    {isEditing && defaultValues?.[id] && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.isArray(defaultValues[id]) &&
                                defaultValues[id].map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="relative border border-gray-50 rounded-md overflow-hidden bg-white shadow-sm p-2"
                                    >
                                        {/* Thumbnail or file placeholder */}
                                        {fieldType === 'image' ? (
                                            <img
                                                src={item.url || item.image}
                                                alt={item.name || `Preview ${idx}`}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-32 bg-gray-100 text-sm text-gray-600">
                                                {item.name || `File ${idx + 1}`}
                                            </div>
                                        )}

                                        {/* File metadata */}
                                        <div className="mt-2 text-xs text-gray-700">
                                            <p className="truncate font-medium">{item.name || `File ${idx + 1}`}</p>
                                            {item.size && (
                                                <p className="text-gray-500">
                                                    {(item.size / 1024).toFixed(1)} KB
                                                </p>
                                            )}
                                        </div>

                                        {/* Progress bar (always 100% for saved files) */}
                                        <div className="mt-2">
                                            <Progress progress={100} size="sm" color="blue" />
                                            <span className="text-xs text-gray-500">100%</span>
                                        </div>

                                        {/* Delete button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // implement removal from defaultValues or trigger backend delete
                                            }}
                                            className="absolute top-1 right-1 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200 cursor-pointer"
                                        >
                                            <MdDeleteForever className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            );

        case 'select':
            return (
                <Controller
                    name={registrationProps.name}
                    control={control}
                    render={({ field }) => (
                        <SelectWithOptions {...inputProps} {...field} fetchedData={options} />
                    )}
                />
            );

        default:
            console.warn(`Unknown fieldType: ${fieldType}`);
            return <></>;
    }
};
