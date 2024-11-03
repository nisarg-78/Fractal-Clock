function main() {
	let toolbar = document.getElementById("toolbar")
	toolbar.addEventListener("mouseover", () => {
		document.getElementById("toolbar").style.opacity = 1
	})
	toolbar.addEventListener("mouseout", () => {
		document.getElementById("toolbar").style.opacity = 0
	})
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")

	window.onresize = function () {
		setupCanvas(ctx)
	}
	setupCanvas(ctx)
	function animate() {
		draw(ctx)
		window.requestAnimationFrame(animate)
	}

	animate()
}

function setupCanvas(ctx) {
	ctx.canvas.width = window.innerWidth
	ctx.canvas.height = window.innerHeight
	ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
	ctx.rotate((-90 * Math.PI) / 180)
	ctx.fillStyle = "transparent"
}

function clearCanvas() {
	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")
	ctx.save()
	ctx.setTransform(1, 0, 0, 1, 0, 0)
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.restore()
}

function draw(ctx) {
	clearCanvas()
	const origin = { x: 0, y: 0 }
	const date = new Date()

	const hr = date.getHours()
	const min = date.getMinutes()
	const sec = date.getSeconds()
	const ms = date.getMilliseconds()
	const sec_degree = (sec + ms / 1000) * 6
	const min_degree = min * 6 + sec_degree / 60
	const hr_degree = hr * 30 + min_degree / 12 + sec_degree / 720

	const length = parseInt(document.getElementById("length").value, 10) * 3
	const depth = parseInt(document.getElementById("depth").value, 10)
	const color = document.getElementById("color").checked

	ctx.strokeStyle = color ? `hsl(${Math.abs(sec_degree)} 100% 50%)` : "white"
	
	// draw hr hand
	ctx.beginPath()
	ctx.lineWidth = 2
	ctx.moveTo(origin.x, origin.y)
	const hr_end = getEnd(origin, length * 0.55, hr_degree)
	ctx.lineTo(hr_end.x, hr_end.y)
	ctx.stroke()

	// recursively draw min and sec hands
	function recur(currDepth, maxDepth, date, point, angleOffset = 0) {
		if (currDepth === maxDepth) return
		const { min_end, sec_end, newOffset } = drawMinAndSec(
			ctx,
			date,
			point,
			currDepth,
			angleOffset,
			length
		)
		recur(currDepth + 1, maxDepth, date, min_end, newOffset.m)
		recur(currDepth + 1, maxDepth, date, sec_end, newOffset.s)
	}
	recur(0, depth + 1, date, origin)
}

function drawMinAndSec(ctx, date, point, currDepth, angleOffset, length) {
	const min = date.getMinutes()
	const sec = date.getSeconds()
	const ms = date.getMilliseconds()
	const sec_degree = (sec + ms / 1000) * 6
	const min_degree = min * 6 + sec_degree / 60

	if (currDepth === 0) ctx.lineWidth = 2
	else ctx.lineWidth  = (1 - (currDepth / 10)) 

	if (currDepth > 0) length = length * (1 - (currDepth / 10))

	const alpha = (currDepth === 0) ? 1 : (1 - (currDepth / 10))
	ctx.globalAlpha = alpha

	//draw second hand
	ctx.beginPath()
	ctx.moveTo(point.x, point.y)
	const sec_end = getEnd(point, length, sec_degree + angleOffset)
	ctx.lineTo(sec_end.x, sec_end.y)
	ctx.stroke()

	//draw minute hand
	ctx.beginPath()
	ctx.moveTo(point.x, point.y)
	const min_end = getEnd(point, length, min_degree + angleOffset)
	ctx.lineTo(min_end.x, min_end.y)
	ctx.stroke()

	ctx.globalAlpha = 1

	const newOffset = {
		m:
			min_degree +
			angleOffset +
			Math.min(180 - minHrAngle(date), minHrAngle(date)),
		s:
			sec_degree +
			angleOffset +
			Math.min(180 - minHrAngle(date), minHrAngle(date)),
	}

	return { min_end, sec_end, newOffset }
}

function getEnd(point, length, angle) {
	const x = length * Math.cos((angle * Math.PI) / 180)
	const y = length * Math.sin((angle * Math.PI) / 180)
	return { x: point.x + x, y: point.y + y }
}

function minHrAngle(date) {
	const hr = date.getHours()
	const min = date.getMinutes()
	const sec = date.getSeconds()
	const ms = date.getMilliseconds()
	const sec_degree = (sec + ms / 1000) * 6
	const hr_degree = hr * 30
	const min_degree = min * 6 + sec_degree / 60
	const angle = hr_degree + min_degree / 12
	return angle % 360
}

main()
