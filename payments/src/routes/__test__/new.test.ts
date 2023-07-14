import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@preeti097/common";

import {app} from "../../app";
import { Order } from "../../models/order";

const url = '/api/payments';

it("Return 404 if order does not exist", async ()=>{
    await request(app).post(url).set("Cookie", global.signin()).send({
      token: "dxcvbanld",
      orderId: new mongoose.Types.ObjectId().toHexString()
    }).expect(404)
});

it("Return 401 if order does not exist to the loggedIn User", async ()=>{
   const order = Order.build({
     id: new mongoose.Types.ObjectId().toHexString(),
     price: 10,
     version: 0,
     status: OrderStatus.Created,
     userId: new mongoose.Types.ObjectId().toHexString(),
   });
   await order.save();

    await request(app).post(url).set("Cookie", global.signin()).send({
      token: "dxcvbanld",
      orderId: order.id
    }).expect(401)
});

it("Return 400 when purchasing a cancelled order", async ()=>{
     const order = Order.build({
       id: new mongoose.Types.ObjectId().toHexString(),
       price: 10,
       version: 0,
       status: OrderStatus.Cancelled,
       userId: new mongoose.Types.ObjectId().toHexString(),
     });
     await order.save();

     await request(app)
       .post(url)
       .set("Cookie", global.signin(order.userId))
       .send({
         token: "dxcvbanld",
         orderId: order.id,
       })
       .expect(400);

})
