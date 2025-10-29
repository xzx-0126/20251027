/*
By Okazz
*/
let colors = ['#e6302b', '#fbd400', '#36ad63', '#2B50AA', '#232323', '#f654a9'];
let ctx;
let centerX, centerY;
let bubbles = [];
// sidebar (hidden slide-out menu)
let sidebarWidth = 260;
let sidebarX;
let sidebarTargetX;
let sidebarPadding = 20;
let sidebarOpenThreshold = 100; // 當滑鼠移到畫布最左端 100px 時展開
let sidebarEasing = 0.12; // lerp 緩動速度
// iframe handling
let iframeEl = null;
let iframeCloseBtn = null;
let iframeURL = 'https://hackmd.io/@5u87lFBzRZqp_vxN4Y5Ocw/ry2uzBCixe';
// 第一單元作品 URL
let projectURL = 'https://xzx-0126.github.io/20251020/';

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	colorMode(HSB, 360, 100, 100, 100);
	ctx = drawingContext;
	centerX = width / 2;
	centerY = height / 2;

	// 初始化 sidebar 位置（隱藏於畫面左側）
	sidebarX = -sidebarWidth;
	sidebarTargetX = -sidebarWidth;
	let area = width * 0.85;
	let cellCount = 8;
	let cellSize = area / cellCount;
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let x = cellSize * i + (cellSize / 2) + (width - area) / 2;
			let y = cellSize * j + (cellSize / 2) + (height - area) / 2; 
			bubbles.push(new Bubble(x, y + cellSize * 0.2, cellSize * 0.4));
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	centerX = width / 2;
	centerY = height / 2;
	// 若 iframe 存在，重新調整尺寸並置中
	if (iframeEl) {
		let w = floor(windowWidth * 0.7);
		let h = floor(windowHeight * 0.85);
		let left = floor((windowWidth - w) / 2);
		let top = floor((windowHeight - h) / 2);
		iframeEl.style('width', w + 'px');
		iframeEl.style('height', h + 'px');
		iframeEl.style('left', left + 'px');
		iframeEl.style('top', top + 'px');
		if (iframeCloseBtn) {
			// 把關閉按鈕放在 iframe 右上角
			iframeCloseBtn.style('left', (left + w - 36) + 'px');
			iframeCloseBtn.style('top', (top + 8) + 'px');
		}
	}
}

function mousePressed() {
	// 只在左側 sidebar 可見範圍內判斷點擊
	// 注意：sidebarX 是動態的，點擊時若尚未完全打開仍可點選（視覺上可能不在視窗內）
	let itemYStart = sidebarPadding;
	let itemHeight = 30 + 16; // textSize(30) + spacing
	// 檢查每一項是否被點選
	for (let i = 0; i < 4; i++) {
		let itemTop = itemYStart + i * itemHeight;
		let itemBottom = itemTop + 30; // 文字高度約 30
		let leftBound = sidebarX + sidebarPadding;
		let rightBound = sidebarX + sidebarWidth;
		if (mouseX >= leftBound && mouseX <= rightBound && mouseY >= itemTop && mouseY <= itemBottom) {
			// 第二個項目（index 1）為「第一單元講義」
			if (i === 0) {
				// 第一單元作品
				if (!iframeEl) {
					createIframe(projectURL);
				}
			}
			if (i === 1) {
				// 第一單元講義
				if (!iframeEl) {
					createIframe(iframeURL);
				}
			}
			// 第四個項目（index 3）為「回到首頁」：重設到初始畫面
			if (i === 3) {
				resetToInitialState();
			}
			// 其他選項未綁定動作（可擴充）
		}
	}
}

function resetToInitialState() {
	// 關閉任何開啟的 iframe
	removeIframe();

	// 重設 sidebar 狀態為隱藏
	sidebarX = -sidebarWidth;
	sidebarTargetX = -sidebarWidth;

	// 重建初始的 bubbles 陣列（與 setup() 中相同的配置）
	bubbles = [];
	let area = width * 0.85;
	let cellCount = 8;
	let cellSize = area / cellCount;
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let x = cellSize * i + (cellSize / 2) + (width - area) / 2;
			let y = cellSize * j + (cellSize / 2) + (height - area) / 2;
			bubbles.push(new Bubble(x, y + cellSize * 0.2, cellSize * 0.4));
		}
	}

	// 重設中心座標
	centerX = width / 2;
	centerY = height / 2;
}

function createIframe(url) {
	// 建立 iframe 並置中，寬 70%，高 85%
	let w = floor(windowWidth * 0.7);
	let h = floor(windowHeight * 0.85);
	let left = floor((windowWidth - w) / 2);
	let top = floor((windowHeight - h) / 2);

	iframeEl = createElement('iframe');
	iframeEl.attribute('src', url);
	iframeEl.style('position', 'fixed');
	iframeEl.style('left', left + 'px');
	iframeEl.style('top', top + 'px');
	iframeEl.style('width', w + 'px');
	iframeEl.style('height', h + 'px');
	iframeEl.style('border', '2px solid rgba(0,0,0,0.6)');
	iframeEl.style('z-index', '9999');
	iframeEl.style('background', '#ffffff');
	iframeEl.style('box-shadow', '0 8px 24px rgba(0,0,0,0.3)');

	// close button
	iframeCloseBtn = createButton('✕');
	iframeCloseBtn.style('position', 'fixed');
	iframeCloseBtn.style('left', (left + w - 36) + 'px');
	iframeCloseBtn.style('top', (top + 8) + 'px');
	iframeCloseBtn.style('width', '28px');
	iframeCloseBtn.style('height', '28px');
	iframeCloseBtn.style('padding', '0');
	iframeCloseBtn.style('border', 'none');
	iframeCloseBtn.style('background', 'rgba(0,0,0,0.6)');
	iframeCloseBtn.style('color', '#fff');
	iframeCloseBtn.style('font-size', '16px');
	iframeCloseBtn.style('border-radius', '4px');
	iframeCloseBtn.style('z-index', '10000');
	iframeCloseBtn.mousePressed(removeIframe);
}

