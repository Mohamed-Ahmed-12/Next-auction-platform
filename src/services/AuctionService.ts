import { arrayToCommaString } from "@/helpers/filters";
import { axiosInstance } from "../lib/network"
import { Auction } from "@/types/main"
import { AuctionFilterFields } from "@/types/filters";
import { objectToFormData } from "@/helpers/forms";
import { SelectOption } from "@/types/formfield";


export const fetchAuctionByStatus = async (status: string): Promise<Auction[]> => {
    const response = await axiosInstance.get<Auction[]>(`auction/?status=${status}`)
    return response.data
}

export const fetchAuctions = async (): Promise<Auction[]> => {
    const response = await axiosInstance.get<Auction[]>(`auction/`)
    return response.data
}

export const filterAuction = async (fields: AuctionFilterFields): Promise<Auction[]> => {
    const cate = arrayToCommaString(fields.category);
    const status = arrayToCommaString(fields.status);
    const response = await axiosInstance.get<Auction[]>('auction/', {
        params: {
            category: cate,
            status: status,
        }
    })
    return response.data;
}

export const createAuction = async (data: Auction): Promise<Auction> => {
    const response = await axiosInstance.post<Auction>(`auction/`, data)
    return response.data;
}

export const updateAuction = async (data: Auction): Promise<Auction> => {
    const formData = objectToFormData(data, false)
    const response = await axiosInstance.put<Auction>(`auction/${data.slug}/get-update/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

export const fetchAuctionsForSelect = async (): Promise<SelectOption[]> => {
    const response = await axiosInstance.get<SelectOption[]>("dashboard/auction/select-option");
    return response.data;
};