import React from "react"
import ReactCountryFlag from "react-country-flag"

function CountryFlag({ iso }: { iso: string }) {
    return (
        <ReactCountryFlag
            style={{
                filter: "drop-shadow(0px 2px 2px #00000022)",
                borderRadius: "4px",
                transform: "scale(1.2)",
            }}
            svg
            countryCode={iso}
        />
    )
}

export default CountryFlag
