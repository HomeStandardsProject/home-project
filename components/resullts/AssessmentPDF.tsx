import * as React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import {
  ApiHomeAssessmentResult,
  ApiRoomAssessmentResult,
} from "../../interfaces/api-home-assessment";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f7fafc",
    padding: "32pt 16pt",
  },
  section: {
    margin: 16,
    marginTop: 4,
  },
  detailsSection: {
    margin: 8,
    padding: 8,
    backgroundColor: "#3182ce",
    borderRadius: 4,
  },
  title: {
    fontSize: "16pt",
    fontFamily: "Helvetica",
    textAlign: "center",
  },
  titleSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  h1: {
    fontSize: "12pt",
    color: "white",
  },
  h2: {
    fontSize: "13pt",
    fontFamily: "Helvetica-Bold",
  },
  h3: {
    fontSize: "12pt",
    fontFamily: "Helvetica-Oblique",
  },
  bodyText: {
    fontSize: "11pt",
  },
  bodyComment: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#ceedff",
  },
  bodyCommentText: {
    fontSize: "11pt",
  },
  landlord: {
    fontSize: "10pt",
    color: "white",
  },
  commentContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  violation: {
    marginTop: 4,
    marginBottom: 4,
  },
  roomContainer: {
    marginBottom: 8,
  },
  generatedDate: {
    textAlign: "right",
    fontSize: "10pt",
    margin: 10,
    marginBottom: 0,
  },
  logo: {
    width: "150px",
    marginLeft: 16,
  },
  violationsLabel: {
    fontSize: "11pt",
    color: "#c53031",
    fontFamily: "Helvetica-Bold",
  },
  possibleViolationsLabel: {
    fontSize: "11pt",
    color: "#2b6cb0",
    fontFamily: "Helvetica-Bold",
  },
});

export const AssessmentPDF = ({
  result,
}: {
  result: ApiHomeAssessmentResult;
}) => {
  const landlord =
    result.details.landlord === "Other"
      ? result.details.landlordOther
      : result.details.landlord;

  const generatedDate = new Intl.DateTimeFormat("en-US").format(
    new Date(result.generatedDate)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.generatedDate}>{generatedDate}</Text>
        <Link src="https://homestandards.org">
          <Image src="/logo.png" style={styles.logo} />
        </Link>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Self-Guided Rental Assessment</Text>
        </View>
        <View style={styles.detailsSection}>
          <Text style={styles.h1}>
            {result.details.address.formatted}{" "}
            {result.details.unitNumber
              ? `(Unit ${result.details.unitNumber})`
              : ``}
          </Text>
          <Text style={styles.landlord}>{landlord}</Text>
        </View>
        <View style={styles.section}>{result.rooms.map(roomRenderer)}</View>
      </Page>
    </Document>
  );
};

const roomRenderer = (room: ApiRoomAssessmentResult) => (
  <View key={room.id} style={styles.roomContainer}>
    <Text style={styles.h2}>{room.name}</Text>
    {room.violations.length > 0 && (
      <Text style={styles.violationsLabel}>
        {room.violations.length} Violations
      </Text>
    )}
    {room.violations.map((violation, i) => (
      <View key={i} style={styles.violation}>
        <Text style={styles.h3}>{violation.name}</Text>
        <Text style={styles.bodyText}>{violation.description}</Text>
        <View style={styles.commentContainer}>
          {violation.userProvidedDescriptions.map((comment, i) => (
            <View key={i} style={styles.bodyComment}>
              <Text style={styles.bodyCommentText}>{comment}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}
    {room.possibleViolations.length > 0 && (
      <Text style={styles.possibleViolationsLabel}>
        {room.possibleViolations.length} Possible Violations
      </Text>
    )}
    {room.possibleViolations.map((violation, i) => (
      <View key={i} style={styles.violation}>
        <Text style={styles.h3}>{violation.name}</Text>
        <Text style={styles.bodyText}>{violation.description}</Text>
        <View style={styles.commentContainer}>
          {violation.userProvidedDescriptions.map((comment, i) => (
            <View key={i} style={styles.bodyComment}>
              <Text style={styles.bodyCommentText}>{comment}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}
    {room.violations.length === 0 && (
      <View style={styles.violation}>
        <Text style={styles.bodyText}>No violations for this room</Text>
      </View>
    )}
  </View>
);
