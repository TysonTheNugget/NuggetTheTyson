// src/components/BattleArena.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import OrdinookiCard from './OrdinookiCard';
import { calculateDamage, determineTurnOrder } from '../utils/battleUtils';
import ordinookiData from '../ordinooki';
import { getAnimation } from '../styles/animations';

// Styled component for animating the Ordinooki cards
const AnimatedCard = styled.div`
  animation: ${props => getAnimation(props.isAttacking, props.isBeingAttacked, props.side)};
`;

const BattleArena = () => {
  const [player1] = useState(ordinookiData[0]);
  const [player2] = useState(ordinookiData[1]);
  const [health1, setHealth1] = useState(player1.meta.stats.HP);
  const [health2, setHealth2] = useState(player2.meta.stats.HP);
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [isAttacking1, setIsAttacking1] = useState(false);
  const [isAttacking2, setIsAttacking2] = useState(false);
  const [isBeingAttacked1, setIsBeingAttacked1] = useState(false);
  const [isBeingAttacked2, setIsBeingAttacked2] = useState(false);

  useEffect(() => {
    if (battleInProgress) {
      const interval = setInterval(() => {
        handleBattle();
      }, 3000); // Slowing down the battle to 3 seconds per turn

      return () => clearInterval(interval);
    }
  }, [battleInProgress, health1, health2]);

  const handleBattle = () => {
    if (health1 <= 0 || health2 <= 0) {
      setBattleInProgress(false);
      return;
    }

    const [first, second] = determineTurnOrder(player1, player2);

    if (health1 > 0 && health2 > 0) {
      // First Ordinooki attacks
      if (first === player1) {
        setIsAttacking1(true);
        setTimeout(() => {
          setIsAttacking1(false);
          setIsBeingAttacked2(true);
          let damage = calculateDamage(first, second);
          setHealth2(prevHealth => Math.max(prevHealth - damage, 0));
          setTimeout(() => setIsBeingAttacked2(false), 500); // End the shake animation
        }, 500); // Wait for the attack animation to start before impact
      } else {
        setIsAttacking2(true);
        setTimeout(() => {
          setIsAttacking2(false);
          setIsBeingAttacked1(true);
          let damage = calculateDamage(first, second);
          setHealth1(prevHealth => Math.max(prevHealth - damage, 0));
          setTimeout(() => setIsBeingAttacked1(false), 500); // End the shake animation
        }, 500);
      }
    }

    if (health1 > 0 && health2 > 0) {
      // Second Ordinooki attacks
      setTimeout(() => {
        if (second === player1) {
          setIsAttacking1(true);
          setTimeout(() => {
            setIsAttacking1(false);
            setIsBeingAttacked2(true);
            let damage = calculateDamage(second, first);
            setHealth2(prevHealth => Math.max(prevHealth - damage, 0));
            setTimeout(() => setIsBeingAttacked2(false), 500); // End the shake animation
          }, 500);
        } else {
          setIsAttacking2(true);
          setTimeout(() => {
            setIsAttacking2(false);
            setIsBeingAttacked1(true);
            let damage = calculateDamage(second, first);
            setHealth1(prevHealth => Math.max(prevHealth - damage, 0));
            setTimeout(() => setIsBeingAttacked1(false), 500); // End the shake animation
          }, 500);
        }
      }, 1500); // Delay before the second Ordinooki attacks
    }
  };

  const startBattle = () => {
    setBattleInProgress(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '50px' }}>
      <AnimatedCard isAttacking={isAttacking1} isBeingAttacked={isBeingAttacked1} side="left">
        <OrdinookiCard ordinooki={player1} health={health1} />
      </AnimatedCard>
      <button onClick={startBattle} disabled={battleInProgress}>Fight!</button>
      <AnimatedCard isAttacking={isAttacking2} isBeingAttacked={isBeingAttacked2} side="right">
        <OrdinookiCard ordinooki={player2} health={health2} />
      </AnimatedCard>
    </div>
  );
};

export default BattleArena;