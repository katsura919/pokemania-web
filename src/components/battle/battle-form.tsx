"use client";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LottieSpinner } from "@/components/spinner";

interface BattleFormProps {
  setBattleData: (data: { winner_id: number | null; winner_name: string | null }) => void;
}

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
  const [firstPokemon, setFirstPokemon] = useState("");
  const [secondPokemon, setSecondPokemon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);

  const handleBattle = async () => {
    setError("");
    setBattleData({ winner_id: null, winner_name: null });

    if (!firstPokemon || !secondPokemon) {
      setError("Please select both Pokémon");
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
        winner_name: response.data.winner_name
      });
    } catch (err) {
      console.error("Battle Prediction Error:", err);
      setError("Failed to get battle prediction. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        ⚔️ Pokémon Battle Predictor
      </h2>

      <div className="space-y-4">
        {/* First Pokémon Select */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">First Pokémon</label>
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
            <PopoverContent className="w-[300px] p-0">
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

        {/* Second Pokémon Select */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Second Pokémon</label>
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
            <PopoverContent className="w-[300px] p-0">
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
          disabled={loading || !firstPokemon || !secondPokemon}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <LottieSpinner size={20} speed={1.5} />
              Predicting...
            </span>
          ) : (
            "Battle!"
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}