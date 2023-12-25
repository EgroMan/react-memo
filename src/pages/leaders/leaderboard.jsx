import { Link } from "react-router-dom";
import styles from "./LeaderPage.module.css";
import { getLeaders } from "../../api";
import { useEffect, useState } from "react";

export function LeadersPage() {
  const [leaders, setLeaders] = useState();

  useEffect(() => {
    getLeaders()
      .then((data) => {
        let sortLeaders = data.leaders.sort((el, el2) => el.time - el2.time);

        let length = sortLeaders.length;

        for (let i = 0; i < length; i++) {
          sortLeaders[i].position = i + 1;
        }

        return sortLeaders;
      })
      .then((sortLeaders) => {
        let newLeaders = sortLeaders.map((el) => {
          if (!Object.prototype.hasOwnProperty.call(el, "achievements")) {
            return { ...el, achievements: [0, 0] };
          }
          return el;
        });
        setLeaders(newLeaders);
      });
  }, []);

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
        ? leaders.map((el, index) => {
            return (
              <div key={index} className={styles.table}>
                <h2>#{el.position}</h2>
                <h2>{el.name}</h2>
                <div className={styles.achievements__block}>
                  <div className={`${styles.achievementIcon} ${el.achievements[1] !== 2 ? styles.acivkaBlockNOTPOWER : styles.acivkaBlockYESPOWER}`}></div>
                  <div className={`${styles.achievementIcon} ${el.achievements[0] === 1 ? styles.acivkaBlockNotSuper : styles.acivkaBlockYesSuper}`}></div>
                </div>
                <h2>
                  {Math.floor(el.time / 60)}:{el.time - Math.floor(el.time / 60) * 60}
                </h2>
              </div>
            );
          })
        : null}
    </div>
  );
}
