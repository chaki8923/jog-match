"use client";

import { useState } from "react";
import { UpdateUserSchema, UpdateUserSchemaType } from '@/schemas/UpdateUser';
import CropImg from "./cropper";
import { useForm, FormProvider } from 'react-hook-form';
import FadeModal from '@/app/component/modal/fadeModal';
import { Spinner } from "flowbite-react";
import Address from "../component/form/address";
import { zodResolver } from '@hookform/resolvers/zod';
import Head from "next/head";
import styles from "./index.module.scss"



export default function Form({ session }: { session: any }) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(UpdateUserSchema)
  });

  interface FormData {
    postal_code: string;
    name: string;
    state: string;
    line1: string;
    // image: any
  }

  const [childCropData, setChildCropData] = useState<string>(''); // 子から受け取るデータを保持
  // 子から受け取ったデータを更新する関数
  const handleChildData = (data: string) => {
    setChildCropData(data);
  };

  const closeModal = () => {
    setIsSuccess(false);
    setIsVisible(false);
  };


  const onSubmit = async (params: FormData) => {
    setIsSubmit(true);
    let data = {
      name: params.name,
      postal_code: params.postal_code,
      image: childCropData,
      email: session.user.email,
      state: params.state,
      line1: params.line1

    };
    reset();
    await fetch(`/api/profile/`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
        setIsSuccess(true);
      }
    }).catch((err) => {
      alert("メール送信エラー。もう一度お試しください")
    })
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = methods

  return (
    <>
      <Spinner aria-label="Default status example" className={`${isLoading ? styles.spinner : styles.none}`} />
      <Head>
        <title>プロフィール</title>
      </Head>
      <div className={styles.form}>
        {isSuccess ?
          <FadeModal setIsVisible={setIsVisible} closeModal={closeModal} message="プロフィールを更新しました" /> : null}
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl mb-4 text-gray-800 text-center text-bold">プロフィール変更</h2>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className={styles.formContent}>
                <p className="text-gray-600">お名前</p>
                <input
                  type="text"
                  placeholder="田中　太郎"
                  {...register('name')}
                />
                {errors.name && (
                  <span className="self-start text-xs text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div>
                <Address register={register} errors={errors} setValue={setValue} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  画像
                </label>
                <CropImg onDataChange={handleChildData} isSubmit={isSubmit} />
              </div>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`w-full rounded bg-lime-600 p-3 text-white transition ${!isValid || isSubmitting ? "cursor-not-allowed opacity-60" : "hover:bg-lime-700"
                  }`}
              >
                登録
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  )
}