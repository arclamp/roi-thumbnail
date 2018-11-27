import { select } from 'd3-selection';

export default class CanvasImage {
  constructor (el, {width, height}) {
    this.el = el;
    this.width = width;
    this.height = height;

    this.ctx = this.el.getContext('2d');

    this.img = this.ctx.createImageData(this.width, this.height);

    select(this.el)
      .on('click', () => {
        const rect = event.target.getBoundingClientRect();
        this.click = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
      });
  }

  clear (r, g, b, a, { update = true } = {}) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.setPixel(i, j, { r, g, b, a, update: false });
      }
    }

    if (update) {
      this.update();
    }
  }

  setPixel (i, j, {r, g, b, a, update = true}) {
    const idx = j * this.width + i;

    if (r !== undefined) {
      this.img.data[4 * idx + 0] = r;
    }

    if (g !== undefined) {
      this.img.data[4 * idx + 1] = g;
    }

    if (b !== undefined) {
      this.img.data[4 * idx + 2] = b;
    }

    if (a !== undefined) {
      this.img.data[4 * idx + 3] = a;
    }

    if (update) {
      this.update();
    }
  }

  update () {
    this.ctx.putImageData(this.img, 0, 0);
  }
}
