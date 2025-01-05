import { z } from 'zod'

const allowedExtensions = ['jpg', 'jpeg', 'png'];

export const UpdateUserSchema = z
  .object({
    postal_code: z
      .string({ required_error: '必須項目です', invalid_type_error: '入力値に誤りがります' })
      .min(7, { message: '郵便番号を正しく入力してください' })
      .max(7, { message: '郵便番号を正しく入力してください' }),
    name: z
      .string({ invalid_type_error: '入力値に誤りがります' })
      .min(1, { message: 'お名前を入力してください' })
      .max(20, { message: 'お名前は20文字以内で入力して下さい。' }),
    state: z
      .string({ required_error: '必須項目です',invalid_type_error: '入力値に誤りがります' })
      .max(20, { message: '都道府県は20文字以内で入力して下さい。' }),
    line1: z
      .string({ required_error: '必須項目です', invalid_type_error: '入力値に誤りがります' })
      .min(1, { message: 'お名前を入力してください' })
      .max(20, { message: 'お名前は20文字以内で入力して下さい。' })
    // image: z
    //   .any({ required_error: '必須項目です'})
    //   .refine((fileName) => {
    //     const extension = fileName.split('.').pop()?.toLowerCase(); // 拡張子を取得
    //     return extension ? allowedExtensions.includes(extension) : false; // 許可リストに含まれるかを確認
    //   }, {
    //     message: 'Invalid image file extension. Allowed extensions are: jpg, jpeg, png',
    //   })
  })

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>