function removeIframe() {
	if (iframeEl) {
		iframeEl.remove();
		iframeEl = null;
	}
	if (iframeCloseBtn) {
		iframeCloseBtn.remove();
		iframeCloseBtn = null;
	}
}

function draw() {
	background(255);
	for (let b of bubbles) {
		b.run();
	}

	// --- sidebar: 判斷是否要展開，並用 lerp 平滑移動 ---
	if (mouseX <= sidebarOpenThreshold) {
		sidebarTargetX = 0;
	} else {
		sidebarTargetX = -sidebarWidth;
	}
	sidebarX = lerp(sidebarX, sidebarTargetX, sidebarEasing);

	// 繪製 sidebar（在最上層）
	push();
	// 這裡使用 CORNER 模式畫出左側面板
	rectMode(CORNER);
	noStroke();
	// 背景使用 HSB：灰色調
	fill(0, 0, 95);
	rect(sidebarX, 0, sidebarWidth, height);

	// 選單文字
	textSize(30); // 30px
	textAlign(LEFT, TOP);
	fill(0, 0, 10); // 深色文字
	let opts = ['第一單元作品', '第一單元講義', '測驗系統', '回到首頁'];
	let y = sidebarPadding;
	for (let i = 0; i < opts.length; i++) {
		text(opts[i], sidebarX + sidebarPadding, y + i * (30 + 16));
	}
	pop();
}


function aetherLink(x1, y1, d1, x2, y2, d2, dst) {
	let r = dst / 2;

	let r1 = d1 / 2;
	let r2 = d2 / 2;
	let R1 = r1 + r;
	let R2 = r2 + r;

	let dx = x2 - x1;
	let dy = y2 - y1;
	let d = sqrt(dx * dx + dy * dy);

	if (d > R1 + R2) {
		return;
	}

	let dirX = dx / d;
	let dirY = dy / d;

	let a = (R1 * R1 - R2 * R2 + d * d) / (2 * d);
	let underRoot = R1 * R1 - a * a;
	if (underRoot < 0) return;
	let h = sqrt(underRoot);


	let midX = x1 + dirX * a;
	let midY = y1 + dirY * a;

	let perpX = -dirY * h;
	let perpY = dirX * h;

	let cx1 = midX + perpX;
	let cy1 = midY + perpY;

	let cx2 = midX - perpX;
	let cy2 = midY - perpY;

	if (dist(cx1, cy1, cx2, cy2) < r * 2) {
		return;
	}

	let ang1 = atan2(y1 - cy1, x1 - cx1);
	let ang2 = atan2(y2 - cy1, x2 - cx1);
	let ang3 = atan2(y2 - cy2, x2 - cx2);
	let ang4 = atan2(y1 - cy2, x1 - cx2);

	if (ang2 < ang1) {
		ang2 += TAU;
	}
	beginShape();
	for (let i = ang1; i < ang2; i += TAU / 180) {
		vertex(cx1 + r * cos(i), cy1 + r * sin(i));
	}

	if (ang4 < ang3) {
		ang4 += TAU;
	}
	for (let i = ang3; i < ang4; i += TAU / 180) {
		vertex(cx2 + r * cos(i), cy2 + r * sin(i));
	}
	endShape();
}

function easeOutQuint(x) {
	return 1 - Math.pow(1 - x, 5);
}

class Bubble {
	constructor(x, y, d) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.cage = [];
		this.dst = this.d / 2;
		this.clr = random(colors);
	}

	show() {
		push();
		translate(this.x, this.y);
		noStroke();
		fill(this.clr);
		circle(0, 0, this.d);


		for (let c of this.cage) {
			c.run();

		}

		for (let c of this.cage) {
			aetherLink(c.x, c.y, c.d, 0, 0, this.d, this.dst);
		}

		for (let i = 0; i < this.cage.length; i++) {
			if (this.cage[i].isDead) {
				this.cage.splice(i, 1);
			}
		}

		if (random() < 0.02) {
			this.addWisp();
		}
		pop();

	}

	addWisp() {
		this.cage.push(new Wisp(0, 0, this.d * random(0.25, 0.75), this.d * random(0.75, 1.25)));
	}

	run() {
		this.show();
	}
}

class Wisp {
	constructor(x, y, d, r) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.timer = 0;
		this.endTime = int(random(60, 200));
		this.ang = random(TAU);
		this.r = r;
		this.originX = this.x;
		this.originY = this.y;
		this.targetX = this.x + this.r * cos(this.ang);
		this.targetY = this.y + this.r * sin(this.ang);
		this.originD = d;
		this.isDead = false;
	}

	show() {
		if (this.isDead == false) {
			circle(this.x, this.y, this.d);
		}
	}

	move() {
		this.timer++;
		if (0 < this.timer && this.timer < this.endTime) {
			let n = norm(this.timer, 0, this.endTime);
			this.x = lerp(this.originX, this.targetX, easeOutQuint(n));
			this.y = lerp(this.originY, this.targetY, easeOutQuint(n));
			this.d = lerp(this.originD, 0, n);
		}
		if (this.timer > this.endTime) {
			this.isDead = true;
		}
	}

	run() {
		this.show();
		this.move();
	}
}