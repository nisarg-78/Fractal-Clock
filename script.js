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

	// draw hr hand
	ctx.beginPath()
	ctx.lineWidth = 2
	const hue = parseInt(document.getElementById("color").value, 10)
	let hsl
	if (hue === 361) {
		hsl = `hsl(0, 0%, 100%)`
	} else {
		hsl = `hsl(${hue}, 100%, 50%)`
	}
	ctx.strokeStyle = hsl
	ctx.moveTo(origin.x, origin.y)
	const hr_end = getEnd(
		origin,
		parseInt(document.getElementById("length").value * 3, 10) * 0.65,
		hr_degree
	)
	ctx.lineTo(hr_end.x, hr_end.y)
	ctx.stroke()

	function recur(depth, maxDepth, date, point, angleOffset = 0) {
		if (depth === 0) return

		const { min_end, sec_end, newOffset, newLength } = drawMinAndSec(
			ctx,
			date,
			point,
			depth,
			maxDepth,
			angleOffset,
			parseInt(document.getElementById("length").value * 3, 10)
		)
		recur(depth - 1, maxDepth, date, min_end, newOffset.m, newLength)
		recur(depth - 1, maxDepth, date, sec_end, newOffset.s, newLength)
	}
	depth = parseInt(document.getElementById("depth").value, 10)
	maxDepth = depth
	recur(depth + 1, maxDepth + 1, date, origin)
}

function drawMinAndSec(ctx, date, point, depth, maxDepth, angleOffset, length) {
	const min = date.getMinutes()
	const sec = date.getSeconds()
	const ms = date.getMilliseconds()
	const sec_degree = (sec + ms / 1000) * 6
	const min_degree = min * 6 + sec_degree / 60

	const level = depth / maxDepth
	const opacity = parseInt(document.getElementById("opacity").value, 10)
	const alpha = level === 1 ? 1 : depth / (maxDepth / maxDepth + opacity)

	if (level === 1) {
		ctx.lineWidth = 2
	} else {
		ctx.lineWidth = 1
	}
	//draw second hand
	ctx.beginPath()
	ctx.globalAlpha = alpha
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
			Math.min(180 - minHrAngle(date), minHrAngle(date) + 10),
		s:
			sec_degree +
			angleOffset +
			Math.min(180 - minHrAngle(date), minHrAngle(date) + 10),
	}

	return { min_end, sec_end, newOffset, newLength: length }
}

function getEnd(point, length, angle) {
	const x = length * Math.cos((angle * Math.PI) / 180)
	const y = length * Math.sin((angle * Math.PI) / 180)
	return { x: point.x + x, y: point.y + y }
}

function minHrAngle(date) {
	const hr = date.getHours()
	const min = date.getMinutes()
	const hr_degree = hr * 30
	const min_degree = min * 6
	const angle = hr_degree + min_degree / 12
	return angle % 360
}

main()
