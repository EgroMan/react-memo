import { Link } from "react-router-dom";
import styles from "./LeaderPage.module.css";
import { getLeaders, updateLeaderData } from "../../api"; 
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function LeadersPage() {
  const [leaders, setLeaders] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const location = useLocation();
  const completedPlayerData = location.state && location.state.completedPlayerData;

  useEffect(() => {
    getLeaders().then((data) => {
      let sortLeaders = data.leaders.sort((leader1, leader2) => leader1.time - leader2.time);
      sortLeaders.forEach((leader, index) => leader.position = index + 1);
      return sortLeaders;
    }).then((sortLeaders) => {
      let updatedLeaders = sortLeaders.map(leaderData => {
        if (completedPlayerData && leaderData.name === completedPlayerData.name) {
          if (!leaderData.achievements) {
            leaderData.achievements = [0, 0];
          }
          if (gameCompleted) {
            leaderData.achievements = [1, 1]; // Обновлять достижения в зависимости от режима завершения игры
          }
        }
        return leaderData;
      });

      if (completedPlayerData) {
        updatedLeaders.push(completedPlayerData); 
      }

      setLeaders(updatedLeaders);
    });
  }, [gameCompleted, completedPlayerData]);

  const handleGameCompletion = () => {
    setGameCompleted(true); 
  };

  return (
    <div className={styles.leadersPageContainer}>
      <div className={styles.header}>
        <h1 className={styles.text}>Лидеры</h1>
        <Link to="/">
          <button className={styles.button}>Начать игру</button>{" "}
        </Link>
      </div>
      <div className={styles.table__header}>
        <h3>Позиция</h3>
        <h3>Пользователь</h3>
        <h3>Достижения</h3>
        <h3>Время</h3>
      </div>
      {leaders
        ? leaders.map((leader, index) => {
            return (
              <div key={index} className={styles.table}>
                <h2>#{leader.position}</h2>
                <h2>{leader.name}</h2>
                <div className={styles.achievements__block}>
                  <div className={`${styles.achievementIcon} ${leader.achievements[1] !== 2 ? styles.acivkaBlockNOTPOWER : styles.acivkaBlockYESPOWER}`}></div>
                  <div className={`${styles.achievementIcon} ${leader.achievements[0] === 1 ? styles.acivkaBlockNotSuper : styles.acivkaBlockYesSuper}`}></div>
                </div>
                <h2>
                  {Math.floor(leader.time / 60)}:{leader.time - Math.floor(leader.time / 60) * 60}
                </h2>
              </div>
            );
          })
        : null}
    </div>
  );
}
