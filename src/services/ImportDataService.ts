import { axiosInstance } from "@/lib/network";
import { ca } from "date-fns/locale";

export async function importData({ modelLabel, data }: { modelLabel: string, data: string[]}): Promise<void> {
    const response = await axiosInstance.post('import-data/', {
        'dj_model': modelLabel,
        'data': data,
    });

}