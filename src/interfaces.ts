export interface IPRoduct {
  id: number;
  name: string;
  price: number;
  weight: number;
  section: "food" | "cleaning";
  expirationDate: string;
}

export type TCleaningProducts = IPRoduct;

export interface IFoods extends IPRoduct {
  calories: number;
}

export type TRequestProduct = Omit<
  TCleaningProducts | IFoods,
  "id" | "expirationDate"
>;

export type PickName = Pick<IPRoduct, "name">;
