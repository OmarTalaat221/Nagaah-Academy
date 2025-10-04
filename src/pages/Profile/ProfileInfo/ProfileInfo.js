import styles from "./ProfileInfo.module.css";

export default function ProfileInfo({ userData }) {
  return (
    <div className={`${styles.ProfileInfoContainer}`}>
      <h2>معلومات الملف الشخصي</h2>
      <div className={styles.info}>
        <div>
          <p className={styles.title}>الاسم</p>
          <h4>{userData?.student_name}</h4>
        </div>

        <div>
          <p className={styles.title}>البريد الإلكتروني</p>
          <h4>{userData?.student_email}</h4>
        </div>

        <div>
          <p className={styles.title}>رقم الهاتف</p>
          <h4>{userData?.phone}</h4>
        </div>
      </div>
    </div>
  );
}
