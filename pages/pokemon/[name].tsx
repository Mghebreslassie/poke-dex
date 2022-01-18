import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { PokeResults } from "..";
import { Pokedex, Pokemon } from "../../types";

const PokePage: NextPage<{ data: Pokemon; desc: Pokedex }> = ({
  data,
  desc,
}) => {
  return (
    <div>
      <h1>
        Poke Page for <strong>{`#${data.id}`}</strong>
      </h1>
      <h1>{data.name}</h1>
      <Image
        src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${data.id}.svg`}
        layout="fixed"
        width={230}
        height={190}
        alt={data.name}
      />
      <h4>{data.types.map((p) => p.type.name).join(" ")}</h4>
      <h5>{`Height: ${data.height}`}</h5>
      <h5>{`Weight: ${data.weight}`}</h5>
      <p>{desc.flavor_text_entries[0].flavor_text}</p>
      <Link href="/" passHref={true}>
        <h3>Go back</h3>
      </Link>
    </div>
  );
};

export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=150");
  const { results }: { results: PokeResults["PokeResults"] } = await res.json();

  const paths = results.map((p) => {
    return { params: { name: `${p.name}` } };
  });

  return { paths, fallback: false };
};
export const getStaticProps = async ({
  params,
}: {
  params: { name: string };
}) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.name}`);
  const intel = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${params.name}/`
  );
  const data = await res.json();
  const desc = await intel.json();

  return {
    props: { data: data, desc: desc },
  };
};
export default PokePage;
