'use client';
import styles from '../page.module.css';
import { z } from 'zod';
import { useZorm } from 'react-zorm';
import { useState } from 'react';
import Link from 'next/link';

const schema = z.object({
  address: z.string().min(1).max(100),
  currentValue: z.preprocess((v: unknown) => +(v as string), z.number().min(0)),
  loanAmount: z.preprocess((v: unknown) => +(v as string), z.number().min(0)),
});

function ErrorMessage(props: { message: string }) {
  return <div className={styles.errorMessage}>{props.message}</div>;
}

export default function HouseForm() {
  const [createdId, setCreatedId] = useState();
  const [error, setError] = useState<string>();
  const zo = useZorm('house', schema, {
    onValidSubmit: async (e) => {
      e.preventDefault();
      const { data } = e;
      const res = await fetch('/api/houses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const { house, error } = await res.json();
      if (error) return setError(error);
      setCreatedId(house.id);
    },
  });

  const disabled = zo.validation?.success === false;

  return (
    <div className={styles.formContainer}>
      <form className={styles.houseForm} ref={zo.ref}>
        Adress:
        <input
          type="text"
          name={zo.fields.address()}
          className={zo.errors.address('errored')}
        />
        {zo.errors.address((e) => (
          <ErrorMessage message={e.message} />
        ))}
        Current Value:
        <input
          type="text"
          name={zo.fields.currentValue()}
          className={zo.errors.currentValue('errored')}
        />
        {zo.errors.currentValue((e) => (
          <ErrorMessage message={e.message} />
        ))}
        Loan amount:
        <input
          type="text"
          name={zo.fields.loanAmount()}
          className={zo.errors.loanAmount('errored')}
        />
        {zo.errors.loanAmount((e) => (
          <ErrorMessage message={e.message} />
        ))}
        <button disabled={disabled} type="submit">
          Create house
        </button>
      </form>
      {createdId && (
        <Link href={`/${createdId}`}>
          House id {createdId} was created successfully. Click here to go to
          house
        </Link>
      )}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
