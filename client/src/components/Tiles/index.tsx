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
  props.user.student
    ? (links = tiles.slice(0, tiles.length - 1))
    : (links = tiles);
  return (
    <div className="tile-container">
      {links.map((tile: tile) =>
        tile.name === "Classroom" ? (
          <Link
            to={
              props.user.student
                ? tile.url + "/" + props.user.teacher
                : tile.url + "/" + props.user.id
            }
            key={tile.name}
            className="tile-link"
          >
            <div className="tile" id={tile.name}>
              <span>{tile.name}</span>
            </div>
          </Link>
        ) : (
          <Link to={tile.url} key={tile.name} className="tile-link">
            <div className="tile" id={tile.name}>
              <span>{tile.name}</span>
            </div>
          </Link>
        )
      )}
    </div>
  );
};
