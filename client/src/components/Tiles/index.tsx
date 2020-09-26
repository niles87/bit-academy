import React from "react";
import tiles from "./tiles.json";

interface tile {
  name: string;
  url: string;
}

export const Tiles = (props: any) => {
  let links: tile[];
  props.student ? (links = tiles.slice(0, 2)) : (links = tiles);
  return (
    <div className="tile-container">
      {links.map((tile: tile) => (
        <div className="tile" key={tile.name}>
          <a href={tile.url}>{tile.name}</a>
        </div>
      ))}
    </div>
  );
};
