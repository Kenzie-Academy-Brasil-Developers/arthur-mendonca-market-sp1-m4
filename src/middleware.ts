import { NextFunction, Response, Request } from "express";
import { marketProducts } from "./database";
import { PickName, TRequestProduct } from "./interfaces";

export const verifyProductId = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const id = parseInt(request.params.id);

  const findIndex = marketProducts.findIndex((prod) => prod.id === id);

  if (findIndex === -1) {
    return response.status(404).json({ error: "Product not found." });
  }

  response.locals.marketProducts = findIndex;

  return next();
};

export const verifyNameRepetitionByCreation = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const requestBody: TRequestProduct[] = request.body;
  const names = marketProducts.map((prod) => prod.name);
  //   console.log(names);
  const duplicateNames = requestBody.filter((requestProd) =>
    names.includes(requestProd.name)
  );

  if (duplicateNames.length > 0) {
    return response.status(409).json({
      error: `Product(s) with name ${duplicateNames
        .map((e) => e.name)
        .join(", ")} already exist(s) in the database.`,
    });
  }

  return next();
};

export const verifySameNamePatch = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const newName: PickName = request.body;

  const duplicateNamesToPatch = marketProducts.filter(
    (prod) => prod.name === newName.name
  );

  if (duplicateNamesToPatch.length > 0) {
    return response
      .status(409)
      .json({ error: "This name already exists. Choose another." });
  }

  return next();
};

export const avoidForbiddenPatch = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const forbiddenRequest = request.body;
  const words = ["section", "id", "expirationDate"];

  const cannotPatch = Object.keys(forbiddenRequest).some((key) =>
    words.includes(key)
  );

  if (cannotPatch) {
    return response.status(400).json({ error: "Forbidden request." });
  }

  return next();
};

// Um midware para verificar se o produto existe para a rota de GET e outro para a rota de PATCH
