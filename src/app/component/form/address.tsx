'use client'
import { useState } from "react";
import axios from 'axios';
import styles from "./index.module.scss"


// Props の型定義
type formProps = {
  register: any; // `register` の型
  errors: any;      // `errors` の型
  setValue: any; // `setValue` の型
};

export default function Address(props: formProps) {
  const [zipcode, setZipcode] = useState('');   // 郵便番号

  const getAddress = async (): Promise<void> => {
    const res = await axios.get("https://zipcloud.ibsnet.co.jp/api/search", {
      params: { zipcode: zipcode },
    });
    console.log(res);
    if (res.data.status === 200) {
      props.setValue('state', res.data.results[0].address1, { shouldValidate: true }); // React Hook Form の値を更新
      props.setValue('line1', res.data.results[0].address2 + res.data.results[0].address3 ,{ shouldValidate: true });
    } else {
      props.setValue('state', '', { shouldValidate: true });
      props.setValue('line1', '', { shouldValidate: true });
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <h4 className={styles.label}>住所</h4>
        <div className={styles.formAddress}>
          <div className={styles.dispFlexCol}>
            <div className={styles.formContent}>
              <p className="text-gray-600">郵便番号</p>
              <input
                type="text"
                placeholder="例）0123456"
                {...props.register('postal_code')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZipcode(e.target.value)}
              />
              <span className={styles.autoInputBtn} onClick={getAddress}>住所自動入力</span>
              {props.errors.postal_code && (
                <span className="self-start text-xs text-red-500">{props.errors.postal_code.message}</span>
              )}
            </div>
            <div className={styles.formContent}>
              <p className="text-gray-600">都道府県</p>
              <input
                type="text"
                {...props.register('state')}

              />
              {props.errors.state && (
                <span className="self-start text-xs text-red-500">{props.errors.state.message}</span>
              )}
            </div>
            <div className={styles.formContent}>
              <p className="text-gray-600">市区町村</p>
              <input
                type="text"
                {...props.register('line1')}

              />
              {props.errors.line1 && (
                <span className="self-start text-xs text-red-500">{props.errors.line1.message}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}