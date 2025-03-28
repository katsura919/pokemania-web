"use client"; // Add this at the very top

import { useState } from "react";
import axios from "axios";
import pokemonData from "@/data/pokemon.json";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import LottieSpinner to avoid SSR issues
const LottieSpinner = dynamic(
  () => import("@/components/spinner").then((mod) => mod.LottieSpinner),
  { ssr: false }
);

interface BattleFormProps {
  setBattleData: (data: { winner_id: number | null; winner_name: string | null }) => void;
}

// Rest of your interfaces remain the same
interface PokemonOption {
  value: string;
  label: string;
}

interface BattleResult {
  winner_id: number;
  winner_name: string;
}

const pokemonMap: Record<string, number> = pokemonData;
const pokemonOptions: PokemonOption[] = Object.keys(pokemonMap).map(name => ({
  value: name,
  label: name.charAt(0).toUpperCase() + name.slice(1),
}));

export default function BattleForm({ setBattleData }: BattleFormProps) {
  // Your existing state and logic remains the same
  const [firstPokemon, setFirstPokemon] = useState("");
  const [secondPokemon, setSecondPokemon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);

  const handleBattle = async () => {
    // Your existing battle logic remains the same
    setError("");
    setBattleData({ winner_id: null, winner_name: null });

    if (!firstPokemon || !secondPokemon) {
      setError("Please select both Pokémon");
      return;
    }

    if (firstPokemon === secondPokemon) {
      setError("Please select two different Pokémon");
      return;
    }

    const firstId = pokemonMap[firstPokemon];
    const secondId = pokemonMap[secondPokemon];

    if (!firstId || !secondId) {
      setError("Invalid Pokémon selection");
      return;
    }

    const requestData = {
      first_pokemon: firstId,
      second_pokemon: secondId,
    };

    setLoading(true);
    try {
      const response = await axios.post<BattleResult>(
        "https://pokemania.onrender.com/api/predict/",
        requestData
      );
      setBattleData({
        winner_id: response.data.winner_id,
        winner_name: response.data.winner_name.toLowerCase()
      });
    } catch (err) {
      console.error("Battle Prediction Error:", err);
      setError("Failed to get battle prediction. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Swords className="h-6 w-6 text-red-500" />
          Pokémon Battle Predictor
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select two Pokémon to predict the winner
        </p>
      </div>

      <div className="space-y-4">
        {/* First Pokémon Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">First Pokémon</label>
          <Popover open={openFirst} onOpenChange={setOpenFirst}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFirst}
                className="w-full justify-between"
              >
                {firstPokemon
                  ? pokemonOptions.find(p => p.value === firstPokemon)?.label
                  : "Select Pokémon..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search Pokémon..." />
                <CommandEmpty>No Pokémon found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {pokemonOptions.map(pokemon => (
                    <CommandItem
                      key={pokemon.value}
                      value={pokemon.value}
                      onSelect={(currentValue: string) => {
                        setFirstPokemon(currentValue === firstPokemon ? "" : currentValue);
                        setOpenFirst(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          firstPokemon === pokemon.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {pokemon.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* VS Separator */}
        <div className="flex items-center justify-center my-2">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="px-4 text-sm font-medium text-gray-500">VS</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* Second Pokémon Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Second Pokémon</label>
          <Popover open={openSecond} onOpenChange={setOpenSecond}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSecond}
                className="w-full justify-between"
              >
                {secondPokemon
                  ? pokemonOptions.find(p => p.value === secondPokemon)?.label
                  : "Select Pokémon..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search Pokémon..." />
                <CommandEmpty>No Pokémon found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {pokemonOptions.map(pokemon => (
                    <CommandItem
                      key={pokemon.value}
                      value={pokemon.value}
                      onSelect={(currentValue: string) => {
                        setSecondPokemon(currentValue === secondPokemon ? "" : currentValue);
                        setOpenSecond(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          secondPokemon === pokemon.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {pokemon.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Battle Button */}
        <Button
          onClick={handleBattle}
          disabled={loading || !firstPokemon || !secondPokemon || firstPokemon === secondPokemon}
          className="w-full bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white shadow-lg transition-all"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <LottieSpinner size={20} speed={1.5} />
              Predicting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Swords className="h-4 w-4" />
              Battle!
            </span>
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}