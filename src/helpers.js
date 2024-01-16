export function handleStatsColor(pokemonStat) {
  let color;

  if (pokemonStat >= 33 && pokemonStat <= 66) {
    color = "yellow";
  } else if (pokemonStat > 66) {
    color = "green";
  } else {
    color = "red";
  }

  return color;
}

export function handleTypeColor(pokemonType, typeColors) {
  const matchingType = typeColors.find((type) => type.name === pokemonType);
  const colorName = matchingType.colorName;
  return colorName;
}
