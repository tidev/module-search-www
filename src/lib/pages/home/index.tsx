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
  Tr,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useState } from "react";

const Home = () => {
  const [repositories, setRepositories] = useState([]);
  const fetchRepositories = async (value: string) => {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${value}%20in:name%20titanium%20in:topics%20language:objc+language:swift+language:java+language:kotlin&sort=created&order=asc`
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
      <TableContainer width="100%" mt="5">
        <Table variant="simple">
          {repositories.length > 0 && (
            <TableCaption>{repositories.length} results</TableCaption>
          )}
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Author</Th>
              <Th>Last Updated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {repositories.map((repository: any) => {
              return (
                <Tr>
                  <Td maxWidth="200">
                    <Link href={repository.html_url} target="_blank">
                      <Text isTruncated>{repository.name}</Text>
                    </Link>
                    <Text isTruncated fontSize="12">
                      {repository.description}
                    </Text>
                  </Td>
                  <Td>@{repository.owner.login}</Td>
                  <Td>
                    {new Date(repository.updated_at).toLocaleDateString()}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default Home;
