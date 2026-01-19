import { Spinner } from "flowbite-react";

export default function loading() {
    return (
        <div className="flex justify-center items-center w-full h-full absolute top-0">
            <Spinner color="red" aria-label="loading" size="xl" />
        </div>
    )
}