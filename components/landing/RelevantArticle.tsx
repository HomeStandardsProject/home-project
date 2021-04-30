import { Box, Link, Text } from "@chakra-ui/react";
import * as React from "react";
import { Article } from "../../utils/loadArticles";

type Props = {
  article: Article;
};

export function RelevantArticle({ article }: Props) {
  return (
    <Link href={article.sourceUrl} isExternal>
      <Box
        maxWidth="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        height="100%"
      >
        <Box
          minHeight="140px"
          width="100%"
          bg="red.600"
          backgroundImage={`url("${
            article.previewImage ?? `/fallback-article-preview.png`
          }")`}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          backgroundPosition="center center"
        ></Box>
        <Box padding="4">
          <Text marginTop="1" fontWeight="semibold" as="h4" lineHeight="tight">
            {article.title}
          </Text>
          <Text color="green.400">{article.source}</Text>
        </Box>
      </Box>
    </Link>
  );
}
