import { Tile } from "./Tile";
import { showTiles } from "../utils/Tiles";

export const SortTiles = ({ sortOption }) => {
  let sortedTiles = [...showTiles()];
  if (sortOption === "alphabetical") {
    sortedTiles.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "category") {
    sortedTiles.sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
    );
  }

  const groupedByLetter = sortedTiles.reduce((acc, tile) => {
    const firstLetter = tile.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tile);
    return acc;
  }, {});

  const groupedTiles = sortedTiles.reduce((acc, tile) => {
    if (!acc[tile.category]) {
      acc[tile.category] = [];
    }
    acc[tile.category].push(tile);
    return acc;
  }, {});

  return (
    <div className="start">
      {sortOption === "category" ? (
        Object.keys(groupedTiles).map((category) => (
          <div key={category} className="category-section">
            <h2>{category}</h2>
            <hr className="category-divider" />
            <div className="tile-list">
              {groupedTiles[category].map((tile) => (
                <Tile
                  key={tile.title}
                  title={tile.title}
                  link={tile.link}
                  description={tile.description}
                  logo={tile.logo}
                />
              ))}
            </div>
          </div>
        ))
      ) : sortOption === "alphabetical" ? (
        Object.keys(groupedByLetter).map((letter) => (
          <div key={letter} className="letter-section">
            <h2>{letter}</h2>
            <hr className="letter-divider" />
            <div className="tile-list">
              {groupedByLetter[letter].map((tile) => (
                <Tile
                  key={tile.title}
                  title={tile.title}
                  link={tile.link}
                  description={tile.description}
                  logo={tile.logo}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="tile-list start">
          {sortedTiles.map((tile) => (
            <Tile
              key={tile.title}
              title={tile.title}
              link={tile.link}
              description={tile.description}
              logo={tile.logo}
            />
          ))}
        </div>
      )}
    </div>
  );
}