import React from 'react';
import styles from "./preloader.module.scss"

const Preloader = () => {
    const rows = 10;
    const cols = 10;

    return (
        <div className={styles.wrapper}>
            <div className={styles.grid}>
                {[...Array(rows * cols)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.cell}
                        style={{
                            animationDelay: `${(i % cols) * 80 + Math.floor(i / cols) * 60}ms`,
                        }}
                    />
                ))}
            </div>
            <p className={styles.text}>Загрузка интерфейса...</p>
        </div>
    );
};

export default Preloader;