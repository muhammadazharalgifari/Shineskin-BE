import { request, response } from "express";

const test = (req = request, res = response) => {
  try {
    res.json({
      message: "testing",
    });
  } catch (error) {
    console.log(error);
  }
};

export { test };
