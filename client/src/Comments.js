import React from "react";
import { MDBCard, MDBCardBody, MDBContainer, MDBRow } from "mdb-react-ui-kit";

export default function Commentaire({ email, comment }) {
  return (
    <MDBContainer className="mt-5" style={{ maxWidth: "1000px" }}>
      <MDBRow className="justify-content-center">
        <MDBCard className="shadow-0 border" style={{ backgroundColor: "#f0f2f5" }}>
          <MDBCardBody>
            <div className="comment">
              <div className="comment-email">
                <strong>Email:</strong> {email}
              </div>
              <div className="comment-text">
                <strong>Commentaire:</strong> {comment}
              </div>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
}
