import { FlatList, useToast } from "native-base";
import { useEffect, useState } from "react";
import { api } from "../services/api";

import { Game, GameProps } from "../componets/Game";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
  onShare?: () => void;
}

export function Guesses({ poolId, code, onShare }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const [games, setGames] = useState<GameProps[]>([]);
  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
      console.log(response.data);
    } catch (error) {
      if (error.response?.data?.message !== "") {
        return toast.show({
          title: error.response?.data?.message,
          placement: "top",
          duration: 3000,
          bgColor: "red.500",
        });
      }
      toast.show({
        title: "Não foi possível carregar os jogos",
        placement: "top",
        duration: 3000,
        bgColor: "green.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
      return toast.show({
        title: "Informe o placar do palpite",
        placement: "top",
        duration: 3000,
        bgColor: "red.500",
      });
    }
    try {
      setIsLoading(true);
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });
      toast.show({
        title: "Palpite enviado com sucesso",
        placement: "top",
        duration: 3000,
        bgColor: "green.500",
      });
      fetchGames();
    } catch (error) {
      if (error.response?.data?.message !== "") {
        return toast.show({
          title: error.response?.data?.message,
          placement: "top",
          duration: 3000,
          bgColor: "red.500",
        });
      }
      toast.show({
        title: "Não foi possível enviar o palpite",
        placement: "top",
        duration: 3000,
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);
  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      ListEmptyComponent={<EmptyMyPoolList code={code} onShare={onShare} />}
    />
  );
}
