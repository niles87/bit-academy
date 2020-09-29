import React from "react";
import { Link } from "react-router-dom";
import tiles from "./tiles.json";
import "./tiles.css";

interface tile {
  name: string;
  url: string;
}

export const Tiles = (props: any) => {
  let links: tile[];
  props.student ? (links = tiles.slice(0, tiles.length - 1)) : (links = tiles);
  return (
    <div className="tile-container">
      {links.map((tile: tile) => (
        <Link to={tile.url} key={tile.name} className="tile-link">
          <div className="tile">{tile.name}</div>
        </Link>
      ))}
    </div>
  );
};
