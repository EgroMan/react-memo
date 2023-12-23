import { Link } from "react-router-dom"
import styles from "./LeaderPage.module.css"
import { getLeaders } from "../../api"
import { useEffect, useState } from "react"

export function LeadersPage() {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        getLeaders()
            .then((data) => {
                const sortedLeaders = data.leaders.sort((a, b) => a.time - b.time);
                const leadersWithPositions = sortedLeaders.map((leader, index) => ({
                    ...leader,
                    position: index + 1
                }));
                setLeaders(leadersWithPositions);
            })
            .catch((error) => {
                console.error('Error fetching leaders:', error);
            });
    }, []);

    return (
        <div className={styles.leaderboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Лидеры
                </h1>
                <Link to="/">
                    <button className={styles.button}>Начать игру</button>
                </Link>
            </div>
            <div className={styles.table__header}>
                <h3>Позиция</h3>
                <h3>Пользователь</h3>
                <h3>Время</h3>
            </div>
            {leaders.map((leader, index) => (
                <div key={index} className={styles.table}>
                    <h2>#{leader.position}</h2>
                    <h2>{leader.name}</h2>
                    <h2>{`${Math.floor(leader.time / 60)}:${String(leader.time % 60).padStart(2, '0')}`}</h2>
                </div>
            ))}
        </div>
    );
}
