"use client";
import { useEffect, useState } from "react";
import styles from "./Factions.module.scss";
import { FC } from "react";
import { FactionInternalData } from "../types";
import { Icon } from "@/utils/Icons";
import { HandleVerify } from "../Verify/verify";
import { CONTRACTS } from "@/utils/contract/contracts";
import { callReadFunction } from "@/utils/contract/ether-utils";
import { MiniKit } from "@worldcoin/minikit-js";

interface FactionData {
  statistics?: {
    red: FactionInternalData;
    blue: FactionInternalData;
    green: FactionInternalData;
  }
}

const Factions: FC<FactionData> = ({
  statistics
}) => {

  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <section className={styles.factionContainer}>
      { statistics && Object.keys(statistics).map((faction) => (
        <div className={selected === faction ? styles.factionBarSelected : styles.factionBar} id={faction}
        onClick={() => {
          // if selected is already the same as the clicked faction, set selected to undefined
          setSelected(selected === faction ? undefined : faction);
        }}>

          <div className={styles.factionBarFilled} style={{
            height: selected === faction ? `100%` : `${CalculatePercentage(statistics[faction as keyof typeof statistics].users,
              (statistics?.red?.users || 0) + (statistics?.blue?.users || 0) + (statistics?.green?.users || 0))}%`,
              backgroundColor: `var(--${faction})`
            }}/>

          { selected === faction && (
            <div style={{
              position: "absolute",
              width: "fit-content",
              height: "fit-content",
              zIndex: 1,
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: `var(--background)`,
              fontWeight: 'bold',
              fontSize: '1.25rem',
              userSelect: "none",
              // center it
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }} onClick={() => 
              HandleVerify({
                action: "join_faction_" + faction,
                verification_level: "orb",
                onSuccess: (payload) => {
                  console.log("Verification succeeded:", payload);

                  const res = MiniKit.commands.sendTransaction({
                    transaction: [
                      {
                        address: CONTRACTS.Test.address,
                        abi: CONTRACTS.Test.abi,
                        functionName: "implementation",
                        args: []  
                      }
                    ],
                  })

                  console.log(res)

                  setSelected(undefined);
                },
                onFail: (error) => {
                  console.error("Verification failed:", error);
                },
              })
            }>
              <Icon icon="pledge" className={styles.joinButton} style={{
                width: "5rem",
                height: "5rem",
                color: `var(--background)`
              }} />
              <span style={{
                animation: 'SlideFromBottom 0.5s ease-in-out forwards'
              }}>PLEDGE</span>
            </div>
          )}

          {/* Hide statistics */}
          {/* { !selected && 
            <div className={styles.factionBarInfo}>
              <div className={styles.statistic}><Icon icon={"attack"} />{statistics[faction as keyof typeof statistics].engagements.toString().padStart(3, '0')}</div>
              <div className={styles.statistic}><Icon icon={"defense"} />{statistics[faction as keyof typeof statistics].engagements.toString().padStart(3, '0')}</div>
              <div className={styles.statistic}><Icon icon={"power"} />{statistics[faction as keyof typeof statistics].engagements.toString().padStart(3, '0')}</div>
              <div className={styles.statistic} style={{
                marginTop: "auto",
                color: 'var(--button)'
              }}><Icon icon={"pointer"} />{statistics[faction as keyof typeof statistics].engagements.toString().padStart(3, '0')}</div>
            </div>
          } */}

  
        </div>
      ))}
    </section>
  )
}

const CalculatePercentage = (faction: number, total: number) => {
  return (faction / total) * 100;
}

export default Factions;