import { Link } from "react-router-dom"
import styles from "./LeaderPage.module.css"
import { getLeaders } from "../../api"
import { useEffect, useState } from "react"

export function LeadersPage() {
  const [leaders, setLeaders] = useState()

  useEffect(() => {
    getLeaders()
      .then((data) => {
        let sortLeaders = data.leaders.sort((el, el2) => el.time - el2.time)
        let length = sortLeaders.length

        for (let i = 0; i < length; i++) {
          sortLeaders[i].position = i + 1;
          // Добавление обработки достижений
          sortLeaders[i].achievements = [];
          if (sortLeaders[i].completedWithoutSuperpowers) {
            sortLeaders[i].achievements.push("Прошел без использования суперсил");
          }
          if (sortLeaders[i].completedOnHardMode) {
            sortLeaders[i].achievements.push("Завершил на сложном уровне");
          }
        }

        // Обновление состояния с отсортированными и обработанными данными
        setLeaders(sortLeaders);
      })
  }, [])

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.text}>Лидерборд</h1>
        <Link to="/">
          <button className={styles.button}>Начать игру</button>{" "}
        </Link>
      </div>
      <div className={styles.table__header}>
        <h3 style={{ fontWeight: "100" }}>Позиция</h3>
        <h3 style={{ fontWeight: "lighter" }}>Пользователь</h3>
        <h3 style={{ fontWeight: "lighter" }}>Достижения</h3>
        <h3 style={{ fontWeight: "lighter" }}>Время</h3>
      </div>
      {leaders
        ? leaders.map((el, index) => {
            return (
              <div key={index} className={styles.table}>
                <h2>#{el.position}</h2>
                <h2 style={{ position: "absolute", left: "30%" }}>{el.name}</h2>
                <div className={styles.achievements__block}>
                <div
                    className={
                      el.achievements[1] !== 2
                        ? styles.achievements__block_notpowered
                        : styles.achievements__block_powered
                    }
                  ></div>
                  <div
                    className={
                      el.achievements[0] === 1
                        ? styles.achievements__block_notsuper
                        : styles.achievements__block_super
                    }
                  ></div>
                </div>
                <h2>
                  {Math.floor(el.time / 60)}:
                  {el.time - Math.floor(el.time / 60) * 60}
                </h2>
              </div>
            )
          })
        : null}
    </>
  )
}
