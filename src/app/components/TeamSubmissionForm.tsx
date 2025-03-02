"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeams } from "@/app/context/TeamContext";

interface TeamSubmissionFormData {
  team1: string;
  team2: string;
  deviceId: string;
}

export function TeamSubmissionForm() {
  const router = useRouter();
  const { deviceId, setTeam1, setTeam2 } = useTeams();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<TeamSubmissionFormData>();

  const onSubmit = async (data: TeamSubmissionFormData) => {
    const submitData = {
      ...data,
      deviceId,
    };

    const response = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });

    if (response.status === 200) {
      setTeam1(data.team1);
      setTeam2(data.team2);
      router.push(`/game`);
    } else {
      const errorData = await response.json();
      setFormError("root", {
        type: "manual",
        message: errorData.message || "Failed to submit teams",
      });
    }
  };

  return (
    <Card className="w-96 m-5 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center">Enter Team Names</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Team 1 Name"
            {...register("team1", { required: "Team 1 name is required" })}
          />
          {errors.team1 && (
            <p className="text-red-500 text-sm">{errors.team1.message}</p>
          )}
          <Input
            placeholder="Team 2 Name"
            {...register("team2", { required: "Team 2 name is required" })}
          />
          {errors.team2 && (
            <p className="text-red-500 text-sm">{errors.team2.message}</p>
          )}
          {errors.root && (
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          )}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
