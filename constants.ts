// =====================================================================
// CONFIGURATIE
// =====================================================================

// Google Sheets integratie is verwijderd. De app werkt nu lokaal.

// Lijst van 50 medewerkers, gesorteerd op achternaam
export const EMPLOYEES = [
  "Lotte van den Berg",
  "Thomas Bakker",
  "Sanne Bakker",
  "Luuk Beekman",
  "Milan Bijl",
  "Eva Blom",
  "Daan Boer",
  "Julia Bos",
  "Liam Bosman",
  "Emma Bouwman",
  "James Brouwer",
  "Tess de Bruin",
  "Finn de Bruijn",
  "Sara Claassen",
  "Noah Dekker",
  "Zoë Dijkman",
  "Lucas van Dijk",
  "Mila Driessen",
  "Sem Evers",
  "Olivia Gerritsen",
  "Levi Groen",
  "Yara de Groot",
  "Bram de Haan",
  "Sophie Hendriks",
  "Mason Hermans",
  "Nora Hoekstra",
  "Mees Hofman",
  "Saar Huisman",
  "Max Jacobs",
  "Lieke Janssen",
  "Mats Jansen",
  "Noor de Jong",
  "Jens Klein",
  "Anna Kok",
  "Adam Koopman",
  "Fenno Koster",
  "Evi Kramer",
  "Sam Kuipers",
  "Lina van Leeuwen",
  "Guus van der Linden",
  "Elias Meijer",
  "Isa Mulder",
  "Julian Peters",
  "Roos Prins",
  "Thijs Sanders",
  "Fleur Schouten",
  "Jesse Smit",
  "Lisa Timmermans",
  "Vince Visser",
  "Maud Vos",
  "Floris de Vries",
  "Gijs van der Wal",
  "Bo Willems",
  "Stijn Wolters",
  "Juna Zwart"
].sort((a, b) => {
    // Helper om op achternaam te sorteren
    const lastNameA = a.split(' ').slice(-1)[0];
    const lastNameB = b.split(' ').slice(-1)[0];
    return lastNameA.localeCompare(lastNameB);
});
