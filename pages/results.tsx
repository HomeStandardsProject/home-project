import { Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import * as React from "react";

import Layout from "../components/Layout";
import { ResultsContainer } from "../components/resullts/ResultsContainer";

const ResultPage: React.FC = () => {
  const { isOpen, onClose } = useDisclosure();

  return (
    <Layout
      title="Results"
      description="Results for the home assessment"
      // displayPromotionOffering={onOpen}
      showLastResults={false}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
      </Modal>
      <ResultsContainer />
    </Layout>
  );
};

export default ResultPage;
