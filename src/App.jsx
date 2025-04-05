import { useState } from 'react';
import { ChakraProvider, Box, Container, Heading, Button, VStack, Text, Input, HStack, useToast } from '@chakra-ui/react';
import { Web3Provider, useWeb3 } from './context/Web3Context';

function AppContent() {
  const { account, proposals, loading, connectWallet, addProposal, vote } = useWeb3();
  const [newProposal, setNewProposal] = useState('');
  const toast = useToast();

  const handleAddProposal = async () => {
    if (!newProposal.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a proposal description',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await addProposal(newProposal);
      setNewProposal('');
      toast({
        title: 'Success',
        description: 'Proposal added successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add proposal',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Binary Voting DApp</Heading>

        {!account ? (
          <Button colorScheme="blue" onClick={connectWallet} isLoading={loading}>
            Connect Wallet
          </Button>
        ) : (
          <Box>
            <Text mb={4}>Connected: {account.slice(0, 6)}...{account.slice(-4)}</Text>

            <VStack spacing={4} align="stretch" mb={8}>
              <Input
                placeholder="Enter new proposal"
                value={newProposal}
                onChange={(e) => setNewProposal(e.target.value)}
              />
              <Button colorScheme="green" onClick={handleAddProposal} isLoading={loading}>
                Add Proposal
              </Button>
            </VStack>

            <VStack spacing={4} align="stretch">
              {proposals.map((proposal) => (
                <Box key={proposal.id} p={4} borderWidth={1} borderRadius="md">
                  <Text fontWeight="bold" mb={2}>{proposal.description}</Text>
                  <HStack justify="space-between">
                    <Text>Agree: {proposal.agreeCount}</Text>
                    <Text>Disagree: {proposal.disagreeCount}</Text>
                  </HStack>
                  <HStack mt={4} spacing={4}>
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => vote(proposal.id, true)}
                      isLoading={loading}
                    >
                      Agree
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => vote(proposal.id, false)}
                      isLoading={loading}
                    >
                      Disagree
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

function App() {
  return (
    <ChakraProvider>
      <Web3Provider>
        <AppContent />
      </Web3Provider>
    </ChakraProvider>
  );
}

export default App; 