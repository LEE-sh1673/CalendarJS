class Node {
  constructor(id = 0, prev = null, next = null) {
    this.id = id;
    this.prev = prev;
    this.next = next;
  }
}

class Dequeue {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  isEmpty() {
    return this.size === 0;
  }

  addFront(id) {
    let newNode = new Node();
    newNode.id = id;

    this.size++;

    if (this.size === 1) {
      this.first = newNode;
      this.last = newNode;
    } else {
      let oldFront = this.first;
      this.first = newNode;
      newNode.next = oldFront;
      oldFront.prev = newNode;
    }
    this.first.prev = this.last;
    this.last.next = this.first;
  }

  addLast(id) {
    let newNode = new Node();
    newNode.id = id;

    this.size++;

    if (this.size === 1) {
      this.first = newNode;
      this.last = newNode;
    } else {
      let oldLast = this.last;
      this.last = newNode;
      newNode.prev = oldLast;
      oldLast.next = newNode;
    }
    this.first.prev = this.last;
    this.last.next = this.first;
  }

  removeFront() {
    if (!this.isEmpty()) {
      removedId = this.first.id;
      this.size--;
      this.first = this.first.next;

      if (this.size === 0) {
        this.last = null;
      } else {
        this.first.prev = null;
      }
      return removedId;
    }
  }

  removeLast() {
    if (!this.isEmpty()) {
      removedId = this.last.id;
      this.size--;
      this.last = this.last.prev;

      if (this.size === 0) {
        this.first = null;
      } else {
        this.last.next = null;
      }
      return removedId;
    }
  }
}

export class CalendarArrowController {
  constructor(numsElement) {
    this.controller = new Dequeue();
    for (let i = 0; i < numsElement; i++) {
      this.controller.addLast(i);
    }
    this.resetPoint = this.controller.first;
    this.controller = this.controller.first;
  }

  nextElement() {
    const nextElem = this.controller.next.id;
    this.controller = this.controller.next;
    return nextElem;
  }

  prevElement() {
    const prevElem = this.controller.prev.id;
    this.controller = this.controller.prev;
    return prevElem;
  }

  resetElement() {
    this.controller = this.resetPoint;
  }
}
