"use client";
import { FC, useState } from "react";
import styles from "./Attack.module.scss";
import CountdownToEndOfDay from "@/utils/CountdownToEndOfDay";
import { Icon } from "@/utils/Icons";
import { HandleVerify } from "../Verify/verify";

const Colors = [
  "green",
  "blue"
]

const AttackMenu: FC = () => {

  const [ selectedAttack, setSelectedAttack ] = useState<string | undefined>(undefined);

  return (
    <section className={styles.attackMenu}>
      <div className={styles.dailyTimer}>
        <CountdownToEndOfDay />
      </div>

      { Colors.map((color) => (
        <div key={color} className={selectedAttack === color ? styles.attackItemSelected : styles.attackItem} 
        onClick={() => {
          if(selectedAttack !== color) {
            setSelectedAttack(color);
          }
        }}
        style={{
          backgroundColor: `var(--${color})`,
        }}>
          { selectedAttack === color && (
            <Icon icon="attack"
            
            onClick={() => 
              HandleVerify({
                action: "attack_" + color,
                verification_level: "orb",
                onSuccess: () => setSelectedAttack(undefined),
                onFail: () => setSelectedAttack(undefined),
              })}
            style={{
              width: '2rem',
              height: '2rem',
              color: 'var(--background)',
            }} />
          )}
        </div>
      ))}
    </section>
  )
}

export default AttackMenu;