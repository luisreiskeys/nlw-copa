import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { Header } from "../componets/Header";
import { Loading } from "../componets/Loading";
import { api } from "../services/api";
import { PoolCardProps } from "../componets/PoolCard";
import { PoolHeader } from "../componets/PoolHeader";
import { EmptyMyPoolList } from "../componets/EmptyMyPoolList";
import { Option } from "../componets/Option";
import { Share } from "react-native";
import { Guesses } from "../componets/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const toast = useToast();

  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolões",
        placement: "top",
        duration: 3000,
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        backButtonRoute={"pools"}
        showShareButton
        onShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>
          <Guesses
            poolId={poolDetails.id}
            code={poolDetails.code}
            onShare={handleCodeShare}
          />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} onShare={handleCodeShare} />
      )}
    </VStack>
  );
}
