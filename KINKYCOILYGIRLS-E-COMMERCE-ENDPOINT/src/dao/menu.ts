import { Keyable } from '../utilities/interface';
import Menu from '../models/menu';
import Cart from '../models/cart';
import { makeResponse } from '../utilities/response';
import {
  createCart,
  findCartByMatch,
  pushItemToCartAndUpdateAmount,
} from '../dao/cart';

const createAMenu = async (payload: Keyable): Promise<any> => {
  const menu = await new Menu(payload).save();
  if (!menu) {
    return makeResponse(false, 'MENU_CREATION_ERROR', {});
  }
  return makeResponse(true, 'MENU_CREATION_SUCCESS', menu);
};

const findAllMenus = async (sort: boolean = true): Promise<any> => {
  return await Menu.find().sort({ createdAt: sort ? -1 : 1 });
};

const findMenuById = async (id: string): Promise<any> => {
  return await Menu.findById(id);
};

const getAllAvailableMenus = async (): Promise<any> => {
  const menus = await findAllMenus();
  if (!menus) {
    return makeResponse(false, 'MENUS_UNAVAILABLE', menus);
  }
  return makeResponse(true, 'MENUS_QUERY_SUCCESS', menus);
};

const addMenuToCart = async (user: Keyable, payload: Keyable): Promise<any> => {
  let cart = await findCartByMatch({ customer: user._id });
  if (!cart) {
    cart = await createCart(user);
    if (!cart.status) {
      return makeResponse(false, cart.message, {});
    }
    cart = cart.data;
  }
  const menu = await findMenuById(payload.menuId);
  if (!menu) {
    return makeResponse(false, 'MENU_NOT_FOUND', {});
  }
  const cost: number = menu.price * payload.quantity;
  var cartItem = {
    item: {
      name: menu.name,
      price: menu.price,
      quantity: payload.quantity,
      shipping: menu.shipping,
      menu: menu._id,
    },
    totalAmount: cart.totalAmount + cost + menu.shipping * payload.quantity,
    totalQuantity: cart.totalQuantity + payload.quantity,
  };
  let duplicate = cart.items.find(
    (item: Keyable) => item.menu.toString() === menu._id.toString()
  );
  if (duplicate) {
    duplicate.quantity += payload.quantity;
    duplicate.price = cartItem.item.price;
    duplicate.shipping = cartItem.item.shipping;
    cart.totalAmount = cartItem.totalAmount;
    cart.totalQuantity = cartItem.totalQuantity;
    cart = await cart.save();
    if (!cart) {
      return makeResponse(false, 'CART_UPDATE_ERROR', {});
    }
    return makeResponse(true, 'CART_UPDATE_SUCCESS', cart);
  }
  cart = await pushItemToCartAndUpdateAmount(cart._id, cartItem);
  if (!cart) {
    return makeResponse(false, 'CART_UPDATE_ERROR', {});
  }
  return makeResponse(true, 'CART_UPDATE_SUCCESS', cart);
};

const removeMenuFromCart = async (
  user: Keyable,
  payload: Keyable
): Promise<any> => {
  let cart = await findCartByMatch({ customer: user._id });
  if (!cart) {
    return makeResponse(false, 'CART_NOT_FOUND', {});
  }
  const menu = await findMenuById(payload.menuId);
  if (!menu) {
    return makeResponse(false, 'MENU_NOT_FOUND', {});
  }
  let duplicate = cart.items.find(
    (item: Keyable) => item.menu.toString() === menu._id.toString()
  );
  if (!duplicate) {
    return makeResponse(false, 'MENU_NOT_FOUND_IN_CART', {});
  }
  cart.totalAmount =
    cart.totalAmount -
    duplicate.price * duplicate.quantity -
    duplicate.shipping * duplicate.quantity;
  cart.totalQuantity = cart.totalQuantity - duplicate.quantity;
  duplicate.remove();
  if (cart.items.length === 0) {
    cart.totalAmount = 0;
    cart.totalQuantity = 0;
  }
  cart = await cart.save();
  if (!cart) {
    return makeResponse(false, 'CART_UPDATE_ERROR', {});
  }
  return makeResponse(true, 'CART_UPDATE_SUCCESS', cart);
};

const getAUserCart = async (user: Keyable): Promise<any> => {
  let cart = await findCartByMatch({ customer: user._id });
  if (!cart) {
    cart = await createCart(user);
    if (!cart.status) {
      return makeResponse(false, cart.message, {});
    }
    return makeResponse(true, 'CART_QUERY_SUCCESS', cart.data);
  }
  return makeResponse(true, 'CART_QUERY_SUCCESS', cart);
};

export {
  getAllAvailableMenus,
  createAMenu,
  addMenuToCart,
  removeMenuFromCart,
  getAUserCart,
  findMenuById,
};
