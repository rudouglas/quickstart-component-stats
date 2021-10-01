import React from "react";
import {
  NerdGraphQuery,
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  nerdlet,
  ngql,
  Spinner,
  HeadingText,
  Stack,
  StackItem,
  Button,
  CardSection,
  CardSectionHeader,
  Dropdown,
  DropdownItem,
  CardSectionBody,
  Badge,
  Icon,
  Link,
  List,
  ListItem,
} from "nr1";

export default class ComponentStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quickstarts: {},
    };
    nerdlet.setConfig({
      timePicker: false,
    });
  }

  render() {
    const query = ngql`
    {
      docs {
        openInstallation {
          quickstartSearch {
            count
            nextCursor
            results {
              quickstarts {
                id
                dashboards {
                  id
                  name
                }
                alerts {
                  id
                  name
                }
                authors
                documentation {
                  name
                }
                installPlans {
                  name
                  install {
                    mode
                  }
                }
                level
                name
                packUrl
              }
            }
          }
        }
      }
    }
    `;
    return (
      <NerdGraphQuery query={query}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Spinner />;
          }

          if (error) {
            return "Error!";
          }
          const quickstarts =
            data.docs.openInstallation.quickstartSearch.results.quickstarts;
          console.log(quickstarts);
          const scenarioOne = quickstarts
            .filter(
              (qs) =>
                (qs.dashboards.length > 0 || qs.alerts.length > 0) &&
                qs.installPlans.length > 0
            )
            .filter((qs) =>
              qs.installPlans.some((iP) =>
                ["TARGETED_INSTALL", "GUIDED_INSTALL", "NERDLET"].includes(
                  iP.install.mode
                )
              )
            );
          const scenarioOneNr = scenarioOne.filter((qs) =>
            qs.authors.includes("New Relic")
          );
          const scenarioTwo = quickstarts
            .filter(
              (qs) =>
                (qs.dashboards.length > 0 || qs.alerts.length > 0) &&
                qs.installPlans.length > 0
            )
            .filter((qs) =>
              qs.installPlans.some((iP) => ["LINK"].includes(iP.install.mode))
            );
          const scenarioTwoNr = scenarioTwo.filter((qs) =>
            qs.authors.includes("New Relic")
          );
          const scenarioThree = quickstarts
            .filter(
              (qs) =>
                qs.dashboards.length === 0 &&
                qs.alerts.length === 0 &&
                qs.installPlans.length > 0
            )
            .filter((qs) =>
              qs.installPlans.some((iP) =>
                ["TARGETED_INSTALL", "GUIDED_INSTALL", "NERDLET"].includes(
                  iP.install.mode
                )
              )
            );
          const scenarioThreeNr = scenarioThree.filter((qs) =>
            qs.authors.includes("New Relic")
          );
          const scenarioFour = quickstarts.filter(
            (qs) =>
              qs.documentation.length > 0 &&
              qs.dashboards.length === 0 &&
              qs.alerts.length === 0 &&
              qs.installPlans.length === 0
          );
          const scenarioFourNr = scenarioFour.filter((qs) =>
            qs.authors.includes("New Relic")
          );
          console.log(scenarioOne);
          return (
            <Grid>
              <GridItem columnSpan="3">
                <Card>
                  <CardHeader>
                    <h1>Full QS</h1>
                  </CardHeader>
                  <CardBody>
                    <Grid
                      spacingType={[
                        Grid.SPACING_TYPE.EXTRA_LARGE,
                        Grid.SPACING_TYPE.NONE,
                        Grid.SPACING_TYPE.NONE,
                      ]}
                      gapType={Grid.GAP_TYPE.SMALL}
                      className="validation-grid"
                    >
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="checkmark"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <path
                            class="checkmark__check"
                            fill="none"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Dashboards/Alerts
                        </h2>
                      </GridItem>
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="checkmark"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <path
                            class="checkmark__check"
                            fill="none"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Targeted Install
                        </h2>
                      </GridItem>
                    </Grid>
                    <CardSection>
                      <CardSectionHeader>
                        <h1>{scenarioOne.length} Quickstarts</h1>
                        <h4>{scenarioOneNr.length} with author New Relic</h4>
                      </CardSectionHeader>
                      <CardSectionBody>
                        <Card collapsible collapsed>
                          <CardHeader title="See All" />
                          <CardBody>
                            <List>
                              {scenarioOne.map((qs) => (
                                <ListItem>
                                  <Link to={qs.packUrl}>{qs.name}</Link>
                                </ListItem>
                              ))}
                            </List>
                          </CardBody>
                        </Card>
                      </CardSectionBody>
                    </CardSection>
                    <CardSection></CardSection>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem columnSpan="3">
                <Card>
                  <CardHeader>
                    <h1>Full QS w / No install</h1>
                  </CardHeader>
                  <CardBody>
                    <Grid
                      spacingType={[
                        Grid.SPACING_TYPE.EXTRA_LARGE,
                        Grid.SPACING_TYPE.NONE,
                        Grid.SPACING_TYPE.NONE,
                      ]}
                      gapType={Grid.GAP_TYPE.SMALL}
                      className="validation-grid"
                    >
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="checkmark"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <path
                            class="checkmark__check"
                            fill="none"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Dashboards/Alerts
                        </h2>
                      </GridItem>
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="invalid-x"
                          xmlns="http://www.w3.org/2000/svg"
                          viewbox="0 0 40 40"
                        >
                          <path
                            class="close-x"
                            d="M 10,10 L 30,30 M 30,10 L 10,30"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Targeted Install
                        </h2>
                      </GridItem>
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="checkmark"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <path
                            class="checkmark__check"
                            fill="none"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Documentation Install
                        </h2>
                      </GridItem>
                    </Grid>
                    <CardSection>
                      <CardSectionHeader>
                        <h1>{scenarioTwo.length} Quickstarts</h1>
                        <h4>{scenarioTwoNr.length} with author New Relic</h4>
                      </CardSectionHeader>
                      <CardSectionBody>
                        <Card collapsible collapsed>
                          <CardHeader title="See All" />
                          <CardBody>
                            <List>
                              {scenarioTwo.map((qs) => (
                                <ListItem>
                                  <Link to={qs.packUrl}>{qs.name}</Link>
                                </ListItem>
                              ))}
                            </List>
                          </CardBody>
                        </Card>
                      </CardSectionBody>
                    </CardSection>
                    <CardSection></CardSection>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem columnSpan="3">
                <Card>
                  <CardHeader>
                    <h1>Install only QS</h1>
                  </CardHeader>
                  <CardBody>
                    <Grid
                      spacingType={[
                        Grid.SPACING_TYPE.EXTRA_LARGE,
                        Grid.SPACING_TYPE.NONE,
                        Grid.SPACING_TYPE.NONE,
                      ]}
                      gapType={Grid.GAP_TYPE.SMALL}
                      className="validation-grid"
                    >
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="invalid-x"
                          xmlns="http://www.w3.org/2000/svg"
                          viewbox="0 0 40 40"
                        >
                          <path
                            class="close-x"
                            d="M 10,10 L 30,30 M 30,10 L 10,30"
                          />
                        </svg>
                      </GridItem>

                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Dashboards/Alerts
                        </h2>
                      </GridItem>
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="checkmark"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <path
                            class="checkmark__check"
                            fill="none"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Targeted Install
                        </h2>
                      </GridItem>
                    </Grid>
                    <CardSection>
                      <CardSectionHeader>
                        <h1>{scenarioThree.length} Quickstarts</h1>
                        <h4>{scenarioThreeNr.length} with author New Relic</h4>
                      </CardSectionHeader>
                      <CardSectionBody>
                        <Card collapsible collapsed>
                          <CardHeader title="See All" />
                          <CardBody>
                            <List>
                              {scenarioThree.map((qs) => (
                                <ListItem>
                                  <Link to={qs.packUrl}>{qs.name}</Link>
                                </ListItem>
                              ))}
                            </List>
                          </CardBody>
                        </Card>
                      </CardSectionBody>
                    </CardSection>
                    <CardSection></CardSection>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem columnSpan="3">
                <Card>
                  <CardHeader>
                    <h1>Docs only QS</h1>
                  </CardHeader>
                  <CardBody>
                    <Grid
                      spacingType={[
                        Grid.SPACING_TYPE.EXTRA_LARGE,
                        Grid.SPACING_TYPE.NONE,
                        Grid.SPACING_TYPE.NONE,
                      ]}
                      gapType={Grid.GAP_TYPE.SMALL}
                      className="validation-grid"
                    >
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="invalid-x"
                          xmlns="http://www.w3.org/2000/svg"
                          viewbox="0 0 40 40"
                        >
                          <path
                            class="close-x"
                            d="M 10,10 L 30,30 M 30,10 L 10,30"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Dashboards/Alerts
                        </h2>
                      </GridItem>
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="invalid-x"
                          xmlns="http://www.w3.org/2000/svg"
                          viewbox="0 0 40 40"
                        >
                          <path
                            class="close-x"
                            d="M 10,10 L 30,30 M 30,10 L 10,30"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Targeted Install
                        </h2>
                      </GridItem>
                      <GridItem columnSpan={2}>
                        {" "}
                        <svg
                          class="checkmark"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 40 40"
                        >
                          <path
                            class="checkmark__check"
                            fill="none"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                          />
                        </svg>
                      </GridItem>
                      <GridItem columnSpan={10}>
                        <h2
                          style={{
                            color: "#017C86",
                            fontWeight: 500,
                          }}
                        >
                          Documentation Link
                        </h2>
                      </GridItem>
                    </Grid>
                    <CardSection>
                      <CardSectionHeader>
                        <h1>{scenarioFour.length} Quickstarts</h1>
                        <h4>{scenarioFourNr.length} with author New Relic</h4>
                      </CardSectionHeader>
                      <CardSectionBody>
                        <Card collapsible collapsed>
                          <CardHeader title="See All" />
                          <CardBody>
                            <List>
                              {scenarioFour.map((qs) => (
                                <ListItem>
                                  <Link to={qs.packUrl}>{qs.name}</Link>
                                </ListItem>
                              ))}
                            </List>
                          </CardBody>
                        </Card>
                      </CardSectionBody>
                    </CardSection>
                    <CardSection></CardSection>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          );
        }}
      </NerdGraphQuery>
    );
  }
}
