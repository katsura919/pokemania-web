'use client';

import { useState, useEffect } from 'react';
import { PokemonGrid } from "@/components/pokemonlist/pokemon-grid";
import { Pagination } from "@/components/pokemonlist/pagination";
import { fetchPokemonList } from "@/lib/pokeapi";
import { Metadata } from "next";

// Client component doesn't support export metadata directly
// You'll need to handle this in your layout or parent component

export default function PokemonPage() {
  const [page, setPage] = useState(1);
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { pokemonList: data, totalPages: pages } = await fetchPokemonList(page);
        setPokemonList(data);
        setTotalPages(pages);
      } catch (error) {
        console.error("Failed to load Pokémon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Loading Pokémon...</p>
        </div>
      </main>
    );
  }

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
      <Pagination 
        page={page} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </main>
  );
}