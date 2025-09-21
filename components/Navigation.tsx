import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navigation.module.css';

export default function Navigation() {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          VerdantRx
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${router.pathname === '/' ? styles.active : ''}`}
          >
            Directory
          </Link>
        </div>
      </div>
    </nav>
  );
}
