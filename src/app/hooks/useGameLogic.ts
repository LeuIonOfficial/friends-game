"use client";
import { useState, useEffect } from "react";
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

export function useGameLogic(gameStarted: boolean, deviceId: string) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [teamTurn, setTeamTurn] = useState<number>(1);
  const [teamScores, setTeamScores] = useState<TeamScores>({
    team1: 0,
    team2: 0,
  });
  const [roundScores, setRoundScores] = useState<RoundScores>({
    1: {
      team1Score: 0,
      team2Score: 0,
    },
  });
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [remainingPersons, setRemainingPersons] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPersons() {
      try {
        const response = await fetch("/api/persons");
        const data: Person[] = await response.json();
        setPersons(data);
        setRemainingPersons(new Set(data.map((p) => p.id)));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch persons:", error);
      }
    }
    fetchPersons();
  }, []);

  useEffect(() => {
    if (persons.length === 0) return;
    if (!gameStarted) return;

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

    return () => clearInterval(timer);
  }, [persons, teamTurn, gameStarted]);

  const handleCorrectGuess = () => {
    if (persons.length === 0) return;

    setRemainingPersons((prev) => {
      const newSet = new Set(prev);
      newSet.delete(persons[currentIndex].id);
      return newSet;
    });

    setTeamScores((prev) => ({
      ...prev,
      [teamTurn === 1 ? "team1" : "team2"]:
        prev[teamTurn === 1 ? "team1" : "team2"] + 1,
    }));

    setRoundScores((prev) => ({
      ...prev,
      [currentRound]: {
        ...prev[currentRound],
        [teamTurn === 1 ? "team1Score" : "team2Score"]:
          prev[currentRound][teamTurn === 1 ? "team1Score" : "team2Score"] + 1,
      },
    }));

    handleNextPerson();
  };

  const handleNextPerson = () => {
    if (remainingPersons.size === 0 || persons.length === 0) return;

    let nextIndex = (currentIndex + 1) % persons.length;
    while (!remainingPersons.has(persons[nextIndex].id)) {
      nextIndex = (nextIndex + 1) % persons.length;
      if (nextIndex === currentIndex) return; // Prevent infinite loop
    }
    setCurrentIndex(nextIndex);
  };

  const handleNextRound = async () => {
    const nextRound = currentRound + 1;
    setTimeLeft(60);
    setTeamTurn((prev) => (prev === 1 ? 2 : 1));
    setIsDrawerOpen(false);
    setCurrentRound(nextRound);
    setRoundScores((prev) => ({
      ...prev,
      [nextRound]: {
        team1Score: 0,
        team2Score: 0,
      },
    }));

    try {
      await fetch("/api/game", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          roundNumber: currentRound,
          team1Score: roundScores[currentRound].team1Score,
          team2Score: roundScores[currentRound].team2Score,
        }),
      });
    } catch (error) {
      console.error("Failed to store team scores:", error);
    }
  };

  return {
    persons,
    currentIndex,
    timeLeft,
    isDrawerOpen,
    teamTurn,
    teamScores,
    remainingPersons,
    loading,
    handleCorrectGuess,
    handleNextRound,
    roundScores,
    currentRound,
  };
}
