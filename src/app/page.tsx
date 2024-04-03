import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Poppins', backgroundColor: 'white'}}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Image src="/logo.png" alt="Opus Logo" width={200} height={200} style={{ marginBottom: '-40px', marginTop: '-30px' }}/>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-20px' }}>
          <h1 style={{ fontSize: '2.5rem', paddingRight: '-200px', fontFamily: 'Poppins', color: 'black' }}>Welcome to</h1>
          <Image src="/word_logo.png" alt="Opus Logo" width={150} height={150} style={{ paddingLeft: '-100px', marginRight: '-20px', marginLeft: '-14px' }} />
        </div>
        <p style={{ fontFamily: 'Poppins', color: 'black', marginLeft: '25px', marginRight: '25px', marginBottom: '20px', fontWeight: 'thin' }}>Centralize your tasks from all platforms to start doing, with no planning</p>
        <div>
          <Link href="/api/login">
            <Button icon={<GoogleOutlined />} style={{ fontSize: '2vh', height: '63px', padding: '15px 30px', borderRadius: '14px', background: '#007bff', color: '#fff', fontFamily: 'Poppins' }}>Sign in with Google</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
