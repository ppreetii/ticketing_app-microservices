import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
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
    </div>
  );
};

export default OrderShow;
