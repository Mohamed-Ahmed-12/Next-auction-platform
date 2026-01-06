"use client"
import { Button, HelperText, Label, Spinner } from "flowbite-react";
import React, { useState } from 'react';
import { FieldBuilder } from "./FieldBuilder";
import { FormBuilderProps, FormField, FormFieldGroup } from "@/types/formfield";
import { DefaultValues, FieldValues, Path, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { mapApiErrorsToFormFields } from "@/helpers/apis";
import { AxiosErrorWithData } from "@/types/error";

interface FormBuilderPropsWithSubmit<TFormValues extends FieldValues> {
    formFields: FormBuilderProps;
    onSubmit: (data: TFormValues) => Promise<TFormValues>;
    successRedirect?: string;
    defaultValues?: DefaultValues<TFormValues> | undefined;
}

export default function FormBuilder<TFormValues extends FieldValues>({
    formFields,
    onSubmit,
    successRedirect,
    defaultValues,
}: FormBuilderPropsWithSubmit<TFormValues>) {
    console.log(defaultValues)
    const isEditing = !!defaultValues;
    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        setError // <--- Destructured from useForm
    } = useForm<TFormValues>({
        defaultValues: defaultValues,
    });
    const router = useRouter();

    const onFormSubmit = (data: TFormValues) => {
        setLoading(true)
        onSubmit(data)
            .then(() => {
                toast.success(isEditing ? "Updated successfully" : "created successfully")
                if (successRedirect) {
                    router.push(successRedirect)
                }
            })
            .catch((err: AxiosErrorWithData) => {
                console.error(err);

                // 1. Set field-specific errors if responseData exists (e.g., 400 Bad Request)
                if (err.responseData) {
                    mapApiErrorsToFormFields(err.responseData, setError);
                }

                // 2. Display a general toast notification for the error message
                // (This message comes from err.message, which you set in the interceptor)
                toast.error(err.message || "An unknown error occurred.")

            })
            .finally(() => {
                setLoading(false)
            })
    }

    // ... (rest of your component remains the same)

    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onFormSubmit)}>
            {/* ... (rest of the JSX) */}
            {
                formFields.map((group: FormFieldGroup) => (
                    <fieldset key={group.groupKey} className="mb-4 bg-gray-100 p-4 rounded border border-dashed border-gray-300">
                        {group.groupTitle &&
                            <h2 className="font-semibold text-xl my-2">{group.groupTitle}</h2>
                        }
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* each field in group */}
                            {
                                group.fields.map((field: FormField) => {
                                    const fieldError = errors[field.id as keyof TFormValues];
                                    const errorMsg = fieldError?.message as string | undefined;
                                    const isDisabled = isEditing && Boolean(field.disabled);
                                    return (
                                        <div key={field.id} >
                                            <div className="mb-2 block">
                                                <Label
                                                    htmlFor={field.id}
                                                    color={errorMsg ? "failure" : "gray"}
                                                >
                                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                                </Label>
                                            </div>

                                            {/* Dynamic Field Renderer */}
                                            <FieldBuilder
                                                fieldType={field.fieldType}
                                                id={field.id}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                color={errorMsg ? "failure" : "gray"}
                                                // rules={field.rules}
                                                register={register}
                                                control={control}
                                                options={field.options || ""}
                                                disabled={isDisabled}
                                                requireTextEditor={field.textEditor || false}
                                            />

                                            {/* Helper Text (Only show if no error) */}
                                            {field.helpTxt && !errorMsg && (
                                                <HelperText>
                                                    {field.helpTxt}
                                                </HelperText>
                                            )}

                                            {/* Error Message (now derived from useForm's errors) */}
                                            {errorMsg && (
                                                <HelperText color="failure">
                                                    {errorMsg}
                                                </HelperText>
                                            )}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </fieldset>
                ))
            }


            <div className="mt-4">
                <Button type="submit" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : (isEditing ? "Update" : "Save")}
                </Button>
            </div>

        </form>
    );
}