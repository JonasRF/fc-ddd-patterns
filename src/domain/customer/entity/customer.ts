import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import AddressChangedEvent from "../event/address-changed-event";
import CustomerCreatedEvent from "../event/customer-created-event";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispatcher: EventDispatcherInterface;

  constructor(
    id: string,
    name: string,
    eventDispatcher?: EventDispatcherInterface
  ) {
    this._name = name;
    this._id = id;
    this.validate();

    this._eventDispatcher = eventDispatcher;

    if (this._eventDispatcher) {
      const customerCreatedEvent = new CustomerCreatedEvent(this);
      this._eventDispatcher.notify(customerCreatedEvent);
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;
    if (this._eventDispatcher) {
      this._eventDispatcher.notify(new AddressChangedEvent(this));
    }
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
