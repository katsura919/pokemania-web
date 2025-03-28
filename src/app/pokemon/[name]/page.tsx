"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface Pokemon {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
  description: string;
  evolution: string[];
  egg_groups: string[];
  capture_rate: number;
  base_happiness: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": { front_default: string };
      home: { front_default: string };
    };
  };
}

const STAT_NAMES: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-amber-800",
  ghost: "bg-purple-700",
  dragon: "bg-violet-600",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export default function PokemonPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<"artwork" | "sprite">("artwork");

  useEffect(() => {
    if (!name) return;

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        const flavorText = speciesData.flavor_text_entries
          .find((entry: any) => entry.language.name === "en")
          ?.flavor_text.replace(/[\n\f]/g, " ") || "No description available.";

        // Get Egg Groups
        const eggGroups = speciesData.egg_groups.map((g: any) => g.name);

        // Get Evolution Chain
        let evolutions: string[] = [];
        try {
          const evoChainRes = await fetch(speciesData.evolution_chain.url);
          const evoChainData = await evoChainRes.json();
          let evoStage = evoChainData.chain;
          while (evoStage) {
            evolutions.push(evoStage.species.name);
            evoStage = evoStage.evolves_to.length > 0 ? evoStage.evolves_to[0] : null;
          }
        } catch (e) {
          console.error("Error fetching evolution data:", e);
        }

        setPokemon({
          ...data,
          description: flavorText,
          evolution: evolutions,
          egg_groups: eggGroups,
          capture_rate: speciesData.capture_rate || 0,
          base_happiness: speciesData.base_happiness || 0,
        });
      } catch (err) {
        console.error("Error fetching Pokémon data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) return <PokemonSkeleton />;
  if (!pokemon) return <div className="text-center py-10">Pokémon not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div>
              <h1 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">
                {pokemon.name}
              </h1>
              <span className="text-lg text-gray-500 dark:text-gray-400">
                #{pokemon.id.toString().padStart(4, "0")}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedImage === "artwork" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedImage("artwork")}
              >
                Artwork
              </Button>
              <Button
                variant={selectedImage === "sprite" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedImage("sprite")}
              >
                Sprite
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center p-8">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src={
                  selectedImage === "artwork"
                    ? pokemon.sprites.other["official-artwork"].front_default ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
                    : pokemon.sprites.front_default ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                }
                alt={pokemon.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500" />
        </Card>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Types */}
          <div className="flex gap-2">
            {pokemon.types.map((t, index) => (
              <Badge
                key={index}
                className={`${TYPE_COLORS[t.type.name] || "bg-gray-500"} text-white capitalize`}
              >
                {t.type.name}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Pokédex Entry</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                {pokemon.description}
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Base Stats</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {pokemon.stats.map((s, index) => (
                <div key={index} className="grid grid-cols-12 items-center gap-4">
                  <span className="col-span-3 text-sm font-medium capitalize text-gray-500 dark:text-gray-400">
                    {STAT_NAMES[s.stat.name] || s.stat.name}
                  </span>
                  <span className="col-span-1 text-sm font-bold">
                    {s.base_stat}
                  </span>
                  <div className="col-span-8">
                  <Progress
                    value={(s.base_stat / 255) * 100}
                    className={`h-2 ${
                      s.base_stat > 80
                        ? "[&>div]:bg-green-500"
                        : s.base_stat > 50
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-red-500"
                    }`}
                  />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Physical Characteristics */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold">Physical Characteristics</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Height</span>
              <span className="font-medium">{pokemon.height / 10}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Weight</span>
              <span className="font-medium">{pokemon.weight / 10}kg</span>
            </div>
          </CardContent>
        </Card>

        {/* Abilities */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold">Abilities</h2>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {pokemon.abilities.map((a, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {a.ability.name}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Breeding */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold">Breeding</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Egg Groups</span>
              <div className="flex gap-1">
                {pokemon.egg_groups.map((group, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Capture Rate
              </span>
              <span className="font-medium">{pokemon.capture_rate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Base Happiness
              </span>
              <span className="font-medium">{pokemon.base_happiness}</span>
            </div>
          </CardContent>
        </Card>

        {/* Evolution */}
        {pokemon.evolution.length > 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Evolution Chain</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {pokemon.evolution.map((evo, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                          pokemon.id + index
                        }.png`}
                        alt={evo}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="mt-2 font-medium capitalize">{evo}</span>
               
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function PokemonSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-16 mt-2" />
          </CardHeader>
          <CardContent className="flex justify-center p-8">
            <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-full" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-4">
                  <Skeleton className="col-span-3 h-4" />
                  <Skeleton className="col-span-1 h-4" />
                  <Skeleton className="col-span-8 h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}