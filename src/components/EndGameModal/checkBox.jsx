import styles from "./EndGameModal.module.css";
import { toggleGameRegime } from "../../store/sliceGame"; // Импортируем нужный экшн
import { useDispatch } from "react-redux";

export function CheckboxFunc() {
  const dispatch = useDispatch();
  return (
    <div className={styles.checkbox}>
      <input
        id="checkBoxInput"
        className={styles.custom__box}
        onClick={() => dispatch(toggleGameRegime())} // Вызываем экшн для изменения состояния
        type="checkBox"
      ></input>
      <label htmlFor="checkBoxInput"></label>
      <h2>Легкий режим</h2>
    </div>
  );
}
