import {
  Box,
  Stack,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { StarIcon, CloseIcon, ViewIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import PokemonData from "@/components/PokemonData";

const FavoritePokemon = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPokemonDataModalOpen, setIsPokemonDataModalOpen] = useState(false);
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [pokemonData, setPokemonData] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");

  const handleStarClick = () => {
    setIsModalOpen(true);

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/catched");

        const data = response.data;

        const caughtPokemonArray = Array.isArray(data)
          ? data
          : data.catchedPokemon;

        setCaughtPokemon(caughtPokemonArray || []);
      } catch (error) {
        console.error("Error fetching caught Pokemon:", error);
      }
    };

    fetchData();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPokemonDataModalOpen(false);
  };

  const handleRelease = async (pokemonId) => {
    try {
      await axios.delete(`/api/catched/${pokemonId}`);
      setCaughtPokemon((prevCatchedPokemon) =>
        prevCatchedPokemon.filter((p) => p.id !== pokemonId)
      );
    } catch (error) {
      console.error("Error releasing Pokemon:", error);
    }
  };

  const handleViewDetails = async (pokemonName) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      setPokemonData(response.data);
      setSelectedPokemon(pokemonName);
      setIsPokemonDataModalOpen(true);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box>
        <IconButton
          position="fixed"
          bottom="4"
          left="4"
          zIndex="100"
          icon={<StarIcon />}
          aria-label="Star"
          size="lg"
          color="yellow.400"
          onClick={handleStarClick}
        />
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="sm"
        scrollBehavior={scrollBehavior}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Captured Pokémons</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {caughtPokemon.length === 0 ? (
              <Text>No Pokémon captured yet.</Text>
            ) : (
              <Stack spacing="3">
                {caughtPokemon.map((pokemon) => (
                  <HStack key={pokemon.id} justifyContent="space-between">
                    <Text key={pokemon.id} textTransform="capitalize">
                      {pokemon.name}
                    </Text>
                    <HStack>
                      <IconButton
                        icon={<ViewIcon />}
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleViewDetails(pokemon.name)}
                      />
                      <IconButton
                        icon={<CloseIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleRelease(pokemon.id)}
                      />
                    </HStack>
                  </HStack>
                ))}
              </Stack>
            )}
            {selectedPokemon && (
              <Modal
                isOpen={isPokemonDataModalOpen}
                onClose={() => setIsPokemonDataModalOpen(false)}
                size="sm"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{pokemonData.name}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {pokemonData && <PokemonData pokemon={pokemonData} />}
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FavoritePokemon;
