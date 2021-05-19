import * as React from "react";
import { Text, Link, Box } from "@chakra-ui/react";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";

import { ContentfulRichText } from "../interfaces/contentful-generic";

type Props = {
  content: ContentfulRichText;
};

const options: Options = {
  renderText: (text) => <Text as="span">{text}</Text>,
  renderMark: {
    [MARKS.BOLD]: (text) => <Text as="b">{text}</Text>,
    [MARKS.ITALIC]: (text) => <Text as="i">{text}</Text>,
    [MARKS.UNDERLINE]: (text) => <Text as="u">{text}</Text>,
  },
  renderNode: {
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
  return <>{documentToReactComponents(content.json, options)}</>;
}
