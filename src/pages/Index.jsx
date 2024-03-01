import React, { useState, useEffect } from "react";
import { Box, Button, Container, Heading, Text, VStack, Code, useToast, Spinner } from "@chakra-ui/react";
import { FaCalculator } from "react-icons/fa";

// Helper function to check if a number is a Mersenne prime
const isMersennePrime = (p) => {
  let s = 4;
  for (let i = 1; i < p; i++) {
    s = (s * s - 2) % (2 ** p - 1);
  }
  return s === 0;
};

const Index = () => {
  const [calculating, setCalculating] = useState(false);
  const [primeCandidate, setPrimeCandidate] = useState(3);
  const [foundPrimes, setFoundPrimes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    let isMounted = true;
    const calculateMersennePrimes = async () => {
      setCalculating(true);
      while (isMounted && calculating) {
        if (isMersennePrime(primeCandidate)) {
          setFoundPrimes((prevPrimes) => [...prevPrimes, primeCandidate]);
          toast({
            title: `New Mersenne Prime Found!`,
            description: `2^${primeCandidate} - 1 is a Mersenne prime.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
        setPrimeCandidate(primeCandidate + 2);
        // Artificial delay to mimic computation time
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      setCalculating(false);
    };

    if (calculating) calculateMersennePrimes();
    return () => {
      isMounted = false;
    };
  }, [calculating, primeCandidate, toast]);

  const startCalculating = () => {
    setCalculating(true);
  };

  const stopCalculating = () => {
    setCalculating(false);
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={5} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Mersenne Prime Generator <FaCalculator />
        </Heading>
        <Text>This website automatically generates Mersenne primes. Just stay on this page, and primes will be calculated in the background.</Text>
        {calculating ? (
          <Button colorScheme="red" onClick={stopCalculating}>
            Stop Calculating
          </Button>
        ) : (
          <Button colorScheme="green" onClick={startCalculating}>
            Start Calculating
          </Button>
        )}
        <Box>{calculating ? <Spinner size="xl" /> : <Text>No calculations in progress.</Text>}</Box>
        <Box>
          <Heading as="h2" size="md">
            Found Mersenne Primes:
          </Heading>
          {foundPrimes.length > 0 ? foundPrimes.map((prime, index) => <Code key={index} children={`2^${prime} - 1`} />) : <Text>No Mersenne primes found yet.</Text>}
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
