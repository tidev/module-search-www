// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";

import data from "../../../data.json";

const modules = (req: NextApiRequest, res: NextApiResponse) => {
  const searchTerm = req.query.search;

  if (!searchTerm) {
    res.statusCode = 200;
    return res.json(data);
  }

  if (Array.isArray(searchTerm)) {
    res.statusCode = 400;
    return res.json({ message: "Only provide on search term" });
  }

  res.statusCode = 200;
  return res.json(
    data.filter(({ description, name }) => {
      return (
        description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );
};

export default modules;
