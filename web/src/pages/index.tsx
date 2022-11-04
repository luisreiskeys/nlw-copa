interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}
import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoimg from "../assets/logo.svg";
import usersAvatarsExampleImg from "../assets/users-avatars-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

export default function Home(props: HomeProps) {
  const [poolTitle, setPollTitle] = useState("");
  async function createPoll(event: FormEvent) {
    event.preventDefault();
    try {
      const reponse = await api.post("/pools", { title: poolTitle });
      const { code } = reponse.data;
      await navigator.clipboard.writeText(code);
      alert(
        "Bolão criado com sucesso, o código foi copiado para a àrea de transferência"
      );
      setPollTitle("");
    } catch (e) {
      alert("Falha ao criar o bolão, tente novamente mais tarde!");
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoimg} alt="Logo NlW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarsExampleImg} alt="Users avatars" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>
        <form onSubmit={createPoll} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 border text-sm text-gray-100"
            type="text"
            placeholder="Qual o nome do seu bolão?"
            required
            value={poolTitle}
            onChange={(event) => setPollTitle(event.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="text-gray-300 leading-relaxed mt-4 text-sm">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-gray-600 text-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="Check" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px h-14 bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="Check" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        quality={100}
        alt="dois celulares exibindo um preview do app"
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
