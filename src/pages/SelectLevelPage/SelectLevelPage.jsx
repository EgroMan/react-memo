import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { CheckboxFunc } from "../../components/EndGameModal/checkBox";
import { setGameNumber } from "../../store/sliceGame";
import { useDispatch } from "react-redux";

export function SelectLevelPage() {
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link onClick={() => {dispatch(setGameNumber(1));}} className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link onClick={() => {dispatch(setGameNumber(2));}} className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link onClick={() => {dispatch(setGameNumber(3));}} className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <CheckboxFunc />
        <Link to="/game/leaderboard" className={styles.leaderLinkButton}>
          <button className={styles.button}>Наши лидеры</button>
        </Link>
      </div>
    </div>
  );
}
