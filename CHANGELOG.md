# CHANGELOG

## 2.0.1
  - You must define an item id for it to be added to the cart. If the id is undefined then it won't allow you to add the addItem function to the queue.
  - Added a 400 error code to Queue.add.request which fires cartfox:cannotAddToCart when there is a 400 response from the server.

## 2.0.1
  - Set and get cartNotes via `Cart.getNote()` and `Cart.setNote()`
  - Removed Queues from README.md. They are private methods for now.
  - Fixed bug in rendering of currency with handlebars
  - Added examples/ folder with an example of a popup cart.

## 2.0
  - Included handlebars templating system for use when updating cart popups.