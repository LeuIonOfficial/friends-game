'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import GameDrawer from '@/app/components/GameDrawer';
import { useGameLogic } from '@/app/hooks/useGameLogic';
import Loading from '@/app/components/ui/Loading';
import TimerToast from '@/app/components/TimerToast';
import { useTeams } from '@/app/context/TeamContext';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function PublicPersonsGame() {
  const { team1, team2, deviceId } = useTeams();
  const [gameStarted, setGameStarted] = useState(false);
  const { t } = useTranslation();

  const {
    persons,
    currentIndex,
    timeLeft,
    isDrawerOpen,
    teamTurn,
    teamScores,
    loading,
    isGameOver,
    MAX_ROUNDS,
    handleCorrectGuess,
    handleNextRound,
    resetGame,
  } = useGameLogic(gameStarted, deviceId!);

  // Handle starting a new game
  const handleStartGame = () => {
    setGameStarted(true);
  };

  // Handle restarting the game
  const handleRestartGame = () => {
    resetGame();
    setGameStarted(true);
  };

  // Memoize the person card to prevent unnecessary re-renders
  const PersonCard = useMemo(() => {
    if (!persons[currentIndex]) return null;

    return (
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
          <Button
            onClick={handleCorrectGuess}
            variant="default"
            className="w-full"
            disabled={timeLeft === 0}
          >
            {t('common.correct')}
          </Button>
        </CardContent>
      </Card>
    );
  }, [currentIndex, persons, teamTurn, team1, team2, handleCorrectGuess, timeLeft, t]);

  if (loading) return <Loading />;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 ${
        teamTurn === 1 ? 'bg-blue-100' : 'bg-green-100'
      }`}
    >
      {timeLeft > 0 && gameStarted && <TimerToast timeLeft={timeLeft} />}

      {/* Start Game Modal */}
      <Dialog open={!gameStarted && !isGameOver}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {t('game.startTitle')}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{t('game.startDescription', { rounds: MAX_ROUNDS })}</p>
          <Button onClick={handleStartGame} className="w-full mt-4">
            {t('game.startButton')}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Game Over Modal */}
      <Dialog open={isGameOver}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t('game.gameOver')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-xl font-semibold text-primary mb-4">{t('game.finalScores')}</h3>
            <div className="flex justify-between mb-4 font-bold text-lg">
              <p className="text-blue-600">
                {team1}: {teamScores.team1}
              </p>
              <p className="text-green-600">
                {team2}: {teamScores.team2}
              </p>
            </div>
            <p className="text-xl font-bold">
              {teamScores.team1 > teamScores.team2
                ? t('game.wins', { team: team1 })
                : teamScores.team2 > teamScores.team1
                  ? t('game.wins', { team: team2 })
                  : t('game.tie')}
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleRestartGame} className="w-full">
              {t('game.playAgain')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Game Content - Hidden Until Game Starts */}
      {gameStarted && !isGameOver && (
        <div className="max-w-md w-full mt-4 rounded-lg p-4">{PersonCard}</div>
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
