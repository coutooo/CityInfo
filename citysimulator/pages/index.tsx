import Head from 'next/head'
import Image from 'next/image'
//import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

//const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>City Info</title>
      </Head>
      <div className={styles.container}>
        <form action="/api/notify_interest" method="POST">
          <input type="text" name="file_name" placeholder="Enter file name" className={styles.input} />
          <button type="submit" className={styles.button}>Notify Interest</button>
        </form>
      </div>
    </>
  )
}

