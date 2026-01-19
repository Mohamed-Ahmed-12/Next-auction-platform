"use client"
import React, { useState } from 'react';
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Label, Spinner, Tooltip } from "flowbite-react";
import { FiArrowRight, FiCheck, FiChevronLeft } from "react-icons/fi";
import { useLocale, useTranslations } from 'next-intl';

// Your shared types
import { FormBuilderProps, FormField, FormFieldGroup } from "@/types/formfield";
import { AxiosErrorWithData } from "@/types/error";
import { mapApiErrorsToFormFields } from "@/helpers/apis";
import { FieldBuilder } from "./FieldBuilder";
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdOutlineTranslate } from 'react-icons/md';
import { TranslationModal } from './TranslationModal';
import { displayLabel } from '@/helpers/i18n';

interface FormBuilderComponentProps<TFormValues extends FieldValues> {
    title: string,
    formFields: FormBuilderProps; // This is FormFieldGroup[]
    onSubmit: (data: TFormValues) => Promise<any>;
    successRedirect?: string;
    defaultValues?: DefaultValues<TFormValues>;
}


export default function FormBuilder<TFormValues extends FieldValues>({
    title,
    formFields,
    onSubmit,
    successRedirect,
    defaultValues,
}: FormBuilderComponentProps<TFormValues>) {
    const t = useTranslations('FormBuilder');
    const locale = useLocale()
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
            toast.success(isEditing ? t('successUpdate') : t('successCreate'));
            if (successRedirect) router.push(successRedirect);
        } catch (err: any) {
            const error = err as AxiosErrorWithData;
            if (error.responseData) {
                mapApiErrorsToFormFields(error.responseData, setError);
            }
            toast.error(error.message || t('errorGeneric'));
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
                        <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
                    </button>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {t('description', { action: isEditing ? t('update') : t('create') })}
                    </p>
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
                                            <div className="flex items-center justify-between mb-2">
                                                {/* Left Side: Identity & Requirement */}
                                                <div className="flex items-center gap-1.5">
                                                    <Label
                                                        htmlFor={field.id}
                                                        className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center"
                                                    >
                                                        {displayLabel(field.label, locale)}
                                                        {field.required && (
                                                            <span className="ml-1 text-red-400 select-none" aria-hidden="true">
                                                                *
                                                            </span>
                                                        )}
                                                    </Label>

                                                    {/* Info Tooltip: Placed right after label for context */}
                                                    {field.helpTxt && (
                                                        <Tooltip content={field.helpTxt} placement="top" className="transition-opacity">
                                                            <IoInformationCircleOutline className="text-slate-400 hover:text-indigo-500 cursor-help text-sm" />
                                                        </Tooltip>
                                                    )}
                                                </div>

                                                {/* Right Side: Contextual Actions (Translation) */}
                                                {field.isTranslatable && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTranslationField(field)}
                                                        className="group flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all"
                                                    >
                                                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400 group-hover:text-indigo-600">
                                                            {t('translate')}
                                                        </span>
                                                        <MdOutlineTranslate className="text-slate-400 group-hover:text-indigo-600 text-xs" />
                                                    </button>
                                                )}
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
                                                {errorMsg && (
                                                    <p className="text-[11px] font-bold text-red-500 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                        {errorMsg}
                                                    </p>
                                                )}
                                            </div>
                                            {/* 2. THE MODAL INSTANCE */}
                                            {activeTranslationField?.id === field.id && (
                                                <TranslationModal
                                                    isOpen={!!activeTranslationField}
                                                    onClose={() => setActiveTranslationField(null)}
                                                    field={field}
                                                    register={register}
                                                    errors={errors}
                                                    disabled={isDisabled}
                                                    control={control}
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
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('status')}</p>
                            <p className="text-sm font-semibold text-slate-600">
                                {loading ? t('syncing') : t('draft')}
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
                                {t('cancel')}
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
                                        {isEditing ? t('updateBtn') : t('saveBtn')}
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