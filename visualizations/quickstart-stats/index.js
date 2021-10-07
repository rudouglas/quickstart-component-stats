import React from "react";
import PropTypes from "prop-types";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  NerdGraphQuery,
  Card,
  CardHeader,
  CardBody,
  Badge,
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
  BarChart,
  NrqlQuery,
} from "nr1";
import ComponentStats from "../../nerdlets/component-stats/ComponentStats";

const TESSEN_ACCOUNT_ID = 1002319;
const OS_ENG_ACCOUNT_ID = 10827034;
export default class QuickstartStatsVisualization extends React.Component {
  // Custom props you wish to be configurable in the UI must also be defined in
  // the nr1.json file for the visualization. See docs for more details.
  static propTypes = {
    /**
     * A fill color to override the default fill color. This is an example of
     * a custom chart configuration.
     */
    fill: PropTypes.string,

    /**
     * A stroke color to override the default stroke color. This is an example of
     * a custom chart configuration.
     */
    stroke: PropTypes.string,
    /**
     * An array of objects consisting of a nrql `query` and `accountId`.
     * This should be a standard prop for any NRQL based visualizations.
     */
    nrqlQueries: PropTypes.arrayOf(
      PropTypes.shape({
        accountId: PropTypes.number,
        query: PropTypes.string,
      })
    ),
  };

  /**
   * Restructure the data for a non-time-series, facet-based NRQL query into a
   * form accepted by the Recharts library's RadarChart.
   * (https://recharts.org/api/RadarChart).
   */
  transformData = (rawData) => {
    return rawData.map((entry) => ({
      name: entry.metadata.name,
      // Only grabbing the first data value because this is not time-series data.
      value: entry.data[0].y,
    }));
  };

  /**
   * Format the given axis tick's numeric value into a string for display.
   */
  formatTick = (value) => {
    return value.toLocaleString();
  };

  xLogo = () => {
    return (
      <GridItem columnSpan={2}>
        {" "}
        <svg
          class="invalid-x"
          xmlns="http://www.w3.org/2000/svg"
          viewbox="0 0 40 40"
        >
          <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
        </svg>
      </GridItem>
    );
  };

  checkLogo = () => {
    return (
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
    );
  };

  mostClickedInternal = (quickstarts) => {
    const names = quickstarts.map((qs) => {
      return qs.name
    })
    const nameString = names.reduce((acc, name) => {
      acc += ','
      return acc += `'${name}'`
    }, "")
    const nrql = "FROM TessenAction SELECT count(*) AS 'TOP 10 (INTERNAL)' WHERE quickstartName IN (" 
      + nameString.substring(1,) + ") AND eventName = 'DEVEN_Quickstart Details_pageView' facet quickstartName SINCE '2021-09-29 00:00:00+0100' LIMIT 10"
      console.log(nrql)
      
      return (
      <NrqlQuery
        accountId={TESSEN_ACCOUNT_ID}
        query={nrql}
      >
        {({ data }) => {
          let filtered;
          if (data) {
            // change colors to a nice pink.
            console.log(data)
            console.log(`yes`)
            filtered = data.filter(({ metadata }) => (metadata.name !== "Other"))
          }

          return (
            <><HeadingText>TOP 10 PageViews (I/O Marketplace)</HeadingText>
            <BarChart
              accountId={TESSEN_ACCOUNT_ID}
              data={filtered}
            /></>
          );
        }}
      </NrqlQuery>
    );
  };
  mostClickedExternal = (quickstarts) => {
    const names = quickstarts.map((qs) => {
      return qs.name
    })
    const nameString = names.reduce((acc, name) => {
      acc += ','
      return acc += `'${name}'`
    }, "")
    const nrql = "FROM TessenAction SELECT count(*) AS 'TOP 10 (EXTERNAL)' WHERE quickstartName IN (" 
      + nameString.substring(1,) + ") AND eventName = 'TDEV_QuickstartClick_instantObservability' facet quickstartName SINCE '2021-09-29 00:00:00+0100' LIMIT 10"
    console.log(nrql)

      return (
      <NrqlQuery
        accountId={TESSEN_ACCOUNT_ID}
        query={nrql}
      >
        {({ data }) => {
          let filtered;
          if (data) {
            // change colors to a nice pink.
            console.log(data)
            console.log(`yes`)
            filtered = data.filter(({ metadata }) => (metadata.name !== "Other"))
          }

          return (
            <><HeadingText>TOP 10 PageViews (Public Catalog)</HeadingText>
            <BarChart
              accountId={TESSEN_ACCOUNT_ID}
              data={filtered}
            /></>
          );
        }}
      </NrqlQuery>
    );
  };

