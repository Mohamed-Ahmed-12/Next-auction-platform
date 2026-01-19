import { axiosInstance } from "@/lib/network";

export async function importData({ modelLabel, data }: { modelLabel: string, data: string[]}): Promise<void> {
    await axiosInstance.post('import-data/', {
        'dj_model': modelLabel,
        'data': data,
    });

}