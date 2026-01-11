import { FieldBuilderProps } from "@/types/formfield";
import { FileInput, Select, Textarea, TextInput } from "flowbite-react"
import SelectWithOptions from "./SelectWithOptions";
import { Controller } from "react-hook-form";
import Editor, { EditorProvider } from "react-simple-wysiwyg"

export const FieldBuilder: React.FC<FieldBuilderProps> = ({ fieldType, ...props }) => {
    // 1. Destructure the custom props so they AREN'T in 'inputProps'
    const { 
        register, 
        id, 
        options, 
        control, 
        requireTextEditor, 
        ...inputProps // This now only contains placeholder, required, color, disabled, etc.
    } = props;

    const registrationProps = register(id);

    // 2. Combine only valid input attributes with hook-form's ref/onChange/name
    const combinedProps = {
        ...inputProps,
        ...registrationProps
    };

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
                                <Editor
                                    {...field}
                                    {...inputProps} // Use clean props here
                                />
                            </EditorProvider>
                        )}
                    />
                );
            }
            return <Textarea {...combinedProps} rows={5} />;

        case 'file':
            // Note: For files, we usually only spread registrationProps.ref separately 
            // but combinedProps is generally fine for standard FileInput
            return <FileInput {...combinedProps} accept="image/*" />;

        case 'select':
            return (
                <Controller
                    name={registrationProps.name}
                    control={control}
                    render={({ field }) => (
                        <SelectWithOptions 
                            {...inputProps} 
                            {...field} 
                            fetchedData={options}
                        />
                    )}
                />
            );

        default:
            console.warn(`Unknown fieldType: ${fieldType}`);
            return <></>;
    }
};