  mostSuccessfulInstall = (quickstarts) => {
    const names = quickstarts.map((qs) => {
      return qs.name
    })
    const nameString = names.reduce((acc, name) => {
      acc += ','
      return acc += `'${name}'`
    }, "")
     

    const nrql = "FROM PackInstallEvent SELECT count(*) WHERE `status` = 'INSTALL_SUCCESS' AND packName IN (" 
      + nameString.substring(1,) + ") AND email NOT LIKE '%newrelic.com' AND tags.Environment = 'production' or tags.Environment = 'eu-production' FACET packName SINCE '2021-09-29 00:00:00+0100' LIMIT 10"
    console.log(nrql)
    return (
      <NrqlQuery
        accountId={OS_ENG_ACCOUNT_ID}
        query={nrql}
      >
        {({ data }) => {
          let filtered;
          if (data) {
            // change colors to a nice pink.
            console.log(data)
            console.log(`yes`)
            filtered = data.filter(({ metadata }) => (metadata.name !== "Other"))
          }

          return (
            <><HeadingText>Most Successful Installs</HeadingText>
            <BarChart
              accountId={OS_ENG_ACCOUNT_ID}
              data={filtered}
            /></>
          );
        }}
      </NrqlQuery>
    );
  };
  mostInstalledDocsOnly = (quickstarts) => {
    const names = quickstarts.map((qs) => {
      return qs.name
    })
    const nameString = names.reduce((acc, name) => {
      acc += ','
      return acc += `'${name}'`
    }, "")
     

    const nrql = "FROM TessenAction SELECT count(*) WHERE  eventName = 'DEVEN_Quickstart Details_clickInstall' AND quickstartName != '' AND quickstartName IN (" 
      + nameString.substring(1,) + ") FACET quickstartName SINCE '2021-09-29 00:00:00+0100' LIMIT 10"
    console.log(nrql)
    return (
      <NrqlQuery
        accountId={TESSEN_ACCOUNT_ID}
        query={nrql}
      >
        {({ data }) => {
          let filtered;
          if (data) {
            // change colors to a nice pink.
            console.log(data)
            console.log(`yes`)
            filtered = data.filter(({ metadata }) => (metadata.name !== "Other"))
          }

          return (
            <><HeadingText>Most Install Clicks (Docs Only)</HeadingText>
            <BarChart
              accountId={TESSEN_ACCOUNT_ID}
              data={filtered}
            /></>
          );
        }}
      </NrqlQuery>
    );
  };
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
                    title
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
              <GridItem columnSpan="12">
                <h1 className="totalCount">
                  Total: {quickstarts.length} quickstarts
                </h1>
                <CardSection></CardSection>
              </GridItem>
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
                      {this.checkLogo()}
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
                      {this.checkLogo()}
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
                        <h4>
                          {scenarioOneNr.length} with author{" "}
                          <Badge type={Badge.TYPE.INFO}>New Relic</Badge>
                        </h4>
                      </CardSectionHeader>
                    </CardSection>
                    <CardSection></CardSection>
                    {this.mostClickedInternal(scenarioOne)}
                    <CardSection></CardSection>
                    {this.mostClickedExternal(scenarioOne)}
                    <CardSection></CardSection>
                    {this.mostSuccessfulInstall(scenarioOne)}
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
                      {this.checkLogo()}
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
                      {this.checkLogo()}
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
                      {this.xLogo()}
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
                        <h1>{scenarioTwo.length} Quickstarts</h1>
                        <h4>
                          {scenarioTwoNr.length} with author{" "}
                          <Badge type={Badge.TYPE.INFO}>New Relic</Badge>
                        </h4>
                      </CardSectionHeader>
                    </CardSection>
                    <CardSection></CardSection>
                    {this.mostClickedInternal(scenarioTwo)}
                    <CardSection></CardSection>
                    {this.mostClickedExternal(scenarioTwo)}
                    <CardSection></CardSection>
                    {this.mostSuccessfulInstall(scenarioTwo)}
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
                      {this.checkLogo()}
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
                      {this.xLogo()}

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
                    </Grid>
                    <CardSection>
                      <CardSectionHeader>
                        <h1>{scenarioThree.length} Quickstarts</h1>
                        <h4>
                          {scenarioThreeNr.length} with author{" "}
                          <Badge type={Badge.TYPE.INFO}>New Relic</Badge>
                        </h4>
                      </CardSectionHeader>
                    </CardSection>
                    <CardSection></CardSection>
                    {this.mostClickedInternal(scenarioThree)}
                    <CardSection></CardSection>
                    {this.mostClickedExternal(scenarioThree)}
                    <CardSection></CardSection>
                    {this.mostSuccessfulInstall(scenarioThree)}
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
                      {this.checkLogo()}
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
                      {this.xLogo()}
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
                      {this.xLogo()}
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
                        <h1>{scenarioFour.length} Quickstarts</h1>
                        <h4>
                          {scenarioFourNr.length} with author{" "}
                          <Badge type={Badge.TYPE.INFO}>New Relic</Badge>
                        </h4>
                      </CardSectionHeader>
                    </CardSection>
                    <CardSection></CardSection>
                    {this.mostClickedInternal(scenarioFour)}
                    <CardSection></CardSection>
                    {this.mostClickedExternal(scenarioFour)}
                    <CardSection></CardSection>
                    {this.mostInstalledDocsOnly(scenarioFour)}
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

const EmptyState = () => (
  <Card className="EmptyState">
    <CardBody className="EmptyState-cardBody">
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Please provide at least one query & account ID pair
      </HeadingText>
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.MEDIUM]}
        type={HeadingText.TYPE.HEADING_4}
      >
        An example NRQL query you can try is:
      </HeadingText>
      <code>FROM NrUsage SELECT sum(usage) FACET metric SINCE 1 week ago</code>
    </CardBody>
  </Card>
);

const ErrorState = () => (
  <Card className="ErrorState">
    <CardBody className="ErrorState-cardBody">
      <HeadingText
        className="ErrorState-headingText"
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Oops! Something went wrong.
      </HeadingText>
    </CardBody>
  </Card>
);
