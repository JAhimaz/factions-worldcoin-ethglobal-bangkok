"use client";

const Concat = (string: string) => {
  // turn any string into first three and last three characters seperated by ...
  return string.slice(0, 4) + "..." + string.slice(-4);
}

export default Concat;