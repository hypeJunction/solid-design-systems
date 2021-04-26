import { render } from "@testing-library/react";
import { ServiceProvider } from "./ServiceProvider";
import { SinonSpy, spy } from "sinon";
import { FormattedDateTime } from "./FormattedDateTime";
import { DateTimeFormat, DateTimeFormatter } from "./DateTimeProvider";
import { Services, services as defaultServices } from "./Services";
import { expect } from "chai";

describe("FormattedDateTime", () => {
  describe("given a date object and format type", () => {
    it("should use date time service to format date", () => {
      const date = new Date();
      const formatter: DateTimeFormatter & SinonSpy = spy();
      const services = {
        ...defaultServices,
        formatDateTime: () => formatter,
      };

      render(
        <ServiceProvider<Services> services={services}>
          <FormattedDateTime format={DateTimeFormat.TIME} date={date} />
        </ServiceProvider>
      );

      expect(formatter).to.have.been.calledWith({
        format: DateTimeFormat.ISO,
        date,
      });

      expect(formatter).to.have.been.calledWith({
        format: DateTimeFormat.TIME,
        date,
      });
    });
  });
});
