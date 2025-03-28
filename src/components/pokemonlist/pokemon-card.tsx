import { typeColors } from "@/lib/type-colors";

export function PokemonCard({ pokemon }: { pokemon: {
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
} }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="relative pt-[100%] bg-gray-100">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="absolute top-0 left-0 w-full h-full object-contain p-4"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold capitalize">
            {pokemon.name}
          </h3>
          <span className="text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>
        
        <div className="flex gap-2 mb-3">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${typeColors[type] || 'bg-gray-200'}`}
            >
              {type}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>HP: {pokemon.stats.hp}</div>
          <div>ATK: {pokemon.stats.attack}</div>
          <div>DEF: {pokemon.stats.defense}</div>
          <div>SPD: {pokemon.stats.speed}</div>
        </div>
      </div>
    </div>
  );
}