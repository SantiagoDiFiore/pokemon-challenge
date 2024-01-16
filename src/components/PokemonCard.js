/* eslint-disable jsx-a11y/alt-text */
import {
  Stack,
  Text,
  Image,
  HStack,
  Badge,
  AspectRatio,
} from "@chakra-ui/react";
import { typeColors } from "@/const";
import { handleTypeColor } from "@/helpers";

export default function PokemonCard({ pokemon }) {
  return (
    <Stack
      spacing="5"
      boxShadow="xl"
      p="5"
      w="full"
      borderRadius="xl"
      alignItems="center"
    >
      <AspectRatio w="full" ratio={1}>
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png`}
        />
      </AspectRatio>
      <Text textAlign="center" textTransform="Capitalize">
        {pokemon.name}
      </Text>
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
  );
}
