'use-client';
import { PrismaClient } from '@prisma/client';
import { getHouse } from '../models/house';
import styles from '../page.module.css';
import Link from 'next/link';

export default async function House({ params }: { params: { id: string } }) {
  const house = await getHouse(+params.id); // NOTE: Not using the api because it's redundant in server components.
  return (
    <>
      <div className={styles.formContainer}>
        <div className={styles.houseForm}>
          {house ? (
            <>
              <p>address: {house.address}</p>
              <p>currentValue: {house.currentValue}</p>
              <p>loanAmount: {house.loanAmount}</p>
              <p>risk: {house.risk}</p>
            </>
          ) : (
            <>No house with id {params.id}</>
          )}
          <br />
          <Link href="/">Go to homepage</Link>
          <Link href={`/edit/${params.id}`}>Edit</Link>
        </div>
      </div>
    </>
  );
}
