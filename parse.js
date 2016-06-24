const parse = require("csv-parse");
const fs = require("fs");

const file = "2015-2 SubdivisionCodes.csv";

const output = {};
const csvFile = fs.createReadStream(file);
const parser = parse({ delimiter: ",", quote: '"' });

parser.on("readable", () => {
    const record = parser.read();
    while (record) {
        const countryShortName = record[0].toLowerCase();
        const provinceShortName = record[1].toLowerCase();
        const provinceName = record[2];

        if (record && !output.hasOwnProperty(countryShortName)) {
            output[countryShortName] = {};
        }

        output[countryShortName][provinceShortName] = provinceName;
    }
});

parser.on("error", (err) => {
    console.log(err.message);
});

parser.on("finish", () => {
    console.log(output);
    fs.writeFileSync("country_region_name_lookup.json", JSON.stringify(output));
});

csvFile.pipe(parser);
