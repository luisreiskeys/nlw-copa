import { Heading, useToast, VStack } from "native-base";
import { Header } from "../componets/Header";
import { Input } from "../componets/Input";
import { Button } from "../componets/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const toast = useToast();
  const { navigate } = useNavigation();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoinPool() {
    if (!code.trim()) {
      return toast.show({
        title: "Informe o código do bolão",
        placement: "top",
        duration: 3000,
        bgColor: "red.500",
      });
    }
    try {
      setIsLoading(true);
      await api.post("/pools/join", { code });
      toast.show({
        title: "Você entrou no bolão com sucesso",
        placement: "top",
        duration: 3000,
        bgColor: "green.500",
      });
      setIsLoading(false);
      navigate("pools");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (error.response?.data?.message !== "") {
        return toast.show({
          title: error.response?.data?.message,
          placement: "top",
          duration: 3000,
          bgColor: "red.500",
        });
      }
      toast.show({
        title: "erro ao buscar os bolões",
        placement: "top",
        duration: 3000,
        bgColor: "red.500",
      });
    }
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title="Buscar por código"
        showBackButton
        backButtonRoute={"pools"}
      />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          color="white"
          fontFamily="heading"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"}seu código único
        </Heading>
        <Input
          placeholder="Qual o código do bolão"
          mb={2}
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />
        <Button
          title="Buscar bolão"
          onPress={handleJoinPool}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  );
}
