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
                isTranslatable:true
            },
            {
                id: 'category',
                label: 'Category',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: '',
                options: 'category'
            },
        ]
    },
    {
        groupKey: 'g2',
        groupTitle: 'Date & Time',
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
        groupTitle: 'Pricing',
        fields: [
            {
                id: 'entry_fee',
                label: 'Entry Fee',
                fieldType: 'number',
                helpTxt: '',
                errorMsg: 'must be integer number and positive',
                required: true,
                placeholder: 'Entry Fee',
            },
            {
                id: 'start_price',
                label: 'Start Price',
                fieldType: 'number',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: '',
            },
            {
                id: 'reserve_price',
                label: 'Reserve Price',
                fieldType: 'number',
                helpTxt: 'Minimum price can accept to buy with it',
                errorMsg: '',
                required: true,
                placeholder: '',
            },
            {
                id: 'min_increment',
                label: 'Minimum Increment',
                fieldType: 'number',
                helpTxt: 'Minimum acceptable amount',
                errorMsg: '',
                required: true,
                placeholder: '',
            },


        ]
    },
    {
        groupKey: 'g4',
        groupTitle: 'Additional Information',
        fields: [
            {
                id: 'desc',
                label: 'Description',
                fieldType: 'textarea',
                helpTxt: '',
                errorMsg: '',
                required: false,
                placeholder: 'Description',
                textEditor:true
            },

        ]
    },
    {
        groupKey: 'g5',
        groupTitle: 'Media',
        fields: [
            {
                id: 'images',
                label: 'Images',
                fieldType: 'image',
                helpTxt: 'upload max 5 images',
                errorMsg: '',
                required: false,
            },
        ]
    },
]