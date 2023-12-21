import { Link } from "react-router-dom"
import styles from "./LeaderPage.module.css"
import { getLeaders } from "../../api"
import { useEffect, useState } from "react"

export function LeadersPage() {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        getLeaders().then((data) => {
            const sortedLeaders = data.leaders.sort((a, b) => a.time - b.time);
            const leadersWithPosition = sortedLeaders.map((leader, index) => ({
                ...leader,
                position: index + 1,
            }));
            setLeaders(leadersWithPosition);
        });
    }, []);

    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.text}>Лидерборд</h1>
                <Link to="/">
                    <button className={styles.button}>Начать игру</button>
                </Link>
            </div>
            <div className={styles.table__header}>
                <h3 style={{ fontWeight: "100" }}>Позиция</h3>
                <h3 style={{ fontWeight: "lighter" }}>Пользователь</h3>
                <h3 style={{ fontWeight: "lighter" }}>Время</h3>
            </div>
            {leaders.map((leader, index) => (
                <div key={index} className={styles.table}>
                    <h2>#{leader.position}</h2>
                    <h2>{leader.name}</h2>
                    <h2>
                        {Math.floor(leader.time / 60)}:{leader.time % 60}
                    </h2>
                </div>
            ))}
        </>
    );
}
