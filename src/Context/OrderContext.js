import React, { createContext } from "react";
import { useStickyState } from "../helpers/fetch";

export const OrderContext = createContext();

export const OrderProvider = (props) => {
  const [orden, setOrden] = useStickyState(null, "orden");
  return (
    <OrderContext.Provider value={[orden, setOrden]}>
      {props.children}
    </OrderContext.Provider>
  );
};
