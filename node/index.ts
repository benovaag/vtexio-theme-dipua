import {
    ClientsConfig,
    ServiceContext,
    RecorderState,
    EventContext,
    method,
} from "@vtex/api";
import { LRUCache, Service } from "@vtex/api";

import { Clients } from "./clients";
import { GiftBag } from "./handlers/giftbag";

const catalogCache = new LRUCache<string, any>({ max: 3000 });

const THREE_SECONDS_MS = 1 * 1000;
const THIRTY_SECONDS_MS = 30 * 1000;

// Create a LRU memory cache for the Status client.
// The @vtex/api HttpClient respects Cache-Control headers and uses the provided cache.
const memoryCache = new LRUCache<string, any>({ max: 50 });

metrics.trackCache("status", memoryCache);

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
    // We pass our custom implementation of the clients bag, containing the Status client.
    implementation: Clients,
    options: {
        masterData: {
            concurrency: 10,
            memoryCache: catalogCache,
            timeout: THIRTY_SECONDS_MS,
        },
        default: {
            retries: 2,
            timeout: THREE_SECONDS_MS,
        },
    },
};

declare global {
    // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
    type Context = ServiceContext<Clients, State>;

    interface StatusChangeContext extends EventContext<Clients> {
        body: {
            domain: string;
            orderId: string;
            currentState: string;
            lastState: string;
            currentChangeDate: string;
            lastChangeDate: string;
        };
    }

    // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
    interface State extends RecorderState {
        code: number;
        payload: any;
    }
}

// Export a service that defines route handlers and client options.
export default new Service({
    clients,
    events: {},
    routes: {
        GiftBag: method({ GET: [GiftBag] }),
    },
});
