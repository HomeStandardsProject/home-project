import * as React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import {
  ApiHomeAssessmentResult,
  ApiRoomAssessmentResult,
} from "../../interfaces/api-home-assessment";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f7fafc",
  },
  section: {
    margin: 16,
    marginTop: 4,
  },
  detailsSection: {
    margin: 10,
    padding: 8,
    backgroundColor: "#edf2f7",
    borderRadius: 4,
  },
  h2: {
    fontSize: "13pt",
    fontWeight: "bold",
  },
  h3: {
    fontSize: "12pt",
    fontWeight: "bold",
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
    fontStyle: "italic",
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
});

export const AssessmentPDF = ({
  result,
}: {
  result: ApiHomeAssessmentResult;
}) => {
  const landlord =
    result.details.landlord === "Other"
      ? `Other (${result.details.landlordOther})`
      : result.details.landlord;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.detailsSection}>
          <Text style={styles.h2}>
            {result.details.address}{" "}
            {result.details.unitNumber
              ? `(Unit ${result.details.unitNumber})`
              : ``}
          </Text>
          <Text style={styles.bodyCommentText}>{landlord}</Text>
        </View>
        <View style={styles.section}>{result.rooms.map(roomRenderer)}</View>
      </Page>
    </Document>
  );
};

const roomRenderer = (room: ApiRoomAssessmentResult) => (
  <View key={room.id} style={styles.roomContainer}>
    <Text style={styles.h2}>{room.name}</Text>

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
    {room.violations.length === 0 && (
      <View style={styles.violation}>
        <Text style={styles.bodyText}>No violations for this room</Text>
      </View>
    )}
  </View>
);
