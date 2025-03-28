import { PokemonCard } from "./pokemon-card";

interface PokemonGridProps {
  pokemonList: {
    id: number;
    name: string;
    image: string;
    types: string[];
    stats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
    height: number;
    weight: number;
  }[];
}

export function PokemonGrid({ pokemonList }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemonList.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}