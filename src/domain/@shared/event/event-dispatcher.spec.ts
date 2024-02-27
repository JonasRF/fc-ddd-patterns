import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import CustomerCreatedHandler1 from '../../customer/event/handler/customer-created-handle01.handler';
import CustomerCreatedHandler2 from '../../customer/event/handler/customer-created-handle02.handler';
import  AddressChangedHandler from '../../customer/event/handler/address-changed.handler';
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import Customer from "../../customer/entity/customer";
import Address from "../../customer/value-object/address";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify events when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const customerCreatedEventHandler1 = new CustomerCreatedHandler1();
    const customerCreatedEventHandler2 = new CustomerCreatedHandler2();

    const spyCustomerCreatedEventHandler1 = jest.spyOn(customerCreatedEventHandler1, "handle");
    const spyCustomerCreatedEventHandler2 = jest.spyOn(customerCreatedEventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", customerCreatedEventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", customerCreatedEventHandler2);

    new Customer("123", "Customer 01", eventDispatcher);

    expect(spyCustomerCreatedEventHandler1).toHaveBeenCalled();
    expect(spyCustomerCreatedEventHandler2).toHaveBeenCalled();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );
  });

  it("should notify events when customer address is changed", () => { 
    const eventDispatcher = new EventDispatcher();
    const addressChangedEventHandler = new AddressChangedHandler();
    const spyCustomerCreatedEventHandler1 = jest.spyOn(addressChangedEventHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", addressChangedEventHandler);

    const customer = new Customer("123", "Customer 1", eventDispatcher);
    customer.changeAddress(new Address("Rua 1", 123, "12345678", "Cidade 1"));

    expect(spyCustomerCreatedEventHandler1).toHaveBeenCalled();
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["AddressChangedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
    ).toMatchObject(addressChangedEventHandler);
  });
});
