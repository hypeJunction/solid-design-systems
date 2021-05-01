import { render } from "@testing-library/react";
import { ServiceProvider } from "../../Container";
import { SinonStub, stub } from "sinon";
import { FormattedDateTime } from "./FormattedDateTime";
import { DateTimeFormat, DateTimeFormatter, DateTimeFormatterProps, DateTimeService } from "../Services";
import { expect } from "chai";

describe("FormattedDateTime", () => {
  describe("given a date object and format type", () => {
    it("should use date time service to format date", () => {
      const date = new Date();
      const formatter: DateTimeFormatter & SinonStub = stub();

      const services: DateTimeService = {
        formatDateTime: () => formatter
      };

      const props: DateTimeFormatterProps = {
        format: DateTimeFormat.TIME,
        date
      };

      formatter
        .withArgs(props)
        .returns("formatted time");

      const { getByText } = render(
        <ServiceProvider<DateTimeService> services={services}>
          <FormattedDateTime {...props} />
        </ServiceProvider>
      );

      expect(formatter).to.have.been.calledWith({
        format: DateTimeFormat.TIME,
        date
      });

      expect(getByText("formatted time")).to.be.visible;
    });
  });
});
