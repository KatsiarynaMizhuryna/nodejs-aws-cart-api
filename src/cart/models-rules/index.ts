// import { Cart, CartItem } from '../models';
import { CartItem } from "../../entities/cart_items";
import { Cart } from "../../entities/carts";

/**
 * @param {Cart} cart
 * @returns {number}
 */

export function calculateCartTotal(cart: Cart): number {
  return cart
      ? cart.items.reduce((acc: number, { product, count }: CartItem) => {
        return (acc += product.price * count);
      }, 0)
      : 0;
}
