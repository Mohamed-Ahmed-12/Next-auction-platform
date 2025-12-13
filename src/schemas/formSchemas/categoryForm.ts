import { FormFieldGroup } from "@/types/formfield";

export const categoryFormFields: FormFieldGroup[] = [
    {
        groupKey: 'g1',
        fields: [
            {
                id: 'title',
                label: 'Title',
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Category title',
            },
            {
                id: 'icon',
                label: 'Icon',
                fieldType: 'file',
                helpTxt: 'Upload image max size 1 mb',
                errorMsg: '',
                required: false,
                placeholder: '',
            }, {
                id: 'desc',
                label: 'Description',
                fieldType: 'textarea',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Category description',
            },

        ]
    },

]