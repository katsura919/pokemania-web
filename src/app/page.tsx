"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/hero/navbar";

export default function Home() {
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-6">
        {loading && <p className="mt-2 text-center">Loading...</p>}
        {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
        {pokemon && (
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={pokemon.sprites.other["official-artwork"].front_default} 
              alt={pokemon.name} 
              className="w-32 h-32 md:w-40 md:h-40 mx-auto"
            />
            <h2 className="text-xl md:text-2xl font-bold capitalize text-yellow-400 drop-shadow-lg">
              {pokemon.name}
            </h2>
            <p className="text-lg">ID: {pokemon.id}</p>
            <p className="text-lg">Type: {pokemon.types.map((t: any) => t.type.name).join(", ")}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
