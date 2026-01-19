"use client"
import { displayLabel } from "@/helpers/i18n";
import { FormField } from "@/types/formfield";
import {
    Modal, Button, createTheme,
    Label, ModalBody, ModalFooter, ModalHeader, ThemeProvider
} from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import { FieldBuilder } from "./FieldBuilder";

interface TranslationModalProps {
    isOpen: boolean;
    onClose: () => void;
    field: FormField;
    register: any;
    errors: any;
    disabled: any;
    control: any;
}

export const TranslationModal = ({ isOpen, onClose, field, register, errors, disabled, control }: TranslationModalProps) => {
    const locale = useLocale();
    const t = useTranslations('TranslationModal');

    // Using translation keys for language names
    const languages = [
        { code: 'en', label: t('langEn'), dir: 'ltr' },
        { code: 'ar', label: t('langAr'), dir: 'rtl' }
    ];



    return (
        <Modal show={isOpen} onClose={onClose} size="md" popup className="backdrop-blur-sm-sm">
            <ModalHeader className='px-5 py-3 border-b border-gray-300 mb-4'>
                <span className="text-slate-700">
                    {t('title')}: {displayLabel(field.label, locale)}
                </span>
            </ModalHeader>
            <ModalBody>
                <div className="space-y-6">
                    {languages.map((lang) => {
                        const translatedFieldId = `${field.id}_${lang.code}`;
                        console.log("Rendering field for language:", lang.code, "with ID:", translatedFieldId);
                        return (
                            <div key={lang.code} dir={lang.dir}>
                                <Label className="mb-2 block text-xs font-bold tracking-wider text-slate-400">
                                    {displayLabel(field.label, locale)} ({lang.label.toUpperCase()})
                                </Label>

                                <FieldBuilder
                                    fieldType={field.fieldType}
                                    id={translatedFieldId}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    color={!!errors[field.id] ? "failure" : "gray"}
                                    register={register}
                                    control={control}
                                    options={field.options || ""}
                                    disabled={disabled}
                                    requireTextEditor={field.textEditor || false}
                                    className="focus:ring-indigo-500 border-slate-200"
                                />
                            </div>
                        );
                    })}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="indigo" onClick={onClose} className="w-full bg-indigo-600">
                    {t('done')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};