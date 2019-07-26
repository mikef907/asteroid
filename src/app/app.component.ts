import { Component, ViewChild, OnInit, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild('canvas', { static: true })
	canvas: ElementRef;

	ctx: CanvasRenderingContext2D;
	ship: Ship;
	keys: { [key: number]: boolean } = {};
	bullets: Bullet[] = [];

	@HostListener('document:keyup', ['$event.which'])
	keyup(which) {
		this.keys[which] = false;
	}
	@HostListener('document:keydown', ['$event.which'])
	keydown(which) {
		this.keys[which] = true;
	}
	@HostListener('document:keypress', ['$event.which'])
	keypress(which) {
		if (which === 32) {
			this.bullets.push(this.ship.fire());
		}
	}

	ngOnInit(): void {
		console.log(this.canvas);
		// get the context
		const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
		this.ctx = canvasEl.getContext('2d');

		console.log(this.ctx);

		this.ctx.canvas.width = 500;
		this.ctx.canvas.height = 500;
		this.ship = new Ship(this.ctx);
	}

	ngAfterViewInit() {
		this.gameLoop();
	}

	gameLoop = () => {
		requestAnimationFrame(this.gameLoop);
		// Clear the canvas to be redrawn
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		// Parse ship position
		// rotation
		if (this.keys[37]) {
			this.ship.direction -= 0.05;
		}
		if (this.keys[39]) {
			this.ship.direction += 0.05;
		}

		// if (this.keys[32]) {
		// 	this.bullets.push(this.ship.fire());
		// }

		// thrust
		if (this.keys[38]) {
			this.ship.ax = Math.cos(this.ship.direction) * 0.05;
			this.ship.ay = Math.sin(this.ship.direction) * 0.05;
		} else {
			this.ship.ax = this.ship.ay = 0;
		}

		this.bullets.forEach((b, i) => {
			b.draw();
			if (b.lifespan <= 0) {
				this.bullets.splice(i, 1);
			}
		});
		this.ship.draw();
	}
}

export class ObjectBase {
	private x: number;
	private y: number;
	private d: number;
}

export class Ship {
	// position
	private x: number;
	private y: number;
	// velocity
	private vx: number;
	private vy: number;
	// acceleration
	public ax: number;
	public ay: number;
	// direction
	private d: number;

	set direction(value: number) {
		this.d = value;
	}
	get direction(): number {
		return this.d;
	}

	constructor(private ctx: CanvasRenderingContext2D) {
		this.vx = 0;
		this.vy = 0;
		this.d = 0;
		this.x = 100;
		this.y = 100;
	}

	private updatePosition() {
		// update velocity
		this.vx += this.ax;
		this.vy += this.ay;

		// add friction
		let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy),
			angle = Math.atan2(this.vy, this.vx);
		if (speed > 0.01) {
			speed -= 0.01;
		} else {
			speed = 0;
		}
		this.vx = Math.cos(angle) * speed;
		this.vy = Math.sin(angle) * speed;

		// update position
		this.x += this.vx;
		this.y += this.vy;

		// console.log(this.direction);
		// console.log('x', this.x);
		// console.log('y', this.y);
	}

	draw() {
		this.updatePosition();
		drawPolygon(this.x, this.y, 3, 10, 1, 'red', 'red', this.d, this.ctx);
	}

	fire() {
		return new Bullet(this.ctx, this.x, this.y);
	}
}

export class Bullet {
	private vx = 1;
	private vy = 1;
	public lifespan = 100;

	constructor(private ctx: CanvasRenderingContext2D, private x: number, private y: number) {}
	draw() {
		// this.ctx.moveTo(this.x, this.y);
		this.updatePosition();
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(this.x, this.y, 1, 1);
		// this.ctx.strokeRect(this.x, this.y, 1, 1);
	}

	updatePosition() {
		// update position
		this.x += this.vx;
		this.y += this.vy;

		this.lifespan--;
	}
}

export function drawPolygon(
	centerX,
	centerY,
	sideCount,
	size,
	strokeWidth,
	strokeColor,
	fillColor,
	rotationDegrees,
	ctx
) {
	// const radians = (rotationDegrees * Math.PI) / 180;
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate(rotationDegrees);
	ctx.beginPath();
	ctx.moveTo(size * Math.cos(0), size * Math.sin(0));
	for (let i = 1; i <= sideCount; i += 1) {
		ctx.lineTo(size * Math.cos((i * 2 * Math.PI) / sideCount), size * Math.sin((i * 2 * Math.PI) / sideCount));
	}
	ctx.closePath();
	ctx.fillStyle = fillColor;
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = strokeWidth;
	ctx.stroke();
	ctx.fill();
	ctx.restore();
}
