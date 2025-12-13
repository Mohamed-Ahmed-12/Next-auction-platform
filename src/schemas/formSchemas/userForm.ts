import { FormFieldGroup } from "@/types/formfield";
    // is_active: string;
    // is_staff: string;
    // is_superuser: string;
export const UserFormFields: FormFieldGroup[] = [
    {
        groupKey: 'g1',
        fields: [
            {
                id: 'username',
                label: 'Username',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Mo_Ahmed',
                disabled:true,
            },
            {
                id: 'email',
                label: 'Email',
                fieldType: 'email',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'mail@mail.mail',
            },
            {
                id: 'first_name',
                label: 'First name',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'Mo',
            },
            {
                id: 'last_name',
                label: 'Last name',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'Ahmed',
            },

        ]
    },

]