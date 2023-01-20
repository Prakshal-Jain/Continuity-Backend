import Head from 'next/head'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Navbar from '@/components/Navbar'
import { useRef } from 'react'
import "animate.css/animate.min.css"
import Footer from '@/components/Footer'


export default function Home() {
  const scrollRef = useRef(null);
  return (
    <>
      <Head>
        <title>Continuity</title>
        <meta name="description" content="Experience seamless and productive browsing with Continuity - tabs synced across all devices, secure personal info, a built-in content creator mind, and much more!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar scrollTarget={scrollRef} />
        <Hero />
        <Features scrollTarget={scrollRef} />
        <Footer />
      </main>
    </>
  )
}
