import { Ticket } from "../ticket";

it("implements optimistic concurrency control by versioning ticket", async ()=>{
    const ticket = Ticket.build({
        title: "test ticket",
        price: 5,
        userId: "111"
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

     firstInstance!.set({price : 10});
     secondInstance!.set({price : 15});

     await firstInstance!.save();
     try{
        await secondInstance!.save();
     }catch(err){
        return;
     }

     throw new Error("Test will fail if it reaches here");
});

it("increments version numer on multiple saves", async () =>{
    const ticket = Ticket.build({
      title: "test ticket",
      price: 5,
      userId: "111",
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})