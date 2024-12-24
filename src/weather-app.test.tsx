import React from "react"
import {screen, render} from "@testing-library/react"

import {WeatherApp} from "./weather-app";

describe("WeatherApp", () => {
    it("should render the component", () => {
        render(<WeatherApp contentLanguage="en_US" message="World"/>);

        expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    })
})
