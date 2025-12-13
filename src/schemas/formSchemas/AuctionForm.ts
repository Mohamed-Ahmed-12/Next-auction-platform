import { fetchCategories } from "@/services/CategoryService";
import { FormFieldGroup } from "@/types/formfield";

export const AuctionFormFields: FormFieldGroup[] = [
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
                placeholder: 'Auction title',
            },
            {
                id: 'entry_fee',
                label: 'Entry Fee',
                fieldType: 'number',
                helpTxt: '',
                errorMsg: 'must be integer number and positive',
                required: true,
                placeholder: 'Entry Fee',
            },


        ]
    },
    {
        groupKey: 'g2',
        fields: [
            {
                id: 'start_date',
                label: 'Start Date',
                fieldType: 'datetime-local',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: '',
            },
            {
                id: 'end_date',
                label: ' End Date',
                fieldType: 'datetime-local',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: '',
            },


        ]
    },
    {
        groupKey: 'g3',
        fields: [
            {
                id: 'desc',
                label: 'Description',
                fieldType: 'textarea',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'Description',
            },
            {
                id: 'category',
                label: 'Category',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: '',
                options:'category'
            },


        ]
    },

]