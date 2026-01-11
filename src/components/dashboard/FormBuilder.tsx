"use client"
import React, { useState } from 'react';
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, HelperText, Label, ModalBody, ModalFooter, ModalHeader, Spinner } from "flowbite-react";
import { FiArrowRight, FiCheck, FiChevronLeft } from "react-icons/fi";

// Your shared types
import { FormBuilderProps, FormField, FormFieldGroup } from "@/types/formfield";
import { AxiosErrorWithData } from "@/types/error";
import { mapApiErrorsToFormFields } from "@/helpers/apis";
import { FieldBuilder } from "./FieldBuilder";

interface FormBuilderComponentProps<TFormValues extends FieldValues> {
    title: string,
    formFields: FormBuilderProps; // This is FormFieldGroup[]
    onSubmit: (data: TFormValues) => Promise<any>;
    successRedirect?: string;
    defaultValues?: DefaultValues<TFormValues>;
}

import { Modal, TextInput, Textarea } from "flowbite-react";
import { FiGlobe } from "react-icons/fi";
import { MdOutlineTranslate } from 'react-icons/md';

interface TranslationModalProps {
    isOpen: boolean;
    onClose: () => void;
    field: FormField;
    register: any;
    errors: any;
}

const TranslationModal = ({ isOpen, onClose, field, register, errors }: TranslationModalProps) => {
    // Define the languages you support (match your Django settings)
    const languages = [
        { code: 'en', label: 'English', dir: 'ltr' },
        { code: 'ar', label: 'Arabic', dir: 'rtl' }
    ];

    return (
        <Modal show={isOpen} onClose={onClose} size="md">
            <ModalHeader className="border-b-gray-200">
                Translate: {field.label}
            </ModalHeader>
            <ModalBody>
                <div className="space-y-6">
                    {languages.map((lang) => (
                        <div key={lang.code} dir={lang.dir}>
                            <Label className="mb-2 block text-xs font-bold  tracking-wider text-slate-400">
                                {field.label} ({lang.code})
                            </Label>
                            {/* Switch between Textarea or Input based on fieldType */}
                            {field.fieldType === 'textarea' || field.textEditor ? (
                                <Textarea
                                    {...register(`${field.id}_${lang.code}`)}
                                    placeholder={`Enter ${lang.label} translation...`}
                                    rows={4}
                                />
                            ) : (
                                <TextInput
                                    {...register(`${field.id}_${lang.code}`)}
                                    placeholder={`Enter ${lang.label} translation...`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="indigo" onClick={onClose} className="w-full">Done</Button>
            </ModalFooter>
        </Modal>
    );
};

export default function FormBuilder<TFormValues extends FieldValues>({
    title,
    formFields,
    onSubmit,
    successRedirect,
    defaultValues,
}: FormBuilderComponentProps<TFormValues>) {
    const isEditing = !!defaultValues;
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [activeTranslationField, setActiveTranslationField] = useState<FormField | null>(null);
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        setError
    } = useForm<TFormValues>({ defaultValues });

    const onFormSubmit = async (data: TFormValues) => {
        setLoading(true);
        try {
            await onSubmit(data);
            toast.success(isEditing ? "Changes saved" : "Created successfully");
            if (successRedirect) router.push(successRedirect);
        } catch (err: any) {
            const error = err as AxiosErrorWithData;
            if (error.responseData) {
                mapApiErrorsToFormFields(error.responseData, setError);
            }
            toast.error(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen">
            <form className="max-w-4xl mx-auto md:mx-20 pb-32 pt-10 px-4" onSubmit={handleSubmit(onFormSubmit)}>
                {/* Form Introduction */}
                <header className="mb-12">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4 group"
                    >
                        <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-slate-500 mt-2">Fill in the details below to {isEditing ? "update" : "create"}  your record.</p>
                </header>

                {formFields.map((group: FormFieldGroup, index: number) => (
                    <section
                        key={group.groupKey}
                        className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Minimalist Section Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-none w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                {index + 1}
                            </div>
                            {group.groupTitle && (
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                    {group.groupTitle}
                                </h2>
                            )}
                            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                        </div>

                        {/* Responsive Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            {
                                group.fields.map((field: FormField) => {
                                    const fieldError = errors[field.id as keyof TFormValues];
                                    const errorMsg = fieldError?.message as string | undefined;
                                    const isDisabled = isEditing && Boolean(field.disabled);

                                    return (
                                        <div key={field.id} className="flex flex-col space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label
                                                    htmlFor={field.id}
                                                    className="text-xs font-bold uppercase tracking-widest text-slate-500"
                                                >
                                                    {field.label}
                                                    {field.required && <span className="ml-1 text-red-500">*</span>}
                                                    {/* 1. TRANSLATION TRIGGER ICON */}
                                                    {field.isTranslatable && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveTranslationField(field)}
                                                            className="p-1 rounded-md hover:bg-indigo-50 text-indigo-500 transition-colors"
                                                            title="Open Translations"
                                                        >
                                                            <MdOutlineTranslate />
                                                        </button>
                                                    )}
                                                </Label>
                                            </div>

                                            <div className={`transition-all duration-300 ${errorMsg ? 'transform scale-[1.01]' : ''}`}>
                                                <FieldBuilder
                                                    fieldType={field.fieldType}
                                                    id={field.id}
                                                    placeholder={field.placeholder}
                                                    required={field.required}
                                                    color={errorMsg ? "failure" : "gray"}
                                                    register={register}
                                                    control={control}
                                                    options={field.options || ""}
                                                    disabled={isDisabled}
                                                    requireTextEditor={field.textEditor || false}
                                                />
                                            </div>

                                            {/* Feedback Area with Fixed Height to prevent layout jumping */}
                                            <div className="min-h-[20px]">
                                                {errorMsg ? (
                                                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        {errorMsg}
                                                    </p>
                                                ) : field.helpTxt ? (
                                                    <p className="text-[11px] text-slate-400 font-medium">
                                                        {field.helpTxt}
                                                    </p>
                                                ) : null}
                                            </div>
                                            {/* 2. THE MODAL INSTANCE */}
                                            {activeTranslationField?.id === field.id && (
                                                <TranslationModal
                                                    isOpen={!!activeTranslationField}
                                                    onClose={() => setActiveTranslationField(null)}
                                                    field={field}
                                                    register={register}
                                                    errors={errors}
                                                />
                                            )}
                                        </div>
                                    );

                                })
                            }
                        </div>
                    </section>
                ))}

                {/* Sticky Action Bar */}
                <div className="sticky bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-slate-200 z-50">
                    <div className="max-w-4xl mx-auto p-4 md:p-6 flex items-center justify-between">
                        <div className="hidden md:block">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
                            <p className="text-sm font-semibold text-slate-600">
                                {loading ? "Syncing data..." : "Draft unsaved"}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button
                                color="gray"
                                pill
                                size="lg"
                                className="flex-1 md:flex-none border-none hover:bg-slate-800"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                pill
                                size="lg"
                                className="flex-1 md:flex-none bg-indigo-600 enabled:hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                            >
                                {loading ? <Spinner size="sm" className="mr-2" /> : (
                                    <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                                        {isEditing ? "Update Entry" : "Save Record"}
                                        {isEditing ? <FiCheck /> : <FiArrowRight />}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}