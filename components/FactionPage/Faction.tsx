"use client";

import { useEffect, useState } from "react";
import Factions from "../Factions/Factions";
import FactionTen from "../FactionTen/FactionTen";
import { FactionInternalData, Factions as FactionTypes } from "../types"
import { VerifyBlock } from "../Verify";
import AttackMenu from "../Attack/Attack";


const Faction = () => {

  const [ factionPicks, setFactionPicks ] = useState<factionData[]>([]);
  const [ factionStats, setFactionStats ] = useState<{
    red: FactionInternalData;
    green: FactionInternalData;
    blue: FactionInternalData;
  }>({
    red: {
      engagements: 0,
      users: 0,
      attack: 0,
      defense: 0,
      power: 0
    },
    green: {
      engagements: 0,
      users: 0,
      attack: 0,
      defense: 0,
      power: 0
    },
    blue: {
      engagements: 0,
      users: 0,
      attack: 0,
      defense: 0,
      power: 0
    }
  });

  useEffect(() => {
    let isMounted = true; // Prevent execution on cleanup
  
    const interval = setInterval(() => {
      if (!isMounted) return;
  
      const newFactionPick = GenerateRandomFactionPick();
  
      setFactionPicks((prev) => {
        const updated = [...prev, newFactionPick];
        return updated.length > 10 ? updated.slice(1) : updated;
      });
  
      setFactionStats((prev) => {
        const updatedStats = { ...prev };
        updatedStats[newFactionPick.faction].users += 1;
        return updatedStats;
      });
    }, 2000);
  
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <FactionTen factionPicks={factionPicks} />
      <Factions statistics={factionStats}/>
      <AttackMenu />
    </>
  );
}


export type factionData = {
  address: string;
  faction: FactionTypes;
  timestamp: number;
  blockNumber: number;
  txId: string;
}

// For dev testing
const GenerateRandomFactionPick = () : factionData => {

  const factions = ["red", "blue", "green"];

  const factionItem = {
    address: "0x" + Math.random().toString(36).slice(2),
    faction: factions[Math.floor(Math.random() * factions.length)] as FactionTypes,
    timestamp: Math.floor(Math.random() * Date.now()),
    blockNumber: Math.floor(Math.random() * 1000000),
    txId: "0x" + Math.random().toString(10).slice(2)
  }

  return factionItem;
}


export default Faction;