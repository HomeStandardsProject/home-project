import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import * as React from "react";
import Layout from "../components/Layout";

function Privacy() {
  return (
    <Layout
      title="Privacy"
      description="Terms of service and data collection policy"
      showStartButton={true}
    >
      <Box marginTop="16pt" maxWidth="900px">
        <Box marginTop="16pt">
          <Heading as="h1" size="lg">
            Terms of Service
          </Heading>
          <Stack>
            <Text>
              This privacy policy governs your use of the website The Home
              Project created by Queen&apos;s Backing Action on Climate Change
              (QBACC). The Home Project allows users to assess their homes in
              accordance with the City of Kingston&apos;s Bylaws. The City of
              Kingston has no involvement with the project. The Website requires
              users to enter data regarding their housing situation. However,
              The Home Project and its creators cannot be held responsible for
              inaccurate housing assessments, potential disputes with landlords
              or incorrect user data entered.
            </Text>
            <Heading size="md">
              What information does the Website obtain, and how is it used?
            </Heading>
            <Text as="b">User-Provided Information</Text>
            <Text>
              All info submitted to the Home Project will be securely stored for
              future analysis. Raw data will never be sold or distributed. The
              data submitted will be used in aggregate form and shared publicly
              to highlight the student housing district&apos;s state.
            </Text>
            <Text as="b">Automatically Collected Information</Text>
            <Text>
              To monitor activity, performance, and overall user experience,
              Google Analytics has been installed on the Website. Thus, the
              Website may collect certain information automatically, including,
              but not limited to, the type of mobile device you use, your
              devices unique device ID, the IP address of your device, your
              operating system, the type of Internet browsers you use, and
              information about the way you use the Website.
            </Text>
            <Text as="b">
              Do third parties see and/or have access to information obtained by
              the Website?
            </Text>
            <Text>
              Only aggregated, anonymized data is periodically transmitted to
              external services to improve the Website and our service. We will
              share your information with third parties only in the ways
              described in this privacy statement. We may disclose User Provided
              and Automatically Collected Information: • as required by law,
              such as to comply with a subpoena or similar legal process; • when
              we believe in good faith that disclosure is necessary to protect
              our rights, protect your safety or the safety of others,
              investigate fraud, or respond to a government request; • with our
              trusted services providers who work on our behalf, do not have an
              independent use of the information we disclose to them and have
              agreed to adhere to the rules set forth in this privacy statement.
              • if The Home Project is involved in a merger, acquisition, or
              sale of all or a portion of its assets, you will be notified via
              email and/or a prominent notice on our Website of any change in
              ownership or uses of this information, as well as any choices you
              may have regarding this information.
            </Text>
            <Heading size="md">What are my opt-out rights?</Heading>
            <Text>
              If an email is provided at the time of submission, you may request
              to have your data deleted at a future date by emailing{" "}
              <Link color="blue.500" href="mailto:queensbacc@gmail.com">
                queensbacc@gmail.com
              </Link>
              .
            </Text>
            <Text as="b">Security</Text>
            <Text>
              We are concerned about safeguarding the confidentiality of your
              information. We provide physical, electronic, and procedural
              safeguards to protect the data we process and maintain. For
              example, we limit access to this information to authorized
              employees and contractors who need to know that information to
              operate, develop or improve our website. Please be aware that,
              although we provide reasonable security for information we process
              and maintain, no security system can prevent all potential
              security breaches.
            </Text>
            <Text as="b">Contact us</Text>
            <Text>
              If you have any questions regarding privacy while using the
              Website, or have questions about our practices, please contact us
              via email at{" "}
              <Link color="blue.500" href="mailto:queensbacc@gmail.com">
                queensbacc@gmail.com
              </Link>
              .
            </Text>
          </Stack>
        </Box>
      </Box>
    </Layout>
  );
}

export default Privacy;
