import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

import useRequest from "../../hooks/user-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const {doRequest, errors} = useRequest({
    url : '/api/payments',
    method: 'post',
    body: {
        orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment)
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div>
        <h1>{order.ticket.title}</h1>
        <h3>Order Expired</h3>
      </div>
    );
  }

  return (
    <div>
      <h1>{order.ticket.title}</h1>
      <p>Time left to pay: {timeLeft} seconds</p>
      <StripeCheckout
        token={({id}) => doRequest({token : id})}
        stripeKey="pk_test_51NUzjUHWLWzp1DjSArpzHCHp61bfwVJzZwxMohodOIkvUwerPzhzKk9A4t2YSqUONH4zkRnYMTWvV5CEmIBr0weS00vvzpPALy"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

export default OrderShow;
