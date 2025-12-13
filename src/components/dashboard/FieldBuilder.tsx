import { FieldBuilderProps } from "@/types/formfield";
import { FileInput, Select, Textarea, TextInput } from "flowbite-react"
import SelectWithOptions from "./SelectWithOptions";
import { Controller } from "react-hook-form";


export const FieldBuilder: React.FC<FieldBuilderProps> = ({ fieldType, ...props }) => {
    const { register, id, options, control} = props;
    const registrationProps = register(id);
    const combinedProps = {
        ...props,
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
            return <Textarea {...combinedProps} rows={5} />;
        case 'file':
            return <FileInput {...combinedProps} accept="image/*" />;
        case 'select':
            return (
                <Controller
                    name={registrationProps.name}
                    control={control}
                    render={({ field }) => (
                        <SelectWithOptions {...combinedProps} {...field} fetchedData={options}> </SelectWithOptions>
                    )}
                />
            )

        default:
            console.warn(`Unknown fieldType: ${fieldType}`);
            return <></>;
    }
};