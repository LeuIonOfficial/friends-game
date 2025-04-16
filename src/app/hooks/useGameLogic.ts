'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

interface Person {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface TeamScores {
  team1: number;
  team2: number;
}

interface RoundScores {
  [key: number]: {
    team1Score: number;
    team2Score: number;
  };
}

// Game configuration constants
const ROUND_DURATION = 60; // seconds
const MAX_ROUNDS = 10;

export function useGameLogic(gameStarted: boolean, deviceId: string) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_DURATION);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [teamTurn, setTeamTurn] = useState<number>(1);

  const [roundScores, setRoundScores] = useState<RoundScores>({
    1: {
      team1Score: 0,
      team2Score: 0,
    },
  });

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [remainingPersons, setRemainingPersons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Compute total team scores from round scores
  const teamScores = useMemo<TeamScores>(() => {
    return Object.values(roundScores).reduce(
      (total, round) => {
        return {
          team1: total.team1 + round.team1Score,
          team2: total.team2 + round.team2Score,
        };
      },
      { team1: 0, team2: 0 }
    );
  }, [roundScores]);

  // Load persons data with proper cleanup
  useEffect(() => {
    let isMounted = true;

    async function fetchPersons() {
      try {
        const response = await fetch('/api/persons');
        const data: Person[] = await response.json();

        if (isMounted) {
          setPersons(data);
          setRemainingPersons(new Set(data.map((p) => p.id)));
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch persons:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPersons();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Timer effect with proper cleanup
  useEffect(() => {
    if (persons.length === 0 || !gameStarted || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDrawerOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount or when dependencies change
    return () => clearInterval(timer);
  }, [persons.length, gameStarted, timeLeft]);

  // Debounced function to update scores on server
  const debouncedScoreUpdate = useCallback(
    debounce(async (roundNumber: number, scores: { team1Score: number; team2Score: number }) => {
      try {
        await fetch('/api/game', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deviceId,
            roundNumber,
            team1Score: scores.team1Score,
            team2Score: scores.team2Score,
          }),
        });
      } catch (error) {
        console.error('Failed to update scores:', error);
      }
    }, 2000),
    [deviceId]
  );

  // Effect to update server when round scores change
  useEffect(() => {
    if (gameStarted && roundScores[currentRound]) {
      debouncedScoreUpdate(currentRound, {
        team1Score: roundScores[currentRound].team1Score,
        team2Score: roundScores[currentRound].team2Score,
      });
    }
  }, [roundScores, currentRound, debouncedScoreUpdate, gameStarted]);

  // Check for game end conditions
  useEffect(() => {
    if (gameStarted && (remainingPersons.size === 0 || currentRound > MAX_ROUNDS)) {
      setIsGameOver(true);
    }
  }, [remainingPersons.size, currentRound, gameStarted]);

  // Optimized function to handle correct guesses
  const handleCorrectGuess = useCallback(() => {
    if (persons.length === 0 || timeLeft === 0) return;

    // Update remaining persons
    setRemainingPersons((prev) => {
      const newSet = new Set(prev);
      newSet.delete(persons[currentIndex].id);
      return newSet;
    });

    // Update round scores
    setRoundScores((prev) => {
      const teamKey = teamTurn === 1 ? 'team1Score' : 'team2Score';
      return {
        ...prev,
        [currentRound]: {
          ...prev[currentRound],
          [teamKey]: prev[currentRound][teamKey] + 1,
        },
      };
    });

    // Move to next person
    handleNextPerson();
  }, [persons, currentIndex, teamTurn, currentRound, timeLeft]);

  // Optimized next person selection - randomized
  const handleNextPerson = useCallback(() => {
    if (remainingPersons.size === 0 || persons.length === 0) return;

    // Get array of available IDs
    const availableIds = Array.from(remainingPersons);
    if (availableIds.length === 0) return;

    // Select random person from remaining
    const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
    const nextIndex = persons.findIndex((p) => p.id === randomId);

    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
    }
  }, [persons, remainingPersons]);

  // Optimized function to handle round transitions
  const handleNextRound = useCallback(async () => {
    try {
      // Ensure current round scores are saved
      await fetch('/api/game', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          roundNumber: currentRound,
          team1Score: roundScores[currentRound].team1Score,
          team2Score: roundScores[currentRound].team2Score,
        }),
      });

      // Prepare next round
      const nextRound = currentRound + 1;

      // Reset state for new round
      setTimeLeft(ROUND_DURATION);
      setTeamTurn((prev) => (prev === 1 ? 2 : 1));
      setIsDrawerOpen(false);

      // Initialize next round scores
      setRoundScores((prev) => ({
        ...prev,
        [nextRound]: {
          team1Score: 0,
          team2Score: 0,
        },
      }));

      // Update current round
      setCurrentRound(nextRound);

      // If few persons left, reset the pool
      if (remainingPersons.size < 5) {
        setRemainingPersons(new Set(persons.map((p) => p.id)));
      }
    } catch (error) {
      console.error('Failed to store team scores:', error);
    }
  }, [deviceId, currentRound, roundScores, persons, remainingPersons]);

  // Reset game state
  const resetGame = useCallback(() => {
    setCurrentRound(1);
    setTeamTurn(1);
    setTimeLeft(ROUND_DURATION);
    setIsDrawerOpen(false);
    setRoundScores({
      1: {
        team1Score: 0,
        team2Score: 0,
      },
    });
    setRemainingPersons(new Set(persons.map((p) => p.id)));
    setIsGameOver(false);
  }, [persons]);

  return {
    persons,
    currentIndex,
    timeLeft,
    isDrawerOpen,
    teamTurn,
    teamScores,
    remainingPersons,
    loading,
    isGameOver,
    currentRound,
    handleCorrectGuess,
    handleNextRound,
    roundScores,
    resetGame,
    MAX_ROUNDS,
  };
}
