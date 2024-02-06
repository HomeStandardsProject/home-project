import * as React from "react";
import { Text, Link, Box, Heading } from "@chakra-ui/react";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";

import { ContentfulRichText } from "../interfaces/contentful-generic";

type Props = {
  content?: ContentfulRichText;
};

const options: Options = {
  renderText: (text) => <Text as="span">{text}</Text>,
  renderMark: {
    [MARKS.BOLD]: (text) => <Text as="b">{text}</Text>,
    [MARKS.ITALIC]: (text) => <Text as="i">{text}</Text>,
    [MARKS.UNDERLINE]: (text) => <Text as="u">{text}</Text>,
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (_, children) => (
      <Heading as="h1" size="lg">
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_2]: (_, children) => (
      <Heading as="h2" size="md">
        {children}
      </Heading>
    ),
    [BLOCKS.HEADING_3]: (_, children) => (
      <Heading as="h3" size="sm">
        {children}
      </Heading>
    ),
    // [BLOCKS.HEADING_3]: (_, children) => (
    //   <Heading as="h4" size="sm" textDecoration="underline">
    //     {children}
    //   </Heading>
    // ),
    [BLOCKS.HEADING_4]: (_, children) => (
      <Heading as="h4" size="xs">
        {children}
      </Heading>
    ),
    [BLOCKS.QUOTE]: (_, children) => (
      <Box bg="gray.100" borderRadius="sm">
        <Text as="i" p={2}>
          {children}
        </Text>
      </Box>
    ),
    [BLOCKS.PARAGRAPH]: (_, children) => <Text>{children}</Text>,
    [BLOCKS.UL_LIST]: (_, children) => (
      <Box as="ul" px="24pt">
        {children}
      </Box>
    ),
    [BLOCKS.OL_LIST]: (_, children) => {
      return (
        <Box as="ol" marginLeft="16pt">
          {children}
        </Box>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <Link
        href={node.data.url ?? node.data.uri}
        isExternal
        color="rgba(52, 151, 55, 1.000)"
      >
        {children}
      </Link>
    ),
  },
};

export function RichContentfulContent({ content }: Props) {
  if(!content?.json) return null;

  return <>{documentToReactComponents(content?.json, options)}</>;
}
