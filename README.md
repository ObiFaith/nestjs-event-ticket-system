# Event & Ticketing System – Backend Technical Test

## Overview

This project is a backend implementation of a simplified event and ticketing system that allows users to:

- Create accounts
- Create events
- Define ticket types with limited availability
- Reserve tickets in a cart-based flow before checkout

The primary focus of this implementation is correctness, data consistency, and concurrency safety, especially around ticket reservation and overbooking prevention.

> Payment and checkout flows are intentionally out of scope.

## Core Design Goals

- Prevent overbooking under concurrent requests
- Support temporary ticket reservation via carts
- Enforce event and ticket sale validity rules
- Keep the system simple, explicit, and extensible

## Tech Stack

- **NestJS** – Application framework
- **TypeORM** – ORM and transaction management
- **PostgreSQL** – Relational database (row-level locking support)
- **JWT Authentication** – Minimal auth for protected routes

## Domain Model Overview

### Key Entities

- **User**
  - Authenticated system user
  - Can create events and reserve tickets

- **Event**
  - Created by a user
  - Has a lifecycle (ACTIVE, CANCELLED, ENDED)
  - Owns one or more ticket types

- **TicketType**
  - Represents a purchasable ticket category
  - Has limited availability
  - Supports sale start and end times

- **Cart**
  - Represents a temporary reservation container
  - One active cart per user
  - Automatically expires

- **CartItem**
  - Represents reserved tickets for a specific ticket type
  - Enforces uniqueness per cart and ticket type

## Ticket Availability Model

Each ticket type tracks availability using explicit counters:

- `totalQuantity`
- `reservedQuantity`
- `soldQuantity`

Available tickets are derived as:

```sh
available = totalQuantity - reservedQuantity - soldQuantity
```

This model allows:

- Temporary reservation
- Safe rollback on cart expiration
- Future extension to checkout and payment

## Cart-Based Reservation Flow

### High-Level Flow

1. User attempts to add tickets to cart
2. System validates:

- User authentication
- Event is active
- Ticket sale window is valid

3. Tickets are reserved inside a database transaction
4. Reservation expires automatically if checkout is not completed

## Concurrency & Overbooking Prevention

### Why This Matters

Ticketing systems are highly susceptible to race conditions, especially when:

- Only one ticket remains
- Multiple users act at the same time
- Users double-click actions unintentionally

> This implementation is designed to be safe under concurrent requests.

### Reservation Strategy

When adding tickets to a cart:

1. A database transaction is started
2. The ticket type row is locked using a row-level lock
3. Availability is recalculated inside the transaction
4. If sufficient tickets exist:
   - reservedQuantity is incremented
   - Cart item is created or updated

5. The transaction is committed

> If availability is insufficient, the transaction is rolled back.

## Concurrency Scenarios Covered

**Scenario 1**: Two users attempt to reserve the last ticket

- First transaction locks the ticket row and succeeds
- Second transaction waits, then fails due to zero availability

**Result**: No overbooking

**Scenario 2**: Same user double-clicks “`Add to Cart`”

- Requests target the same cart and ticket type
- Unique constraint on (cartId, ticketTypeId)
- Quantity is updated atomically inside a transaction

**Result**: No duplicate reservations

## Cart Expiration Handling

Each cart has an expiresAt timestamp.

### Expiration Strategy

When a user interacts with a cart:

- If expired, the cart is marked as expired
- Reserved tickets are released
- A new cart is created if needed

> This approach avoids background jobs while still guaranteeing correctness.

## Business Rules Enforced

Tickets cannot be added to a cart if:

- The event has ended
- The event is cancelled
- The ticket sale period has not started
- The ticket sale period has ended
- Requested quantity exceeds availability

## Intentional Trade-offs

To stay focused on core correctness, the following were intentionally excluded:

- Payment processing
- Checkout and order creation
- Background jobs (Redis, queues)
- Notifications
- Admin dashboards

> The data model and reservation logic are designed to support these features in future iterations.

## Why This Approach

The main risk in an event ticketing system is overselling tickets under load.
This implementation prioritizes:

- Database-level correctness
- Explicit business rules
- Predictable behavior under concurrency

> Additional features can be layered on safely once these guarantees are in place.

## Future Improvements

If extended further, the next steps would include:

- Checkout and order finalization
- Redis-backed background jobs for cart expiration
- Webhooks and notifications
- Horizontal scaling strategies

## Final Notes

Given the time constraints, the focus was placed on the hardest and most critical parts of the system: ticket reservation and concurrency handling.

> The goal was to demonstrate sound backend judgment, not feature completeness.
