"use client";

import { useAuth } from "@/context/authContext";
import { LoginCredentials } from "@/types/auth";
import { Button, Checkbox, HelperText, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import { HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { BiUser } from "react-icons/bi";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    callbackUrl: string | null | undefined;
}

export function LoginModal({ isOpen, onClose, callbackUrl }: LoginModalProps) {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginCredentials>();

    const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
        setLoading(true);
        login(data, callbackUrl)
            .then(() => {
                toast.success(t('welcomeMsg'));
                onCloseModal();
            })
            .catch((err) => {
                toast.error(err.message || 'Login Failed');
            })
            .finally(() => setLoading(false));
    }

    function onCloseModal() {
        onClose();
        reset();
    }

    return (
        <Modal show={isOpen} onClose={onCloseModal} size="md" popup className="backdrop-blur-sm">
            <ModalHeader dir="ltr" />
            <ModalBody className="px-8 pb-8">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {t('signInTitle')}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                        {t('signInSub')}
                    </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Username */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username" title={t('usernameLabel')} className="font-bold" />
                        </div>
                        <TextInput
                            {...register("username", { required: t('usernameReq') })}
                            id="username"
                            icon={!isRTL ? BiUser : undefined}
                            rightIcon={isRTL ? BiUser : undefined}
                            placeholder="username"
                            color={errors.username ? "failure" : "gray"}
                            className="transition-all"

                        />
                        {errors.username && <HelperText color="failure" className="font-medium">{errors.username.message}</HelperText>}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <div className="mb-2 block">
                            <Label htmlFor="password" title={t('passwordLabel')} className="font-bold" />
                        </div>
                        <div className="relative">
                            <TextInput
                                {...register("password", { required: t('passwordReq') })}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                icon={!isRTL ? HiOutlineLockClosed : undefined}
                                rightIcon={isRTL ? HiOutlineLockClosed : undefined}
                                placeholder="••••••••"
                                color={errors.password ? "failure" : "gray"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                            </button>
                        </div>
                        {errors.password && <HelperText color="failure" className="font-medium">{errors.password.message}</HelperText>}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" className="text-indigo-600 focus:ring-indigo-500" defaultChecked  {...register("rememberMe")}/>
                            <Label htmlFor="remember" className="text-sm cursor-pointer">{t('rememberMe')}</Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 enabled:hover:bg-slate-800 py-1 shadow-xl shadow-slate-200"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Spinner size="sm" />
                                <span>{t('loggingIn')}</span>
                            </div>
                        ) : (
                            <span className="font-bold uppercase tracking-wide">{t('loginBtn')}</span>
                        )}
                    </Button>

                    <div className="text-center mt-4 text-sm text-slate-500">
                        {t('noAccount')}{" "}
                        <button type="button" className="text-indigo-600 font-bold hover:underline">
                            {t('signUp')}
                        </button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
}