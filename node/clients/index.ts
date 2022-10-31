import { IOClients } from "@vtex/api";
import { Catalog, OMS } from "@vtex/clients";
import Skus from "./sku";

import Status from "./status";

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
    public get status() {
        return this.getOrSet("status", Status);
    }

    public get catalog() {
        return this.getOrSet("catalog", Catalog);
    }

    public get oms() {
        return this.getOrSet("oms", OMS);
    }

    public get skus() {
        return this.getOrSet("skus", Skus);
    }
}
