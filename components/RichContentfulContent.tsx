import * as React from "react";
import { Text, Link } from "@chakra-ui/react";
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
    [INLINES.HYPERLINK]: (node, children) => (
      <Link href={node.data.url} isExternal color="rgba(52, 151, 55, 1.000)">
        {children}
      </Link>
    ),
  },
};

export function RichContentfulContent({ content }: Props) {
  return <>{documentToReactComponents(content.json, options)}</>;
}
