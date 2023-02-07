import { WarningIcon } from "@chakra-ui/icons";
import {
  Flex,
  Image,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useState } from "react";

import { differenceInMonths } from "lib/utils/date";

interface GithubRepositoryOwner {
  html_url: string;
  login: string;
}

interface GithubRepository {
  id: string;
  name: string;
  html_url: string;
  description: string;
  updated_at: string;
  owner: GithubRepositoryOwner;
}

const Home = () => {
  const [repositories, setRepositories] = useState([]);
  const fetchRepositories = async (value: string) => {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${value}%20in:name%20titanium%20in:topics%20language:objc+language:swift+language:java+language:kotlin&sort=updated&order=desc`,
      {
        headers: {
          "User-Agent": "Titanium Module Search",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    setRepositories(data.items);
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <NextSeo title="Titanium Module Search" />
      <Image
        height="100"
        src="https://titaniumsdk.com/images/titanium-logo.png"
      />
      <Text fontWeight="bold" fontSize="30">
        Titanium SDK | Module Search
      </Text>
      <Input
        placeholder="Search Titanium Module …"
        size="lg"
        onChange={(event) => fetchRepositories(event.target.value)}
      />
      {repositories?.length > 0 && (
        <TableContainer width="100%" mt="5">
          <Table variant="simple">
            <TableCaption>{repositories.length} results</TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Author</Th>
                <Th>Last Updated</Th>
              </Tr>
            </Thead>
            <Tbody>
              {repositories.map((repository: GithubRepository) => {
                return (
                  <Tr key={repository.id}>
                    <Td maxWidth="200">
                      <Link href={repository.html_url} target="_blank">
                        <Text isTruncated>{repository.name}</Text>
                      </Link>
                      <Text isTruncated fontSize="12" color="gray.400">
                        {repository.description}
                      </Text>
                    </Td>
                    <Td>
                      <Link href={repository.owner.html_url} target="_blank">
                        @{repository.owner.login}
                      </Link>
                    </Td>
                    <Td>
                      {new Date(repository.updated_at).toLocaleDateString()}{" "}
                      {differenceInMonths(
                        new Date(repository.updated_at),
                        new Date()
                      ) > 24 && (
                        <Tooltip
                          hasArrow
                          borderRadius="6"
                          label="This module hasn't been updated since > 2 years. You can help - contribute today!"
                        >
                          <WarningIcon color="orange.600" />
                        </Tooltip>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Flex>
  );
};

export default Home;
