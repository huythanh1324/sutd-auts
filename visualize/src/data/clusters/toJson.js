import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { fileURLToPath } from "url";
import { dirname } from "path";
const results = [];

const files = fs.readdirSync(".").filter(f => f.startsWith("cluster_"));

for (const file of files) {
    const clusterName = path.parse(file).name;
    const content = fs.readFileSync(file, "utf-8");

    const records = parse(content, {
        columns: true,
        skip_empty_lines: true
    });

    const limitedRecords = records.slice(0, 20);

    for (const row of limitedRecords) {
        results.push({
            "health_score": parseFloat(row["health_score"]),
            "year": parseFloat(row["year"]),
            "sex": parseFloat(row["sex"]),
            "age": parseFloat(row["age"]),
            "education": parseFloat(row["education"]),
            "education": parseFloat(row["education"]),
            "sequence_length": parseFloat(row["sequence_length"]),
            "total_minutes": parseFloat(row["total_minutes"]),
            "Sleep": parseFloat(row["Sleep"]),
            "Exercise": parseFloat(row["Exercise"]),
            "Work (main)": parseFloat(row["Work (main)"]),
            "Work (other)": parseFloat(row["Work (other)"]),
            "TV/Screen": parseFloat(row["TV/Screen"]),
            "Eating/Drinking": parseFloat(row["Eating/Drinking"]),
            "Grooming/Self-care": parseFloat(row["Grooming/Self-care"]),
            "Housework": parseFloat(row["Housework"]),
            "Food Prep": parseFloat(row["Food Prep"]),
            "Home Maintenance": parseFloat(row["Home Maintenance"]),
            "Childcare": parseFloat(row["Childcare"]),
            "Adult Care": parseFloat(row["Adult Care"]),
            "Education": parseFloat(row["Education"]),
            "Shopping": parseFloat(row["Shopping"]),
            "Professional Services": parseFloat(row["Professional Services"]),
            "Household Services": parseFloat(row["Household Services"]),
            "Civic/Government": parseFloat(row["Civic/Government"]),
            "Socializing (family)": parseFloat(row["Socializing (family)"]),
            "Socializing (friends)": parseFloat(row["Socializing (friends)"]),
            "Leisure/Relaxing": parseFloat(row["Leisure/Relaxing"]),
            "Arts/Entertainment": parseFloat(row["Arts/Entertainment"]),
            "Religious/Volunteer": parseFloat(row["Religious/Volunteer"]),
            "Phone/Communication": parseFloat(row["Phone/Communication"]),
            "Travel": parseFloat(row["Travel"]),
            "Other": parseFloat(row["Other"]),
            cluster: clusterName
        });
    }
}

fs.writeFileSync("output.json", JSON.stringify(results, null, 2));