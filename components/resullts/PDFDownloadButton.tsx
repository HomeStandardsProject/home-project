import { Button, useToast } from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as React from "react";
import { ApiHomeAssessmentResult } from "../../interfaces/api-home-assessment";
import { logDownloadButtonClick } from "../../utils/analyticsEvent";
import { AssessmentPDF } from "./AssessmentPDF";

export const PDFDownloadButton: React.FC<{
  result: ApiHomeAssessmentResult;
}> = ({ result }) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div>
      {hasMounted && (
        <PDFDownloadLink
          document={<AssessmentPDF result={result} />}
          fileName="qbacc-assessment.pdf"
        >
          {(props) => <DownloadButton {...props} />}
        </PDFDownloadLink>
      )}
    </div>
  );
};

const DownloadButton: React.FC<{
  loading: boolean;
  error: Error | null;
  blob: Blob | null;
  url: string | null;
}> = ({ loading, error }) => {
  const toast = useToast();

  React.useEffect(() => {
    if (error) {
      console.error(error);
      toast({
        status: "error",
        description: "An error occured when generating the pdf...",
      });
    }
  }, [error, toast]);

  return (
    <Button
      leftIcon="download"
      isLoading={loading}
      size="sm"
      onClick={logDownloadButtonClick}
    >
      {loading ? "Rendering document..." : "Download PDF"}
    </Button>
  );
};
