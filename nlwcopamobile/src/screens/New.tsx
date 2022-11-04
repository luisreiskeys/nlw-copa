import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";
import { Header } from "../componets/Header";
import Logo from "../assets/logo.svg";
import { Input } from "../componets/Input";
import { Button } from "../componets/Button";
import { api } from "../services/api";
export function New() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsUserLoading] = useState(false);

  const toast = useToast();

  async function handlePoolCreate() {
    if (!title.trim()) {
      return toast.show({
        title: "Informe um nome para o seu bolão",
        placement: "top",
        duration: 3000,
        bgColor: "red.500",
      });
    }
    try {
      setIsUserLoading(true);
      await api.post("/pools", { title });
      toast.show({
        title: "Bolão criado com sucesso",
        placement: "top",
        duration: 3000,
        bgColor: "green.500",
      });
      setTitle("");
    } catch (e) {
      console.log(e);
      toast.show({
        title: "Não foi possivel criar o bolão, tente novamente mais tarde",
        placement: "top",
        duration: 3000,
        bgColor: "red.500",
      });
    } finally {
      setIsUserLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          color="white"
          fontFamily="heading"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {"\n"}e compartilhe entre amigos!
        </Heading>
        <Input
          placeholder="Qual o nome do seu bolão"
          mb={2}
          value={title}
          onChangeText={setTitle}
        />
        <Button
          title="Criar meu bolão"
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />
        <Text textAlign="center" color="gray.200" mt={4} px={10} fontSize="sm">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
