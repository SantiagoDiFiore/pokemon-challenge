/* eslint-disable jsx-a11y/alt-text */
import {
  Box,
  AspectRatio,
  Image,
  Stack,
  Progress,
  Text,
  Badge,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { typeColors } from "@/const";
import { handleStatsColor, handleTypeColor } from "@/helpers";

export default function PokemonData({ pokemon }) {
  const [catched, setCatched] = useState(false);
  const [catchedPokemon, setcatchedPokemon] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/catched");
        const isCatched = response.data.some((p) => p.id === pokemon.id);
        setCatched(isCatched);
        setcatchedPokemon(response.data);
      } catch (error) {
        console.error("Error fetching caught Pokemon:", error);
      }
    };

    fetchData();
  }, [pokemon.id]);

  const handleCatch = async () => {
    try {
      const response = await axios.post("/api/catched", {
        id: pokemon.id,
        name: pokemon.name,
      });
      setCatched(true);
      setcatchedPokemon((prevCatchedPokemon) => [
        ...prevCatchedPokemon,
        response.data,
      ]);
    } catch (error) {
      console.error("Error catching Pokemon:", error);
    }
  };

  const handleRelease = async () => {
    try {
      await axios.delete(`/api/catched/${pokemon.id}`);
      setCatched(false);
      setcatchedPokemon((prevCatchedPokemon) =>
        prevCatchedPokemon.filter((p) => p.id !== pokemon.id)
      );
    } catch (error) {
      console.error("Error releasing Pokemon:", error);
    }
  };

  return (
    <Stack spacing="5" pb="5">
      <Stack spacing="5" position="relative">
        <Box position="absolute" right="0" zIndex="99">
          <Checkbox
            isChecked={catched}
            onChange={() => (catched ? handleRelease() : handleCatch())}
          >
            Catched
          </Checkbox>
        </Box>
        <AspectRatio w="full" ratio={1}>
          <Image
            objectFit="contain"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`}
          />
        </AspectRatio>
        <Stack
          direction="row"
          spacing={{ base: 2, md: 7 }}
          align="center"
          justifyContent="center"
        >
          <Stack>
            <Text fontSize="sm">Weight</Text>
            <Text>{pokemon.weight}</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Height</Text>
            <Text>{pokemon.height}</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Movimientos</Text>
            <Text>{pokemon.moves.length}</Text>
          </Stack>
          <Stack>
            <Text fontSize="sm">Tipos</Text>
            <HStack>
              {pokemon.types.map((type) => (
                <Badge
                  size="xs"
                  colorScheme={handleTypeColor(type.type.name, typeColors)}
                  key={type.slot}
                >
                  {type.type.name}
                </Badge>
              ))}
            </HStack>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing="5" p="5" bg="gray.100" borderRadius="xl">
        <Stack>
          <Text fontSize="xs">hp</Text>
          <Progress
            bg="gray.300"
            borderRadius="full"
            colorScheme={handleStatsColor(pokemon.stats[0].base_stat)}
            value={pokemon.stats[0].base_stat}
          />
        </Stack>
        <Stack>
          <Text fontSize="xs">attack</Text>
          <Progress
            bg="gray.300"
            colorScheme={handleStatsColor(pokemon.stats[1].base_stat)}
            borderRadius="full"
            value={pokemon.stats[1].base_stat}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
