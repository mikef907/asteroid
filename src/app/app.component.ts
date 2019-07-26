import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true})
  canvas: ElementRef;

  ctx: CanvasRenderingContext2D;
  ship: Ship;

  // $game: Observable;

  ngOnInit() {
    console.log(this.canvas);
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');

    console.log(this.ctx);

    this.ctx.canvas.width = 500;
    this.ctx.canvas.height = 500;
    this.ship = new Ship(this.ctx);
    // this.ship.draw();

    fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => {
      this.ship.direction += 1 * Math.PI / 180;
      this.ship.move();
    });
  }

  update() {
    this.ship.move();
  }
}

export class Ship {
  private x: number;
  private y: number;
  private v: number;
  private d: number;

  set direction(value) { this.d = value; }
  get direction() { return this.d; }

  constructor(private ctx: CanvasRenderingContext2D) {
    this.v = 0;
    this.d = 1 * Math.PI / 180;
    this.x = 100;
    this.y = 100;
  }

  move() {
    spinDrawing(this.draw, this.x, this.y, this.d, this.ctx);
  }

  draw = () => {
    // this.ctx.save();
    // this.ctx.rotate(this.d);
    this.ctx.beginPath();
    this.ctx.moveTo(75, 50);
    this.ctx.lineTo(100, 75);
    this.ctx.lineTo(100, 25);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    // draw your object
    // this.ctx.restore();
  }

  changeVelocity() {
    this.v += 0.1;
  }
}

export function drawPolygon(centerX,centerY,sideCount,size,strokeWidth,strokeColor,fillColor,rotationDegrees){
  var radians=rotationDegrees*Math.PI/180;
  ctx.translate(centerX,centerY);
  ctx.rotate(radians);
  ctx.beginPath();
  ctx.moveTo (size * Math.cos(0), size * Math.sin(0));          
  for (var i = 1; i <= sideCount;i += 1) {
      ctx.lineTo (size * Math.cos(i * 2 * Math.PI / sideCount), size * Math.sin(i * 2 * Math.PI / sideCount));
  }
  ctx.closePath();
  ctx.fillStyle=fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  ctx.fill();
  ctx.rotate(-radians);
  ctx.translate(-centerX,-centerY);    }

export function spinDrawing(drawFn: () => any, x: number, y: number, deg: number, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(deg);
  drawFn();
  //ctx.fillStyle = 'red';
  //ctx.fillRect(10 / -2, 10 / -2, 10, 10);
  // ctx.draw //your drawing function
  // ctx.translate(-200, -200);
  ctx.restore();
}
