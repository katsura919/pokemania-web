import pokemonData from "@/data/pokemon.json";

interface BattleResultProps {
  winner: number | null;
}

export default function BattleResult({ winner }: BattleResultProps) {
  if (!winner) return null;

  // Find the Pokémon by its ID in `pokemonData`
  const winnerPokemon = Object.entries(pokemonData).find(
    ([, id]) => id === winner
  );

  if (!winnerPokemon) return <p className="text-red-500">Error: Pokémon not found!</p>;

  const [name] = winnerPokemon;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${winner}.png`;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-md text-center">
      <h2 className="text-2xl font-bold text-yellow-500">🏆 Winner: {name}</h2>
      <img src={imageUrl} alt={name} className="w-40 h-40 mx-auto my-4" />
      <p className="text-gray-700">This Pokémon emerged victorious in battle!</p>
    </div>
  );
}
