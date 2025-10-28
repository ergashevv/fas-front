# Integration Test Outline

- Create order (guest): POST /api/orders with items and contact/region
- Quote shipping: GET /api/shipping/quote
- Initiate payment: POST /api/payments/payme/create -> receive intentId, redirectUrl
- Simulate webhook: POST /api/payments/payme/webhook with valid signature -> order.status -> paid
- Notify Telegram: POST /api/notify/telegram with message
- Assert order transitions: awaiting_payment -> paid -> packing -> shipped -> delivered