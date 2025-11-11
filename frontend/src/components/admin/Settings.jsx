import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faInfo,
  faImage,
  faPhone,
  faQuestionCircle,
  faBookOpen,
  faLightbulb,
  faMobile,
  faBox,
  faFileAlt,
  faUserPlus,
  faIcons,
  faHandshake,
  faComment,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/admin/Settings.css";

const Settings = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      id: "about",
      title: "About Us",
      icon: faInfo,
      path: "/admin/settings/about",
    },
    {
      id: "banner",
      title: "Banner Section",
      icon: faImage,
      path: "/admin/settings/banner",
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: faPhone,
      path: "/admin/settings/contact",
    },
    {
      id: "counter",
      title: "Counter Section",
      icon: faCog,
      path: "/admin/settings/counter",
    },
    {
      id: "faq",
      title: "FAQ Section",
      icon: faQuestionCircle,
      path: "/admin/settings/faq",
    },
    {
      id: "footer",
      title: "Footer Section",
      icon: faFooterprint,
      path: "/admin/settings/footer",
    },
    {
      id: "how-it-works",
      title: "How it work Section",
      icon: faLightbulb,
      path: "/admin/settings/how-it-works",
    },
    {
      id: "kyc",
      title: "KYC Content",
      icon: faFileAlt,
      path: "/admin/settings/kyc",
    },
    {
      id: "login",
      title: "Login Page",
      icon: faUserPlus,
      path: "/admin/settings/login",
    },
    {
      id: "mobile-app",
      title: "Mobile App Section",
      icon: faMobile,
      path: "/admin/settings/mobile-app",
    },
    {
      id: "package",
      title: "Package Section",
      icon: faBox,
      path: "/admin/settings/package",
    },
    {
      id: "policy",
      title: "Policy Pages",
      icon: faFileAlt,
      path: "/admin/settings/policy",
    },
    {
      id: "register",
      title: "Register Page",
      icon: faUserPlus,
      path: "/admin/settings/register",
    },
    {
      id: "social",
      title: "Social Icons",
      icon: faIcons,
      path: "/admin/settings/social",
    },
    {
      id: "story",
      title: "Story Section",
      icon: faBookOpen,
      path: "/admin/settings/story",
    },
    {
      id: "testimonial",
      title: "Testimonial Section",
      icon: faComments,
      path: "/admin/settings/testimonial",
    },
  ];

  const handleSectionClick = (path) => {
    // Handle navigation to the specific section
    console.log("Navigating to:", path);
  };

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="settings-wrapper">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4 pt-3">
          <h2 className="mb-0">Content Management Options</h2>
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Row className="g-3">
          {filteredSections.map((section) => (
            <Col key={section.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="settings-card"
                onClick={() => handleSectionClick(section.path)}
              >
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="section-icon">
                      <FontAwesomeIcon icon={section.icon} />
                    </div>
                    <div className="section-title">{section.title}</div>
                    <div className="section-arrow">
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Settings;
