import { Link } from "react-router-dom";
import styles from "./LeaderPage.module.css";
import { getLeaders } from "../../api";
import { useEffect, useState } from "react";

export function LeadersPage() {
  const [leaders, setLeaders] = useState();
  const gameCompleted = true;

  useEffect(() => {
    getLeaders()
      .then((data) => {
        let sortLeaders = data.leaders.sort((leader1, leader2) => leader1.time - leader2.time);
        let length = sortLeaders.length;
  
        for (let i = 0; i < length; i++) {
          sortLeaders[i].position = i + 1;
        }
  
        return sortLeaders;
      })
      .then((sortLeaders) => {
        let newLeaders = sortLeaders.map((leaderData) => {
          if (!Object.prototype.hasOwnProperty.call(leaderData, "achievements")) {
            return { ...leaderData, achievements: [0, 0] };
          }
          return leaderData;
        });
  
        if (gameCompleted) {
          newLeaders = newLeaders.map((leaderData) => {
            let achievements = [0, 0];
            if (!leaderData.achievements) {
              achievements = [1, 1];
            } else {
              if (!leaderData.achievements[0]) {
                achievements[0] = 1;
              }
              if (!leaderData.achievements[1]) {
                achievements[1] = 1;
              }
            }
            return { ...leaderData, achievements: achievements };
          });
        }
  
        setLeaders(newLeaders);
      });
  }, [gameCompleted]);
  

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
