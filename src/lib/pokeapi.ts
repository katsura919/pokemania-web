const ITEMS_PER_PAGE = 20;

export async function fetchPokemonList(page = 1) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  
  // Fetch basic list with pagination
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`
  );
  const data = await response.json();
  const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);

  // Fetch details for the current page
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