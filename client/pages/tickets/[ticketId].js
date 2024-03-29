import userRequest from "../../hooks/user-request";

const TicketShow = ({ticket}) =>{
    const {doRequest, errors} = userRequest({
        url: "/api/orders",
        method: "post",
        body:{
            ticketId: ticket.id
        },
        onSuccess: (order) => console.log(order)
    });

    return (
      <div>
        <h1>{ticket.title}</h1>
        <h4>Price: {ticket.price}</h4>
        {errors}
        <button onClick={(_e) => doRequest()} className="btn btn-primary">
          Purchase
        </button>
      </div>
    );
}

TicketShow.getInitialProps = async (context, client) =>{
    const {ticketId} = context.query;
    const {data} = await client.get(`/api/tickets/${ticketId}`);

    return {ticket: data};
}

export default TicketShow;