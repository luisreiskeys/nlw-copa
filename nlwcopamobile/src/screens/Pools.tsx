import { useCallback, useState } from "react";
import { Icon, useToast, VStack, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { Button } from "../componets/Button";
import { Header } from "../componets/Header";
import { api } from "../services/api";
import { PoolCard, PoolCardProps } from "../componets/PoolCard";
import { Loading } from "../componets/Loading";
import { EmptyPoolList } from "../componets/EmptyPoolList";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export function Pools({ navigation }) {
  const toast = useToast();
  const { navigate } = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  const [pools, setPools] = useState<PoolCardProps[]>([]);

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        duration: 3000,
        bgColor: "green.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="Buscar bolão por código"
          onPress={() => navigation.navigate("find")}
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={<EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
