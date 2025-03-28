export const fetchPokemonList = async (page: number) => {
    const limit = 20;
    const offset = (page - 1) * limit;
  
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
  
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
        totalPages: Math.ceil(data.count / limit),
      };
    } catch (error) {
      console.error("Failed to fetch Pokémon:", error);
      throw error;
    }
  };