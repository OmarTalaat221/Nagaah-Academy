import { Link } from 'react-router-dom';
import styles from './ProfileSidebar.module.css';
import { useState } from 'react';

export default function ProfileSidebar({ handleLogOut, setActiveTab }) {
  const [isActive, setIsActive] = useState('profile')
  
  const handleTabClick = (tab) => {
    setIsActive(tab);
    setActiveTab(tab);
  }

  return (
    // <div className={`${styles.sidebarContainer}`}>
    <ul className={styles.sidebarContainer}>
    <li className={`${isActive === 'profile' && styles.active}`} onClick={() => handleTabClick('profile')} >
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </span>
      <span>حسابي</span>
    </li>
    <li className={`${isActive === 'saved' && styles.active}`} onClick={() => handleTabClick('saved')} >
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </span>
      <span>المحفوظات</span>
    </li>
    <li className={!isActive && styles.active} onClick={() => {
      setIsActive('logout')
      handleLogOut()
    }}>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      </span>
      <span>تسجيل الخروج</span>
    </li>
  </ul>
  
    // </div>
  )
}
