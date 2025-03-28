"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Home, Sword, BookOpen } from "lucide-react";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        setSuggestions(filteredPokemon.slice(0, 5));
      } catch (err) {
        console.error("Error fetching Pokémon list:", err);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchPokemonList();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSearch = (name?: string) => {
    const query = name || search.trim();
    if (query) {
      setSearch("");
      setSuggestions([]);
      setMenuOpen(false);
      router.push(`/pokemon/${query.toLowerCase()}`);
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-900 to-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-yellow-400/20">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
          Pokémon Mania
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {/* Navigation Links */}
        <div className="flex gap-2">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-white/90 hover:text-yellow-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Button>
          </Link>
          <Link href="/battle">
            <Button 
              variant="ghost" 
              className="text-white/90 hover:text-yellow-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <Sword size={18} />
              <span>Battle</span>
            </Button>
          </Link>
          <Link href="/pokemonlist">
            <Button 
              variant="ghost" 
              className="text-white/90 hover:text-yellow-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <BookOpen size={18} />
              <span>Encyclopedia</span>
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative w-64" ref={searchRef}>
          <div className={`relative flex items-center transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-yellow-400' : ''} rounded-lg bg-white/10 backdrop-blur-sm`}>
            <Input
              className="bg-transparent border-0 text-white placeholder-white/70 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
              placeholder="Search Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-3 text-white/70 hover:text-yellow-400 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
              {suggestions.map((pokemon) => (
                <li
                  key={pokemon.name}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white/90 hover:text-yellow-400 transition-colors capitalize"
                  onClick={() => handleSearch(pokemon.name)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                >
                  {pokemon.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white/90 hover:text-yellow-400 p-2 rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 p-4 flex flex-col items-center gap-4 md:hidden shadow-xl border-t border-yellow-400/20 animate-in fade-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="relative w-full" ref={searchRef}>
            <div className="relative flex items-center bg-white/10 rounded-lg backdrop-blur-sm">
              <Input
                className="bg-transparent border-0 text-white placeholder-white/70 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                placeholder="Search Pokémon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-3 text-white/70 hover:text-yellow-400 transition-colors"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Mobile Suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                {suggestions.map((pokemon) => (
                  <li
                    key={pokemon.name}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white/90 hover:text-yellow-400 transition-colors capitalize"
                    onClick={() => handleSearch(pokemon.name)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {pokemon.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile Navigation Links */}
          <div className="w-full flex flex-col gap-2">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-yellow-400 hover:bg-white/10 gap-3">
                <Home size={18} />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/battle" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-yellow-400 hover:bg-white/10 gap-3">
                <Sword size={18} />
                <span>Battle</span>
              </Button>
            </Link>
            <Link href="/pokemonlist" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-white/90 hover:text-yellow-400 hover:bg-white/10 gap-3">
                <BookOpen size={18} />
                <span>Encyclopedia</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}