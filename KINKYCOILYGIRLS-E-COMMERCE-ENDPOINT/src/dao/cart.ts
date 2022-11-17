import { Keyable } from '../utilities/interface';
import Cart from '../models/cart';
import Order from '../models/order';
import { makeResponse } from '../utilities/response';
import { findMenuById } from '../dao/menu';
import { generatePaymentSession } from '../utilities/payment';

const createCart = async (author: Keyable): Promise<any> => {
  const cart = await new Cart({
    customer: author._id,
  }).save();
  if (!cart) {
    return makeResponse(false, 'CART_CREATION_ERROR', {});
  }
  return makeResponse(true, 'CART_CREATION_SUCCESS', cart);
};

const findCartByMatch = async (match: Keyable): Promise<any> => {
  return await Cart.findOne(match);
};

const pushItemToCartAndUpdateAmount = async (
  cartId: string,
  param: Keyable
) => {
  return await Cart.findOneAndUpdate(
    {
      _id: cartId,
    },
    {
      $push: {
        items: {
          $each: [param.item],
          $position: 0,
        },
      },
      totalAmount: param.totalAmount,
      totalQuantity: param.totalQuantity,
    },
    {
      new: true,
    }
  );
};

const checkoutUserCart = async (user: Keyable): Promise<any> => {
  let cart = await findCartByMatch({ customer: user._id });
  if (!cart) {
    return makeResponse(false, 'CART_NOT_FOUND', {});
  }
  if (cart.items.length === 0) {
    return makeResponse(false, 'CART_EMPTY', {});
  }

  var totalPrice = 0;
  var totalShipping = 0;
  var orderItems = [];
  var stripeItems = [];
  for (var i = 0; i < cart.items.length; i++) {
    let item = cart.items[i];
    var menu = await findMenuById(item.menu);
    if (!menu) {
      return makeResponse(false, 'MENU_NOT_FOUND', {});
    }
    var quantity = item.quantity;
    let cost = menu.price * quantity;
    totalPrice += cost;
    totalShipping += menu.shipping * quantity;

    orderItems.push({
      name: menu.name,
      price: cost,
      shipping: menu.shipping * quantity,
      quantity: quantity,
      menu: menu._id,
    });

    stripeItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: menu.name,
        },
        unit_amount: cost + menu.shipping * quantity,
      },
      quantity: 1,
    });
    item.remove();
  }
  var totalAmount = totalPrice + totalShipping;
  const paymentSession = await generatePaymentSession(stripeItems);
  cart.items = [];
  cart.totalAmount = 0;
  cart.totalQuantity = 0;

  let order = await new Order({
    customer: user._id,
    items: orderItems,
    totalAmount: totalAmount,
    totalShipping: totalShipping,
    config: paymentSession[1],
    delivery: user.address,
  }).save();

  cart = await cart.save();
  if (!cart) {
    return makeResponse(false, 'CHECKOUT_ERROR', {});
  }
  return makeResponse(true, 'CHECKOUT_SUCCESS', {
    paymentLink: paymentSession[0],
    order,
    config: paymentSession[1],
  });
};

export {
  createCart,
  findCartByMatch,
  pushItemToCartAndUpdateAmount,
  checkoutUserCart,
};
