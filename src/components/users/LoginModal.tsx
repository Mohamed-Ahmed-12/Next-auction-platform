// LoginModal.tsx (or similar file)

"use client";

import { useAuth } from "@/context/authContext";
import { LoginCredentials } from "@/types/auth";
import { Button, Checkbox, HelperText, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Define props for the controlled Modal
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    // Form State
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginCredentials>();

    const onSubmit: SubmitHandler<LoginCredentials> = (data: LoginCredentials) => {
        setLoading(true);
        login(data)
            .then(() => {
                toast.success('👋 Welcome back');
                onCloseModal();
            })
            .catch((err) => {
                // console.error(err); // Changed to console.error for better visibility
                toast.error(err.message || 'Login Failed');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function onCloseModal() {
        // We call the external onClose function provided by the parent
        onClose();
        reset();
    }

    return (
        <Modal show={isOpen} onClose={onCloseModal} size="lg" popup>
            <ModalHeader className="border-b border-gray-200 p-4">Sign in to our platform</ModalHeader>
            <ModalBody className="p-4">
                <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    {/* Username Input */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username">Username *</Label>
                        </div>
                        <TextInput
                            {...register("username", { required: "Username is required" })}
                            id="username"
                            type="text"
                            placeholder="Your Username"
                            color={errors.username ? "failure" : "gray"}
                        />
                        {errors.username && <HelperText>{errors.username.message}</HelperText>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password">Password *</Label>
                        </div>
                        <TextInput
                            {...register("password", { required: "Password is required" })}
                            id="password" // Renamed from password1 for consistency
                            type="password"
                            placeholder="Your Password"
                            color={errors.password ? "failure" : "gray"}
                        />
                        {errors.password && <HelperText>{errors.password.message}</HelperText>}
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    {/* Login Button with Loading Spinner */}
                    <Button type="submit" disabled={loading} className="my-2">
                        Login
                        {loading && <Spinner size="sm" aria-label="Loading spinner" className="ms-2" light />}
                    </Button>
                </form>
            </ModalBody>
        </Modal>
    );
}