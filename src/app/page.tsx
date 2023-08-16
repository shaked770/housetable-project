import styles from './page.module.css';
import Link from 'next/link';
import { getAllHouses } from './models/house';

export default async function Home() {
  const houses = await getAllHouses();
  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        {houses.map((house) => (
          <Link href={`/${house.id}`} key={house.id} className={styles.card}>
            <h2>{house.address}</h2>
            <p>value: {house.currentValue}</p>
            <p>loanAmount: {house.loanAmount}</p>
            <p>risk: {house.risk}</p>
          </Link>
        ))}
      </div>

      <Link className={styles.addButton} href={'/create'}>
        +
      </Link>
    </main>
  );
}
