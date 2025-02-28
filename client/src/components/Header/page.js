import React from "react";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <div>
      <h1 cl>Header</h1>
      <div className="p-5">
        <Button className="bg-red-700">Hello</Button>
      </div>
    </div>
  );
}
