import { FormFieldGroup } from "@/types/formfield";

export const categoryFormFields: FormFieldGroup[] = [
    {
        groupKey: 'g1',
        fields: [
            {
                id: 'title',
                label: {'en': 'Title', 'ar': 'العنوان'},
                fieldType: 'text',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: 'Category title',
                isTranslatable: true
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
                helpTxt: 'Enter category description',
                errorMsg: '',
                required: true,
                placeholder: 'Category description',
                isTranslatable: true

            },

        ]
    },

]