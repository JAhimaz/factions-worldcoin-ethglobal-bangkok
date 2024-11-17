"use client";

import { FC, useEffect, useState } from "react";
import styles from "./FactionTen.module.scss";
import { factionData } from "../FactionPage/Faction";
import CountdownToSunday from "@/utils/CountdownToSunday";
// Displays the last hundred faction picks
const FactionTen: FC<{
  factionPicks: factionData[]
}> = ({ factionPicks }) => {

  return (
    <section className={styles.factionTen}>
      {/* Display the last address */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className={styles.lastAddress}>
          Last 10 Picks
        </div>

        {/* Countdown to 12:00AM GMT 8+ SUNDAY EVERY WEEK */}
        <CountdownToSunday />

      </div>
      <section className={styles.factionGrid}>
        {factionPicks.map((factionPick, index) => (
          <div className={styles.factionGridItem} key={factionPick.address}>
            <div className={styles.factionGridItemContent} onClick={() => {
              // redirect to a blockscout link with the txid
              window.open(`https://worldchain-mainnet.explorer.alchemy.com/tx/${factionPick.txid}`, '_blank');
            }} style={{
              animationDelay: `${index * 0.1}s`,
              backgroundColor: `var(--${factionPick.faction})`
            }}/>  
          </div>
        ))}

        {/* Map out the remaining as styles.factionGridItemEmpty */}
        {Array.from({ length: 10 - factionPicks.length }).map((_, index) => (
          <div className={styles.factionGridItem} key={index} style={{
            animationDelay: `${(factionPicks.length + index) * 0.1}s`
          }} />
        ))}
      </section>
    </section>
  )
}




export default FactionTen;