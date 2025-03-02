'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import GameDrawer from '@/app/components/GameDrawer';
import { useGameLogic } from '@/app/hooks/useGameLogic';
import Loading from '@/app/components/ui/Loading';
import TimerToast from '@/app/components/TimerToast';
import { useTeams } from '@/app/context/TeamContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PublicPersonsGame() {
  const { team1, team2, deviceId } = useTeams();
  const [gameStarted, setGameStarted] = useState(false);
  const {
    persons,
    currentIndex,
    timeLeft,
    isDrawerOpen,
    teamTurn,
    teamScores,
    loading,
    handleCorrectGuess,
    handleNextRound,
  } = useGameLogic(gameStarted, deviceId!);

  if (loading) return <Loading />;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 ${teamTurn === 1 ? 'bg-blue-100' : 'bg-green-100'}`}
    >
      {timeLeft > 0 && gameStarted && <TimerToast timeLeft={timeLeft} />}

      {/* Start Game Modal */}
      <Dialog open={!gameStarted}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Start the Game</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Click below to begin the game!</p>
          <Button onClick={() => setGameStarted(true)} className="w-full mt-4">
            Start Game
          </Button>
        </DialogContent>
      </Dialog>

      {/* Game Content - Hidden Until Game Starts */}
      {gameStarted && (
        <div className={`max-w-md w-full mt-4  rounded-lg p-4`}>
          <Card className="shadow-lg bg-white rounded-lg p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {teamTurn === 1 ? team1 : team2}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <Image
                src={persons[currentIndex].image}
                alt={persons[currentIndex].name}
                width={200}
                height={300}
                className="rounded-lg shadow-md"
              />
              <h2 className="text-xl font-semibold text-gray-900">{persons[currentIndex].name}</h2>
              <p className="text-gray-600 text-sm">{persons[currentIndex].description}</p>
              <Button onClick={handleCorrectGuess} variant="default" className="w-full">
                Correct Guess
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <GameDrawer
        isOpen={isDrawerOpen}
        onNextRound={handleNextRound}
        teamTurn={teamTurn}
        teamScores={teamScores}
      />
    </div>
  );
}
