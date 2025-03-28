interface Pokemon {
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
  }
  
  interface PokemonListResponse {
    pokemonList: Pokemon[];
    totalPages: number;
  }
  
  export async function fetchPokemonList(page: number): Promise<PokemonListResponse> {
    const limit = 20;
    const offset = (page - 1) * limit;
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    const totalPages = Math.ceil(data.count / limit);
  
    const detailedPokemon = await Promise.all(
      data.results.map(async (pokemon: { url: string }) => {
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );
  
    return {
      pokemonList: detailedPokemon.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other['official-artwork'].front_default,
        types: pokemon.types.map((type: any) => type.type.name),
        stats: {
          hp: pokemon.stats[0].base_stat,
          attack: pokemon.stats[1].base_stat,
          defense: pokemon.stats[2].base_stat,
          speed: pokemon.stats[5].base_stat,
        },
        height: pokemon.height / 10,
        weight: pokemon.weight / 10,
      })),
      totalPages,
    };
  }