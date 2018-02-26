var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {

  return  'CREATE TABLE Country(name TEXT NOT NULL, code INTEGER NOT NULL, gdp INTEGER, population INTEGER);';
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {

  return 'CREATE TABLE GoldMedal(id INTEGER PRIMAY KEY, year INTEGER NOT NULL, city TEXT NOT NULL, season TEXT NOT NULL, name TEXT NOT NULL, country TEXT NOT NULL, gender TEXT NOT NULL, sport TEXT NOT NULL, discipline TEXT NOT NULL, event TEXT NOT NULL);';
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = country => {
    return `SELECT COUNT(*) AS count FROM GoldMedal WHERE country = '${country}';`;
};


/*
Returns a SQL query string that will find the year where the given country
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const checkSeason = (season, country) => {
  if (['Summer', 'Winter'].includes(season)) {
    return `SELECT year, COUNT(*) AS count FROM GoldMedal WHERE country = '${country}' AND SEASON = '${season}' GROUP BY 1 ORDER BY 2 DESC LIMIT 1;`
  }
};

const mostSummerWins = country => {
  return checkSeason('Summer', country);

};

/*
Returns a SQL query string that will find the year where the given country
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
  return checkSeason('Winter', country);

};

/*
Returns a SQL query string that will find the year where the given country
won the most medals, along with the number of medals aliased to 'count'.
*/

const checkFields = (field, country) => {
  if (['year', 'discipline', 'sport', 'event'].includes(field)) {
    return `SELECT ${field}, COUNT(*) AS count FROM GoldMedal WHERE country = '${country}' GROUP BY 1 ORDER BY 2 DESC LIMIT 1;`;
  }
};

const bestYear = country => {
  return checkFields('year', country);
};

/*
Returns a SQL query string that will find the discipline this country has
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
  return checkFields('discipline', country);
};

/*
Returns a SQL query string that will find the sport this country has
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
  return checkFields('sport', country);
};

/*
Returns a SQL query string that will find the event this country has
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  return checkFields('event', country);
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const checkGenders = (gender, country) => {
  if (['Men', 'Women'].includes(gender)) {
    return `SELECT COUNT(DISTINCT name) AS count FROM GoldMedal WHERE country = '${country}' AND gender = '${gender}';`;
  }
};

const numberMenMedalists = country => {
  return checkGenders('Men', country);
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  return checkGenders('Women', country);
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
  return `SELECT name FROM GoldMedal WHERE country = '${country}' GROUP BY 1 ORDER BY COUNT(*) DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/


const orderedMedals = (country, field, sortAscending) => {

  if (!field) {
    return `SELECT * FROM GoldMedal WHERE country = '${country}';`;
  }

  if (sortAscending) {
    return `SELECT * FROM GoldMedal WHERE country = '${country}' GROUP BY ${field} ORDER BY ${field} ASC;`;
  } else {
    return `SELECT * FROM GoldMedal WHERE country = '${country}' GROUP BY ${field} ORDER BY ${field} DESC;`;
  }

};


/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  if (!field) {
    return `SELECT sport, COUNT(sport) AS count, 100 * COUNT(*) / (SELECT COUNT(*) FROM GoldMedal  WHERE country ='${country}') AS percent FROM GoldMedal WHERE country ='${country}' GROUP BY 1;`;
  }

  if (sortAscending) {
    return `SELECT sport, COUNT(sport), 100 * COUNT(*) / (SELECT COUNT(*) FROM GoldMedal  WHERE country ='${country}') AS percent FROM GoldMedal WHERE country ='${country}' GROUP BY 1 ORDER BY ${field} ASC;`;
  } else {
    return `SELECT sport, COUNT(sport) AS count, 100 * COUNT(*) / (SELECT COUNT(*) FROM GoldMedal  WHERE country ='${country}') AS percent FROM GoldMedal WHERE country ='${country}' GROUP BY 1 ORDER BY ${field} DESC;`;
  }

};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
