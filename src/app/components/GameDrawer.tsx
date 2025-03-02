'use client';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useTeams } from "@/app/context/TeamContext";

interface GameDrawerProps {
  isOpen: boolean;
  onNextRound: () => void;
  teamTurn: number;
  teamScores: { team1: number; team2: number };
}

export default function GameDrawer({
  isOpen,
  onNextRound,
  teamTurn,
  teamScores,
}: GameDrawerProps) {
  const { team1, team2 } = useTeams();

  return (
    <Drawer open={isOpen} onClose={onNextRound}>
      <DrawerContent className="p-6 space-y-6 bg-background text-foreground rounded-t-lg">
        <DrawerHeader>
          <DrawerTitle className="text-3xl font-bold text-primary text-center">
            Round Over!
          </DrawerTitle>
        </DrawerHeader>
        <div className="text-center space-y-3">
          <p className="text-xl font-semibold text-destructive">
            {teamTurn === 1 ? team1 : team2}, your time is up!
          </p>
          <p className="text-lg text-muted-foreground">
            Switching to {teamTurn === 1 ? team2 : team1}.
          </p>
        </div>
        <div className="bg-card p-5 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-primary">Current Scores</h3>
          <div className="flex justify-around text-lg font-bold mt-2">
            <p className="text-secondary-foreground">
              {team1}: {teamScores.team1}
            </p>
            <p className="text-secondary-foreground">
              {team2}: {teamScores.team2}
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Button
            onClick={onNextRound}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg shadow-lg transition-all"
          >
            Start Next Round
          </Button>
          <Button variant="destructive" className="w-full">
            Reset Game & Teams
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
