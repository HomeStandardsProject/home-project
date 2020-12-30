import { Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import * as React from "react";

import Layout from "../components/Layout";
import { GreenBinPromotionModel } from "../components/resullts/GreenBinPromotionModel";
import { ResultsContainer } from "../components/resullts/ResultsContainer";

const ResultPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Layout
      title="Results"
      description="Results for the home assessment"
      displayPromotionOffering={onOpen}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <GreenBinPromotionModel onClose={onClose} />
      </Modal>
      <ResultsContainer />
    </Layout>
  );
};

export default ResultPage;
