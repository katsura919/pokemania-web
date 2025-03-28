"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const router = useRouter();

  // Fetch Pokémon List for Partial Search
  useEffect(() => {
    const fetchPokemonList = async () => {
      if (!search) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const data = await res.json();
        const filteredPokemon = data.results.filter((p: any) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
        setSuggestions(filteredPokemon.slice(0, 5)); // Show top 5 results
      } catch (err) {
        console.error("Error fetching Pokémon list:", err);
        setSuggestions([]);
      }
    };
    fetchPokemonList();
  }, [search]);

  const handleSearch = (name?: string) => {
    const query = name || search.trim();
    if (query) {
      setSearch("");
      setSuggestions([]);
      router.push(`/pokemon/${query.toLowerCase()}`); // Navigate to Pokémon details page
    }
  };
  

  return (
    <nav className="w-full bg-black/90 px-6 py-4 flex items-center justify-between shadow-lg relative">
      {/* Left - Logo & Nav Links */}
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-yellow-400">Pokémon Battle Arena</h1>
        <div className="hidden md:flex gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Home
            </Button>
          </Link>
          <Link href="/battle">
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Battle
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              About
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex flex-col relative w-full max-w-sm">
        <div className="relative">
          <Input
            className="bg-white text-black border-2 border-yellow-400 px-4 py-2 rounded-md pr-10"
            placeholder="Search Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Dropdown Menu (Fixed Position) */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-50">
            {suggestions.map((pokemon) => (
              <li
                key={pokemon.name}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black"
                onClick={() => handleSearch(pokemon.name)}
              >
                {pokemon.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2 rounded-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/90 p-4 flex flex-col items-center gap-4 md:hidden shadow-lg transition-all">
          {/* Mobile Search Bar */}
          <div className="relative w-full max-w-sm">
            <Input
              className="bg-white text-black border-2 border-yellow-400 px-4 py-2 rounded-md pr-10"
              placeholder="Search Pokémon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
            >
              <Search size={20} />
            </button>

            {/* Mobile Dropdown Menu */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden z-50">
                {suggestions.map((pokemon) => (
                  <li
                    key={pokemon.name}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => handleSearch(pokemon.name)}
                  >
                    {pokemon.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="text-white hover:text-yellow-400 w-full">Home</Button>
          </Link>
          <Link href="/battle" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="text-white hover:text-yellow-400 w-full">Battle</Button>
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="text-white hover:text-yellow-400 w-full">About</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
