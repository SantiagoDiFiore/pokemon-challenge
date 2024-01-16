import {
  Box,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { Search2Icon } from "@chakra-ui/icons";
import { useState } from "react";
import PokemonData from "@/components/PokemonData";

const SearchPokemon = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPokemonName("");
    setPokemonData(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    setPokemonName(e.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      setPokemonData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setError("There is no such Pokemon with that name");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box>
        <IconButton
          position="fixed"
          bottom="20"
          left="4"
          zIndex="100"
          icon={<Search2Icon />}
          aria-label="Star"
          size="lg"
          color="grey.400"
          onClick={handleSearchClick}
        />
      </Box>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search for a Pokemon</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="5">
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Enter Pokemon name"
                value={pokemonName}
                onChange={handleInputChange}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleSearchSubmit}
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              </InputRightElement>
            </InputGroup>

            {error && (
              <Box mt="3" color="red.500">
                {error}
              </Box>
            )}

            {pokemonData && <PokemonData pokemon={pokemonData} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchPokemon;
