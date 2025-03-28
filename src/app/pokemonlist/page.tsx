import { PokemonGrid } from "@/components/pokemonlist/pokemon-grid";
import { Pagination } from "@/components/pokemonlist/pagination";
import { fetchPokemonList } from "@/lib/pokeapi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pokémon Encyclopedia",
  description: "Browse through all Pokémon",
};

// Add this type to avoid searchParams issues
interface PageProps {
  params: {};
  searchParams: {
    page?: string;
  };
}

export default async function PokemonPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const { pokemonList, totalPages } = await fetchPokemonList(page);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent">
          Pokémon Encyclopedia
        </h1>
        <p className="text-lg text-gray-600">
          Browse through all Pokémon
        </p>
      </div>
      
      <PokemonGrid pokemonList={pokemonList} />
      <Pagination page={page} totalPages={totalPages} />
    </main>
  );
}