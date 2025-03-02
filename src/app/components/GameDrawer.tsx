'use client';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useTeams } from '@/app/context/TeamContext';
import { useDeviceId } from '../hooks/useDeviceId';
import { Card } from '@/components/ui/card';

interface GameDrawerProps {
  isOpen: boolean;
  onNextRound: () => void;
  teamTurn: number;
  teamScores: { team1: number; team2: number };
}

export default function GameDrawer({ isOpen, onNextRound, teamTurn, teamScores }: GameDrawerProps) {
  const { team1, team2 } = useTeams();
  const { clearDeviceId } = useDeviceId();

  return (
    <Drawer open={isOpen} onClose={onNextRound}>
      <DrawerContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 text-foreground rounded-t-lg shadow-xl">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Round Over!
          </DrawerTitle>
        </DrawerHeader>
        <div className="text-center space-y-2 sm:space-y-3">
          <p className="text-lg sm:text-xl font-semibold text-destructive">
            {teamTurn === 1 ? team1 : team2}, your time is up!
          </p>
          <p className="text-md sm:text-lg text-muted-foreground">
            Switching to{' '}
            <span className="font-bold text-primary">{teamTurn === 1 ? team2 : team1}</span>.
          </p>
        </div>
        <Card className="p-3 sm:p-4 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-primary">Current Scores</h3>
          <div className="flex justify-between text-md sm:text-lg font-bold mt-1 sm:mt-2 px-3 sm:px-4">
            <p className="text-secondary-foreground">
              {team1}: <span className="text-primary">{teamScores.team1}</span>
            </p>
            <p className="text-secondary-foreground">
              {team2}: <span className="text-primary">{teamScores.team2}</span>
            </p>
          </div>
        </Card>
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <Button
            onClick={onNextRound}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg shadow-lg transition-all"
          >
            Start Next Round
          </Button>
          <Button
            variant="destructive"
            onClick={clearDeviceId}
            className="w-full font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg shadow-lg transition-all"
          >
            Reset Game & Teams
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
