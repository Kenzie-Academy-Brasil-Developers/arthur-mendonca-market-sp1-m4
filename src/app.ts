import express, { json, Application } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./logic";
import {
  avoidForbiddenPatch,
  verifyNameRepetitionByCreation,
  verifyProductId,
  verifySameNamePatch,
} from "./middleware";

const app: Application = express();

app.use(json());

app.post("/products", verifyNameRepetitionByCreation, createProduct);

app.get("/products", getAllProducts);

app.get("/products/:id", verifyProductId, getProductById);

app.patch(
  "/products/:id",
  verifyProductId,
  verifySameNamePatch,
  avoidForbiddenPatch,
  updateProduct
);

app.delete("/products/:id", verifyProductId, deleteProduct);

const PORT = 3000;
const runningMsg = `Server running on port ${PORT}.`;
app.listen(PORT, () => console.log(runningMsg));
