'use client';
import styles from '../../page.module.css';
import { z } from 'zod';
import { useZorm } from 'react-zorm';
import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { House } from '@/app/models/house';

const schema = z.object({
  address: z.string().min(1).max(100),
  currentValue: z.preprocess((v: unknown) => +(v as string), z.number().min(0)),
  loanAmount: z.preprocess((v: unknown) => +(v as string), z.number().min(0)),
});

function ErrorMessage(props: { message: string }) {
  return <div className={styles.errorMessage}>{props.message}</div>;
}

export default function EditHouse({ params }: { params: { id: string } }) {
  const [successVisible, setSuccessVisible] = useState(false);
  const {
    data,
    error: fetchingError,
    isLoading,
  } = useSWR<{ house: House }>(`/api/houses/${params.id}`, (url: string) =>
    fetch(url, { next: { tags: ['house-tag'] } }).then((res) => res.json())
  );
  const [error, setError] = useState<string>();
  const zo = useZorm('editHouse', schema, {
    onValidSubmit: async (e) => {
      e.preventDefault();
      const { data } = e;
      const res = await fetch(`/api/houses/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      const { error } = await res.json();
      if (error) return setError(error);
      setSuccessVisible(true);
    },
  });

  const disabled = zo.validation?.success === false;
  const house = data?.house;
  return house ? (
    <div className={styles.formContainer}>
      <form className={styles.houseForm} ref={zo.ref}>
        Adress:
        <input
          type="text"
          name={zo.fields.address()}
          className={zo.errors.address('errored')}
          defaultValue={house.address}
        />
        {zo.errors.address((e) => (
          <ErrorMessage message={e.message} />
        ))}
        Current Value:
        <input
          type="text"
          name={zo.fields.currentValue()}
          className={zo.errors.currentValue('errored')}
          defaultValue={house.currentValue}
        />
        {zo.errors.currentValue((e) => (
          <ErrorMessage message={e.message} />
        ))}
        Loan amount:
        <input
          type="text"
          name={zo.fields.loanAmount()}
          className={zo.errors.loanAmount('errored')}
          defaultValue={house.loanAmount}
        />
        {zo.errors.loanAmount((e) => (
          <ErrorMessage message={e.message} />
        ))}
        <button disabled={disabled} type="submit">
          Edit house
        </button>
      </form>
      {error && <ErrorMessage message={error} />}
      {successVisible && (
        <Link href={`/${house.id}`}>
          House was edited successfully. go to house
        </Link>
      )}
    </div>
  ) : (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : fetchingError ? (
        <p>Error in fetching {error}</p>
      ) : (
        <></>
      )}
    </>
  );
}
