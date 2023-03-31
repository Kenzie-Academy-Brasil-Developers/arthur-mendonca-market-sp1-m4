import { Request, Response, NextFunction } from "express";
import { marketProducts } from "./database";
import {
  TCleaningProducts,
  IFoods,
  IPRoduct,
  TRequestProduct,
} from "./interfaces";

let counter: number = 1;

const createProduct = (request: Request, response: Response): Response => {
  const productData: TRequestProduct[] = request.body;
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const newProduct: Array<TCleaningProducts | IFoods> = productData.map(
    (prod: TRequestProduct) => {
      const productAdded: TCleaningProducts | IFoods = {
        id: counter++,
        ...prod,
        expirationDate: new Date(nextYear).toLocaleDateString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      };
      marketProducts.push(productAdded);
      return productAdded;
    }
  );

  const totalSum = marketProducts.reduce(
    (previousValue, currentValue) => previousValue + currentValue.price,
    0
  );

  return response.status(201).send({
    total: totalSum,
    marketProducts: newProduct,
  });
};

const getAllProducts = (request: Request, response: Response): Response => {
  const totalSum = marketProducts.reduce(
    (previousValue, currentValue) => previousValue + currentValue.price,
    0
  );
  return response.status(200).send({
    total: totalSum,
    marketProducts: marketProducts,
  });
};

const getProductById = (
  request: Request,
  response: Response
): Response | void => {
  const findIndex = response.locals.marketProducts;

  return response.status(200).json(marketProducts[findIndex]);
};

const deleteProduct = (
  request: Request,
  response: Response
): Response | void => {
  const findIndex = response.locals.marketProducts;

  marketProducts.splice(findIndex, 1);

  return response.status(204).send();
};

const updateProduct = (
  request: Request,
  response: Response
): Response | void => {
  const findIndex = response.locals.marketProducts;

  const updatedProduct = request.body;

  marketProducts[findIndex] = {
    ...marketProducts[findIndex],
    ...updatedProduct,
  };

  return response.status(200).json(marketProducts[findIndex]);
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
