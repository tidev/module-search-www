import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm">
        {new Date().getFullYear()} -{" "}
        <Link href="titaniumsdk.com/" isExternal rel="noopener noreferrer">
          TiDev Inc.
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
