"use client"
import { Button, HelperText, Label, Spinner } from "flowbite-react";
import React, { useState } from 'react';
import { FieldBuilder } from "./FieldBuilder";
import { FormBuilderProps } from "@/types/formfield";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormBuilderPropsWithSubmit<TFormValues extends FieldValues> {
    formFields: FormBuilderProps;
    onSubmit: (data: TFormValues) => Promise<TFormValues>;// onSubmit accepts data of the generic type TFormValues
    successRedirect?: string;
    defaultValues?: DefaultValues<TFormValues> | DefaultValues<TFormValues> | undefined; // Data used to pre-populate the form for editing
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
            .catch((err) => {
                toast.error(err.message)
            })
            .finally(() => {
                setLoading(false)

            })
    }
    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onFormSubmit)}>
            {/* each group */}
            {
                formFields.map((group: any) => (
                    <fieldset key={group.groupKey} >

                        <h2 className="font-semibold text-xl mb-4">{group.groupTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* each field in group */}
                            {
                                group.fields.map((field: any) => {
                                    const fieldError = errors[field.id as keyof TFormValues];
                                    const errorMsg = fieldError?.message as string | undefined;

                                    return (
                                        <div key={field.id}>
                                            <div className="mb-2 block">
                                                <Label
                                                    htmlFor={field.id}
                                                    color={errorMsg ? "failure" : "gray"}
                                                >
                                                    {field.label} {field.required && "*"}
                                                </Label>
                                            </div>

                                            {/* Dynamic Field Renderer */}
                                            <FieldBuilder
                                                fieldType={field.fieldType}
                                                id={field.id}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                color={errorMsg ? "failure" : "gray"}
                                                rules={field.rules}
                                                register={register}
                                                control={control}
                                                options={field.options || ""}
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
                    {loading ? <Spinner size="sm" /> : "Save"}
                </Button>
            </div>

        </form>
    );
}