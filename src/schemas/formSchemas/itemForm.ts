import { FormFieldGroup } from "@/types/formfield";

export const ItemFormFields: FormFieldGroup[] = [
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
                placeholder: 'Item title',
            },
            {
                id: 'auction',
                label: 'Auction',
                fieldType: 'select',
                helpTxt: 'Upcoming auctions only can select',
                errorMsg: '',
                required: true,
                placeholder: '',
                options:'auction'
            },
            {
                id: 'category',
                label: 'Category',
                fieldType: 'select',
                helpTxt: '',
                errorMsg: '',
                required: true,
                placeholder: '',
                options:'category'
            },

        ]
    },
    {
        groupKey: 'g2',
        groupTitle: 'Pricing',
        fields: [
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
        groupKey: 'g3',
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
            },

        ]
    },

]